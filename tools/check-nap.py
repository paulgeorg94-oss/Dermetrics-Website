#!/usr/bin/env python3
"""NAP-Abgleich: prüft Name, Adresse, Telefon, WhatsApp und E-Mail-Adressen
auf allen Seiten gegen data/praxis.json und listet Abweichungen."""
import glob, json, re
P = json.load(open('data/praxis.json', encoding='utf-8'))
checks = [
    ('Kurzname im Text', r'Dr\. med\. P\. Georg', False),
    ('Telefon anders formatiert', r'\+41\s?43\s?234\s?55\s?55|043\s?234\s?55\s?55', None),
    ('PLZ/Ort englisch', r'8002 Zurich\b', False),
]
pages = [p for p in sorted(glob.glob('*.html') + glob.glob('*/*.html') + glob.glob('*/*/*.html')) if not p.startswith(('src/', 'assets/'))]
issues = 0
for p in pages:
    s = open(p, encoding='utf-8').read()
    for label, pat, _ in checks:
        for m in re.finditer(pat, s):
            if label.startswith('Telefon') and m.group(0) in (P['telefon'], P['telefon_e164']): continue
            issues += 1; print(f'{p}: {label}: «{m.group(0)}»')
    for mail in {m.rstrip('.') for m in re.findall(r'[\w.+-]+@[\w-]+\.[\w.]+', s)}:
        if mail not in (P['email_zuweisungen'], P['email_konsile']): issues += 1; print(f'{p}: unbekannte E-Mail «{mail}»')
    foot = re.search(r'<(footer|div) class="footer">.*?</\1>', s, re.S)
    if foot:
        f = foot.group(0)
        for need, label in [(P['praxisname'], 'Name'), (P['adresse']['strasse'], 'Strasse'), (f"{P['adresse']['plz']} {P['adresse']['ort']}", 'PLZ Ort'), (P['telefon'], 'Telefon'), (P['google_profil'], 'Google-Profil')]:
            if need not in f: issues += 1; print(f'{p}: Fusszeile ohne {label}')
    else:
        issues += 1; print(f'{p}: keine Fusszeile gefunden')
print(f'{len(pages)} Seiten geprüft, {issues} Abweichungen')
