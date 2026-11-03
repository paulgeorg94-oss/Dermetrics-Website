#!/usr/bin/env python3
"""Vereinheitlicht die Praxisangaben in den Fusszeilen aller Seiten nach
data/praxis.json: voller Name, Adresse, Telefon, Link zum Google-Profil.
Idempotent. Aufruf aus dem Repository-Wurzelverzeichnis."""
import glob, json, re
P = json.load(open('data/praxis.json', encoding='utf-8'))
NAME = P['praxisname']                       # Dermetrics – Dr. med. Paul Georg
A = P['adresse']; ADDR = f"{A['strasse']}<br>{A['plz']} {A['ort']}"
TEL = f'<a href="tel:{P["telefon_e164"]}">{P["telefon"]}</a>'
GOOGLE = {'de': 'Google-Profil der Clinic Selnau', 'en': 'Clinic Selnau on Google'}
pages = [p for p in sorted(glob.glob('*.html') + glob.glob('*/*.html') + glob.glob('*/*/*.html'))
         if not p.startswith(('src/', 'assets/', 'tools/', 'audit/'))]
for p in pages:
    s = o = open(p, encoding='utf-8').read(); lang = 'en' if p.startswith('en/') else 'de'
    glink = f'<a href="{P["google_profil"]}" target="_blank" rel="noopener">{GOOGLE[lang]}</a>'
    m = re.search(r'<footer class="footer">.*?</footer>', s, re.S)
    if m:
        f = m.group(0)
        f = re.sub(r'Dermetrics . Dr\. med\. P\. Georg', NAME, f)
        f = f.replace('Brandschenkestrasse 45<br>8002 Zurich', ADDR)
        if P['google_profil'] not in f:
            f = f.replace(f'<p>{TEL}</p>', f'<p>{TEL}</p>\n      <p>{glink}</p>', 1)
        s = s[:m.start()] + f + s[m.end():]
    m = re.search(r'<div class="footer">.*?</div>', s, re.S)
    if m and 'class="practice"' in m.group(0):
        f = m.group(0)
        f = re.sub(r'<p class="practice">Dermetrics . Dr\. med\. Paul Georg</p>', f'<p class="practice">{NAME}</p>', f)
        if P['google_profil'] not in f:
            line = f'<p>{P["standortname"]}, {A["strasse"]}, {A["plz"]} {A["ort"]} · {TEL} · {glink}</p>'
            f = f.replace(f'<p class="practice">{NAME}</p>', f'<p class="practice">{NAME}</p>\n<p>{line[3:-4]}</p>', 1)
        s = s[:m.start()] + f + s[m.end():]
    if s != o: open(p, 'w', encoding='utf-8').write(s); print('footer', p)
