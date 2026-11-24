#!/usr/bin/env python3
"""Prüft die Umami-Einbindung auf allen öffentlichen Seiten:
- Umami-Skript im <head> (genau einmal, mit Website-ID)
- CSP: script-src enthält https://cloud.umami.is, connect-src https://gateway.umami.is
  (Zieladresse laut cloud.umami.is/script.js, Stand 24.11.2026)
- jeder tel:- und WhatsApp-Link trägt data-umami-event
Aufruf aus dem Repo-Wurzelverzeichnis: python3 tools/check-umami.py"""
import glob, re, sys
ID = '379f257d-7bdf-4475-9bf1-cfd267e8cfac'
pages = [p for p in sorted(glob.glob('*.html') + glob.glob('*/*.html') + glob.glob('*/*/*.html'))
         if not p.startswith(('src/', 'assets/', 'tools/', 'audit/', 'relaunch/', 'data/'))]
bad = 0
def err(p, m):
    global bad; bad += 1; print(f'FEHLER {p}: {m}')
for p in pages:
    s = open(p, encoding='utf-8').read()
    head = s.split('</head>')[0]
    n = head.count('src="https://cloud.umami.is/script.js"')
    if n != 1 or f'data-website-id="{ID}"' not in head: err(p, f'Umami-Skript im <head> {n}-mal oder ohne Website-ID')
    m = re.search(r'http-equiv="Content-Security-Policy" content="([^"]*)"', head)
    if not m: err(p, 'keine CSP'); continue
    d = {x.split()[0]: x.split()[1:] for x in m.group(1).split(';') if x.strip()}
    if 'https://cloud.umami.is' not in d.get('script-src', []): err(p, 'script-src ohne cloud.umami.is')
    if 'https://gateway.umami.is' not in d.get('connect-src', []): err(p, 'connect-src ohne gateway.umami.is')
    for a in re.findall(r'<a\s[^>]*>', s):
        h = re.search(r'href="([^"]*)"', a)
        if not h: continue
        h = h.group(1).lower()
        if h.startswith('tel:') and 'data-umami-event="Telefon-Klick"' not in a: err(p, 'tel-Link ohne Event: ' + a[:80])
        if ('wa.me' in h or 'whatsapp' in h) and 'data-umami-event="WhatsApp-Klick"' not in a: err(p, 'WhatsApp-Link ohne Event: ' + a[:80])
print(f'{len(pages)} Seiten geprüft, {bad} Fehler')
sys.exit(1 if bad else 0)
