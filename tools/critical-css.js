#!/usr/bin/env node
/* Kritisches CSS pro Seite: Regeln aus css/style.css, die Elemente im ersten
   Bildschirm treffen (Breiten 390, 800, 1366 px), werden als
   <style id="critical-css"> in den <head> gesetzt. Das volle Stylesheet wird im
   <head> nur vorgeladen (rel=preload) und am Ende des <body> eingebunden.
   So blockiert es das erste Rendern nicht; danach gilt es vollständig und in
   unveränderter Reihenfolge, das Design bleibt gleich.

   Aufruf aus dem Repo-Wurzelverzeichnis, lokaler Server auf Port 8765:
     python3 -m http.server 8765 &   node tools/critical-css.js [--restore] [seite.html ...]
   --restore stellt den ursprünglichen Zustand (Stylesheet im <head>) wieder her.
   Idempotent: vor dem Neuberechnen wird jede Seite zuerst zurückgesetzt. */
const fs = require('fs');
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const BASE = 'http://localhost:8765/';
const VIEWPORTS = [[390, 844], [800, 1000], [1366, 900]];
const FOLD = 1.25; // Anteil der Fensterhöhe, der als "erster Bildschirm" gilt

function restore(html) {
  html = html.replace(/<style id="critical-css">[\s\S]*?<\/style>\n?/, '');
  html = html.replace(/<link rel="preload" href="([^"]*css\/style\.css)" as="style" data-critical>/, '<link rel="stylesheet" href="$1">');
  html = html.replace(/<link rel="stylesheet" href="[^"]*css\/style\.css" data-full-css>\n?/, '');
  return html;
}

function apply(html, css) {
  const m = html.match(/<link (?:rel="stylesheet" href="([^"]*css\/style\.css)"|href="([^"]*css\/style\.css)" rel="stylesheet"\/?)>/);
  if (!m) throw new Error('kein style.css-Link');
  const href = m[1] || m[2];
  // url() in style.css sind relativ zu css/; im Inline-Block relativ zur Seite
  css = css.replace(/url\((['"]?)\.\.\/assets\//g, (_, q) => `url(${q}${href.replace('css/style.css', '')}assets/`);
  html = html.replace(m[0], `<style id="critical-css">${css}</style>\n<link rel="preload" href="${href}" as="style" data-critical>`);
  // volles Stylesheet vor das erste Skript nach dem Footer (sonst vor </body>)
  const body = html.lastIndexOf('</footer>');
  let at = html.indexOf('<script', body >= 0 ? body : 0);
  if (at < 0) at = html.lastIndexOf('</body>');
  return html.slice(0, at) + `<link rel="stylesheet" href="${href}" data-full-css>\n` + html.slice(at);
}

async function collect(page) {
  return page.evaluate((FOLD) => {
    const sheet = [...document.styleSheets].find(s => s.href && s.href.endsWith('/css/style.css'));
    const H = window.innerHeight * FOLD;
    const strip = sel => sel
      .replace(/::?(before|after|placeholder|selection|marker|-webkit-[\w-]+|-moz-[\w-]+)/g, '')
      .replace(/:(hover|focus-visible|focus-within|focus|active|visited|checked|disabled|invalid|target)/g, '')
      .trim() || '*';
    const above = el => { const r = el.getBoundingClientRect(); return r.top + window.scrollY < H; };
    const keep = [];
    const walk = (rules, prefix) => {
      [...rules].forEach((r, i) => {
        const id = prefix + i;
        if (r instanceof CSSStyleRule) {
          if (/^(:root|html|body|\*)/.test(r.selectorText)) { keep.push(id); return; }
          for (const sel of r.selectorText.split(/,(?![^(]*\))/)) {
            let els; try { els = document.querySelectorAll(strip(sel)); } catch (e) { continue; }
            if ([...els].some(above)) { keep.push(id); return; }
          }
        } else if (r instanceof CSSFontFaceRule || r instanceof CSSKeyframesRule) {
          keep.push(id);
        } else if (r instanceof CSSMediaRule) {
          if (window.matchMedia(r.conditionText || r.media.mediaText).matches) walk(r.cssRules, id + '.');
        } else if (r.cssRules) {
          walk(r.cssRules, id + '.');
        }
      });
    };
    walk(sheet.cssRules, '');
    return keep;
  }, FOLD);
}

async function serialize(page, keep) {
  return page.evaluate((keep) => {
    const set = new Set(keep);
    const sheet = [...document.styleSheets].find(s => s.href && s.href.endsWith('/css/style.css'));
    const out = [];
    const walk = (rules, prefix) => {
      const parts = [];
      [...rules].forEach((r, i) => {
        const id = prefix + i;
        if (r.cssRules && !(r instanceof CSSKeyframesRule) && !(r instanceof CSSStyleRule)) {
          const inner = walk(r.cssRules, id + '.');
          if (inner.length) {
            const head = r.cssText.slice(0, r.cssText.indexOf('{')).trim();
            parts.push(head + '{' + inner.join('') + '}');
          }
        } else if (set.has(id)) {
          parts.push(r.cssText);
        }
      });
      return parts;
    };
    return walk(sheet.cssRules, '').join('\n');
  }, keep);
}

(async () => {
  const args = process.argv.slice(2);
  const onlyRestore = args.includes('--restore');
  let files = args.filter(a => !a.startsWith('--'));
  if (!files.length) {
    const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
      const p = path.join(d, e.name);
      if (e.isDirectory()) return ['src', 'assets', 'tools', 'audit', 'node_modules', '.git'].includes(e.name) && d === '.' ? [] : walk(p);
      return p.endsWith('.html') ? [p.replace(/^\.\//, '')] : [];
    });
    files = walk('.').filter(p => /css\/style\.css/.test(fs.readFileSync(p, 'utf8').split('</head>')[0]));
  }
  for (const f of files) fs.writeFileSync(f, restore(fs.readFileSync(f, 'utf8')));
  if (onlyRestore) { console.log('zurückgesetzt:', files.length); return; }

  const browser = await chromium.launch();
  for (const f of files) {
    const keep = new Set();
    let css = '';
    for (const [w, h] of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      // Overlays (Cookie-Hinweis, Eröffnungs-Popup) nicht einblenden
      await page.addInitScript(() => { try { localStorage.setItem('dermetrics-cookie-consent', JSON.stringify({ necessary: true })); localStorage.setItem('dmp-eroeffnung-gesehen', '1'); } catch (e) {} });
      await page.goto(BASE + f, { waitUntil: 'networkidle' });
      (await collect(page)).forEach(id => keep.add(id));
      if (w === VIEWPORTS[VIEWPORTS.length - 1][0]) css = await serialize(page, [...keep]);
      await page.close();
    }
    fs.writeFileSync(f, apply(fs.readFileSync(f, 'utf8'), css));
    console.log(f, (css.length / 1024).toFixed(1) + ' KB kritisches CSS');
  }
  await browser.close();
})();
