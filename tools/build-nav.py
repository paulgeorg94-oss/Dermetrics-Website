#!/usr/bin/env python3
"""Einheitliche Kopfnavigation mit Dropdowns auf allen Seiten mit <nav class="navlinks">.

DE: Leistungen ▾ · Patienteninformationen ▾ · Behandlungspläne ▾ · Kontakt ▾ (mit Zuweisung Hausarzt)
EN: Services ▾ · Patient information ▾ · Treatment plans ▾ · Contact ▾
Sprachumschalter und Termin-CTA jeder Seite bleiben erhalten. Seitenlisten werden aus den
vorhandenen Dateien gebaut (nur Seiten, die es gibt). Idempotent.
Aufruf aus dem Repo-Wurzelverzeichnis: python3 tools/build-nav.py
"""
import glob, os, re

DE_PI = [('aktinische-keratosen', 'Aktinische Keratosen'), ('basalzellkarzinom', 'Basalzellkarzinom'), ('spinaliom', 'Spinaliom'),
         ('solare-elastose', 'Solare Elastose'), ('rosazea', 'Rosazea'), ('akne-formen', 'Akne'),
         ('postinflammatorische-hyperpigmentierung', 'Postinflammatorische Hyperpigmentierung'),
         ('selbstuntersuchung-haut', 'Selbstuntersuchung der Haut'), ('mosaik-3d-erbium-laser', 'Mosaic 3D (Erbium-Laser)'),
         ('nd-yag-laser', 'Nd:YAG-Laser'), ('pico-laser', 'Pico-Laser')]
DE_BP = [('akne', 'Akne'), ('anti-aging-hautpflege', 'Anti-Aging-Hautpflege'),
         ('rosazea-behandlungsprotokoll', 'Rosazea-Behandlungsplan'), ('melasma-behandlungsprotokoll', 'Melasma-Behandlungsplan')]
EN_PI = [('actinic-keratosis', 'Actinic keratoses'), ('basal-cell-carcinoma', 'Basal cell carcinoma'),
         ('squamous-cell-carcinoma', 'Squamous cell carcinoma'), ('solar-elastosis', 'Solar elastosis'), ('rosacea', 'Rosacea'),
         ('acne-forms', 'Acne'), ('post-inflammatory-hyperpigmentation', 'Post-inflammatory hyperpigmentation'),
         ('skin-self-examination', 'Skin self-examination'), ('mosaic-3d-erbium-laser', 'Mosaic 3D (erbium laser)'),
         ('nd-yag-laser', 'Nd:YAG laser'), ('pico-laser', 'Pico laser')]
EN_BP = [('acne', 'Acne'), ('anti-aging-skincare', 'Anti-ageing skincare'),
         ('rosacea-treatment-protocol', 'Rosacea treatment plan'), ('melasma-treatment-protocol', 'Melasma treatment plan')]


def drop(label, href, items, sub_label):
    links = '\n'.join(f'          <a href="{h}">{t}</a>' for h, t in items)
    return (f'      <div class="navdrop">\n'
            f'        <a class="navdrop-top" href="{href}">{label}</a><button type="button" class="navdrop-btn" aria-expanded="false" aria-label="{sub_label}: {label}"></button>\n'
            f'        <div class="navdrop-menu">\n{links}\n        </div>\n      </div>')


def nav(lang, home):
    if lang == 'de':
        H = '' if home else '/'
        pi = [(f'/patienteninformationen/{f}.html', t) for f, t in DE_PI if os.path.exists(f'patienteninformationen/{f}.html')]
        bp = [(f'/behandlungsprotokolle/{f}.html', t) for f, t in DE_BP if os.path.exists(f'behandlungsprotokolle/{f}.html')]
        return '\n'.join([
            drop('Leistungen', f'{H}#kernbereiche', [(f'{H}#leistungsuebersicht', 'Alle Leistungen'), (f'{H}#precheck', 'Pre-Check'), (f'{H}#weg', 'Ihr Weg'),
                                                       (f'{H}#clinic-selnau', 'Clinic Selnau'), (f'{H}#praxis', 'Praxis'), (f'{H}#laserbehandlungen', 'Laserbehandlungen')], 'Untermenü'),
            drop('Patienteninformationen', '/hauterkrankungen-erklaert.html#krankheitsbilder', pi + [('/hauterkrankungen-erklaert.html', 'Alle Patienteninformationen')], 'Untermenü'),
            drop('Behandlungspläne', '/hauterkrankungen-erklaert.html#nach-alter', bp, 'Untermenü'),
            drop('Kontakt', f'{H}#kontakt', [(f'{H}#kontakt', 'Kontakt und Standorte'), ('/medix.html', 'Zuweisung Hausarzt (z. B. MediX)')], 'Untermenü')])
    H = '' if home else '/en/index.html'
    pi = [(f'/en/patient-information/{f}.html', t) for f, t in EN_PI if os.path.exists(f'en/patient-information/{f}.html')]
    bp = [(f'/en/treatment-protocols/{f}.html', t) for f, t in EN_BP if os.path.exists(f'en/treatment-protocols/{f}.html')]
    return '\n'.join([
        drop('Services', f'{H}#kernbereiche', [(f'{H}#leistungsuebersicht', 'All services'), (f'{H}#precheck', 'Pre-Check'), (f'{H}#weg', 'Your Journey'),
                                                (f'{H}#clinic-selnau', 'Clinic Selnau'), (f'{H}#praxis', 'Practice')], 'Submenu'),
        drop('Patient information', '/en/skin-conditions-explained.html#krankheitsbilder', pi + [('/en/skin-conditions-explained.html', 'All patient information')], 'Submenu'),
        drop('Treatment plans', '/en/skin-conditions-explained.html#nach-alter', bp, 'Submenu'),
        drop('Contact', f'{H}#kontakt', [(f'{H}#kontakt', 'Contact and locations'), ('/medix.html', 'Referral from your GP (e.g. MediX)')], 'Submenu')])


pages = sorted(p for p in glob.glob('*.html') + glob.glob('*/*.html') + glob.glob('*/*/*.html')
               if not p.startswith(('src/', 'assets/', 'tools/', 'audit/', 'relaunch/')))
for p in pages:
    s = o = open(p, encoding='utf-8').read()
    m = re.search(r'<nav class="navlinks"[^>]*>(.*?)</nav>', s, re.S)
    if not m: continue
    inner = m.group(1)
    lang = 'en' if p.startswith('en/') else 'de'
    home = p in ('index.html', 'en/index.html')
    langsw = re.search(r'<span class="lang">.*?</span>\s*</span>|<span class="lang">.*?</span>(?=\s*<a)', inner, re.S)
    cta = re.search(r'<a class="cta-termin cta"[^>]*>.*?</a>', inner, re.S)
    if not langsw or not cta: print('ÜBERSPRUNGEN (Sprache/CTA fehlt)', p); continue
    label = 'Hauptnavigation' if lang == 'de' else 'Main navigation'
    new = (f'<nav class="navlinks" aria-label="{label}">\n{nav(lang, home)}\n      {langsw.group(0).strip()}\n      {cta.group(0)}\n    </nav>')
    s = s.replace(m.group(0), new)
    if s != o:
        open(p, 'w', encoding='utf-8').write(s); print('nav', p)
