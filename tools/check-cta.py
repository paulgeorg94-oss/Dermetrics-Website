#!/usr/bin/env python3
"""Prüft den einheitlichen Termin-CTA auf allen Seiten.

Regeln (Abweichung = Exit 1):
- Jeder Link/Button, dessen Text «Termin», «appointment» oder «book» enthält oder der data-cta="termin" trägt,
  muss data-cta="termin" haben, auf …#termin zeigen und «Termin buchen» (DE) bzw. «Book appointment» (EN)
  heissen. Bei ganzen Kacheln genügt es, wenn der Text damit endet.
- Buttons (Klasse btn/cta) auf den Pre-Check heissen «Hautkrebs-Pre-Check starten» / «Start skin cancer pre-check».
Aufruf: python3 tools/check-cta.py
"""
import glob, html, re, sys

LBL = {'de': 'Termin buchen', 'en': 'Book appointment'}
PRE = {'de': 'Hautkrebs-Pre-Check starten', 'en': 'Start skin cancer pre-check'}
pages = [p for p in sorted(glob.glob('*.html') + glob.glob('*/*.html') + glob.glob('*/*/*.html'))
         if not p.startswith(('src/', 'assets/', 'tools/', 'audit/', 'relaunch/'))]
bad = ok = 0
for p in pages:
    s = open(p, encoding='utf-8').read()
    lang = 'en' if p.startswith('en/') else 'de'
    for m in re.finditer(r'<(a|button)\b([^>]*)>(.*?)</\1>', s, re.S):
        attrs, inner = m.group(2), m.group(3)
        text = ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', re.sub(r'<svg.*?</svg>', '', inner, flags=re.S))).split())
        line = s.count('\n', 0, m.start()) + 1
        href = (re.search(r'href="([^"]*)"', attrs) or [None, ''])[1]
        cls = (re.search(r'class="([^"]*)"', attrs) or [None, ''])[1]
        is_cta = 'data-cta="termin"' in attrs
        if is_cta or re.search(r'\btermin|appointment|\bbook\b', text, re.I):
            errs = []
            if not is_cta: errs.append('ohne data-cta="termin"')
            if m.group(1) == 'a' and not href.endswith('#termin'): errs.append(f'Ziel {href}')
            if not (text == LBL[lang] or text.endswith(' ' + LBL[lang])): errs.append(f'Text «{text[:60]}»')
            if errs: bad += 1; print(f'ABWEICHUNG {p}:{line}: ' + ', '.join(errs))
            else: ok += 1
        elif re.search(r'\b(btn|cta)\b', cls) and href.endswith('#precheck') and text != PRE[lang]:
            bad += 1; print(f'ABWEICHUNG {p}:{line}: Pre-Check-Button «{text}»')
print(f'{len(pages)} Seiten, {ok} Termin-CTAs korrekt, {bad} Abweichungen')
sys.exit(1 if bad else 0)
