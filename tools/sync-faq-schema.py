#!/usr/bin/env python3
"""Setzt das FAQPage-JSON-LD jeder Seite wortgleich aus den sichtbaren FAQ
(<details class="faq-item"> mit <p> oder <div class="faq-answer">). Seiten mit sichtbaren FAQ,
aber ohne FAQPage, erhalten einen FAQPage-Eintrag im ersten JSON-LD-Block (@graph).
Gleiche Text-Normalisierung wie tools/check-faq.py. Aufruf: python3 tools/sync-faq-schema.py [seite.html ...]"""
import glob, html, json, re, sys

BASE = 'https://dermetrics.ch/'

def norm(fragment):
    return ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', fragment)).split()).replace(' .', '.').replace(' ,', ',').replace(' :', ':')

def visible(s):
    out = []
    for q, a, d in re.findall(r'<details class="faq-item"(?: id="[^"]*")?><summary>(.*?)</summary>(?:<p>(.*?)</p>|<div class="faq-answer">(.*?)</div>)</details>', s, re.S):
        out.append((html.unescape(re.sub(r'<[^>]+>', '', q)).strip(), html.unescape(re.sub(r'<[^>]+>', '', a)).strip() if a else norm(d)))
    return out

pages = sys.argv[1:] or sorted(p for p in glob.glob('*.html') + glob.glob('*/*.html') + glob.glob('*/*/*.html') if not p.startswith(('src/', 'assets/', 'audit/', 'relaunch/', 'tools/')))
for p in pages:
    s = o = open(p, encoding='utf-8').read()
    vis = visible(s)
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
    if not m: continue
    d = json.loads(m.group(1))
    graph = d.get('@graph')
    if graph is None: continue
    faq = [n for n in graph if n.get('@type') == 'FAQPage']
    if not vis and not faq: continue
    ents = [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in vis]
    if faq:
        if vis: faq[0]['mainEntity'] = ents
        else: graph.remove(faq[0])
    else:
        url = BASE + ('' if p == 'index.html' else p)
        graph.append({'@type': 'FAQPage', '@id': url + '#faq', 'url': url, 'inLanguage': 'en' if p.startswith('en/') else 'de-CH', 'mainEntity': ents})
    s = s.replace(m.group(0), '<script type="application/ld+json">' + json.dumps(d, ensure_ascii=False, separators=(',', ':')) + '</script>', 1)
    if s != o:
        open(p, 'w', encoding='utf-8').write(s); print('FAQPage', p, len(vis), 'Fragen')
