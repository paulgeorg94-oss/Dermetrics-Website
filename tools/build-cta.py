#!/usr/bin/env python3
"""Einheitlicher Termin-CTA «Termin buchen» / «Book appointment» auf allen Seiten.

1. Schreibt den Datenblock in assets/termin.js aus data/praxis.json.
2. Schreibt das Termin-Panel (#termin) in den Standortblock der Startseiten DE/EN
   (zwischen <!-- termin-panel:start --> und <!-- termin-panel:end -->).
3. Vereinheitlicht die CTAs auf allen Seiten (idempotent):
   - Kopfnavigation: Button «Termin buchen» statt «Pre-Check starten»; Menüpunkt «Termin» heisst «Kontakt»
   - WhatsApp-Block: Button «Termin buchen» (öffnet das Termin-Fenster)
   - bindet assets/termin.js ein
Aufruf aus dem Repo-Wurzelverzeichnis: python3 tools/build-cta.py
"""
import glob, json, re

P = json.load(open('data/praxis.json', encoding='utf-8'))
A = P['adresse']; sp = P['sprechstunde_selnau']
TEL, TEL_HREF = P['telefon'], 'tel:' + P['telefon_e164']
WA, WA_HREF = P['whatsapp'], P['whatsapp_link']
PLACE = f"{P['standortname']}, {A['strasse']}, {A['plz']} {A['ort']}"
LBL = {'de': 'Termin buchen', 'en': 'Book appointment'}
HOME = {'de': '/', 'en': '/en/index.html'}

DATA = {
    'de': {'label': LBL['de'], 'title': LBL['de'], 'intro': 'Wählen Sie, wie Sie uns erreichen möchten.',
           'place': PLACE, 'hours': f"Sprechstunde: {sp['tag']} {sp['von']}–{sp['bis']} Uhr",
           'phone_label': 'Telefon', 'wa_label': 'WhatsApp', 'form_label': 'Anfrageformular', 'form_text': 'Anfrage senden',
           'form_href': '/#contact-form', 'close': 'Schliessen', 'fallback': '/#termin'},
    'en': {'label': LBL['en'], 'title': LBL['en'], 'intro': 'Choose how you would like to reach us.',
           'place': PLACE, 'hours': f"Consultations: {'Monday' if sp['tag'] == 'Montag' else sp['tag']} {sp['von']}–{sp['bis']}",
           'phone_label': 'Phone', 'wa_label': 'WhatsApp', 'form_label': 'Enquiry form', 'form_text': 'Send enquiry',
           'form_href': '/en/index.html#contact-form', 'close': 'Close', 'fallback': '/en/index.html#termin'},
    'phone': TEL, 'phone_href': TEL_HREF, 'wa': WA, 'wa_href': WA_HREF,
}

def cta(lang, href, cls='', extra=''):
    c = ('cta-termin ' + cls).strip()
    return f'<a class="{c}" href="{href}" data-cta="termin"{extra}>{LBL[lang]}</a>'

def panel(lang):
    t = DATA[lang]
    form = '#contact-form'
    return (f'<!-- termin-panel:start -->\n'
            f'    <div class="termin-panel" id="termin">\n'
            f'      <p class="termin-panel-title">{t["title"]}</p>\n'
            f'      <div class="termin-ways">\n'
            f'        <a class="termin-way" href="{TEL_HREF}"><span>{t["phone_label"]}</span><strong>{TEL}</strong></a>\n'
            f'        <a class="termin-way" href="{WA_HREF}" target="_blank" rel="noopener"><span>{t["wa_label"]}</span><strong>{WA}</strong></a>\n'
            f'        <a class="termin-way" href="{form}"><span>{t["form_label"]}</span><strong>{t["form_text"]}</strong></a>\n'
            f'      </div>\n'
            f'    </div>\n'
            f'    <!-- termin-panel:end -->')

# 1. Datenblock in termin.js
js = open('assets/termin.js', encoding='utf-8').read()
js = re.sub(r'/\* DATA-START \*/.*?/\* DATA-END \*/',
            '/* DATA-START */\n  var D = ' + json.dumps(DATA, ensure_ascii=False) + ';\n  /* DATA-END */', js, flags=re.S)
open('assets/termin.js', 'w', encoding='utf-8').write(js)

pages = [p for p in sorted(glob.glob('*.html') + glob.glob('*/*.html') + glob.glob('*/*/*.html'))
         if not p.startswith(('src/', 'assets/', 'tools/', 'audit/', 'relaunch/'))]
for p in pages:
    s = o = open(p, encoding='utf-8').read()
    lang = 'en' if p.startswith('en/') else 'de'
    depth = p.count('/')
    prefix = '../' * depth
    is_home = p in ('index.html', 'en/index.html')
    target = '#termin' if is_home else ('/#termin' if lang == 'de' else '/en/index.html#termin')

    # Kopfnavigation: Menüpunkt «Termin»/«Appointment» → «Kontakt»/«Contact»
    s = re.sub(r'(<a href="[^"]*#kontakt">)Termin(</a>)', r'\1Kontakt\2', s)
    s = re.sub(r'(<a href="[^"]*#kontakt">)Appointment(</a>)', r'\1Contact\2', s)
    # Kopf-CTA (Mobile-Menü und Desktop): «Termin buchen»
    s = re.sub(r'<a class="cta" href="[^"]*#precheck">(?:Pre-Check starten|Start Pre-Check)</a>', cta(lang, target, 'cta'), s)
    s = re.sub(r'<a class="cta cta-desktop" href="[^"]*#precheck">(?:Pre-Check starten|Start Pre-Check)</a>', cta(lang, target, 'cta cta-desktop'), s)
    # WhatsApp-Block → Termin-CTA
    s = re.sub(r'<a class="wa-btn" href="https://wa\.me/[^"]*"[^>]*>.*?</a>', cta(lang, target, 'wa-btn'), s, flags=re.S)
    s = s.replace('<span>WhatsApp ' + WA + '</span></p>',
                  '<span>' + ('Telefon, WhatsApp oder Anfrageformular' if lang == 'de' else 'Phone, WhatsApp or enquiry form') + '</span></p>')
    # Termin-Panel auf den Startseiten
    if is_home:
        s = re.sub(r'<!-- termin-panel:start -->.*?<!-- termin-panel:end -->', panel(lang), s, flags=re.S)
    # Skript einbinden
    tag = f'<script src="{prefix}assets/termin.js" defer></script>'
    if 'assets/termin.js' not in s:
        s = s.replace('</body>', tag + '\n</body>', 1)
    if s != o:
        open(p, 'w', encoding='utf-8').write(s)
        print('cta', p)
