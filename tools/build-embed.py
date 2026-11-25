#!/usr/bin/env python3
"""Einbettungsseiten «Pre-Check + Termin per WhatsApp» für fremde Websites (iframe).

Erzeugt aus den Startseiten (einzige Quelle für Fragen, Auswertung und Hinweise):
  embed/pre-check.html      (DE, aus index.html)
  en/embed/pre-check.html   (EN, aus en/index.html)
Die Seiten sind noindex, ohne Navigation, Fusszeile, Cookie-Banner und Popup.
Sie melden ihre Höhe per postMessage an die einbettende Seite
({type: 'dermetrics-embed-height', height}), damit der iframe ohne Scrollbalken passt.
Nach jeder Änderung am Pre-Check auf der Startseite erneut ausführen:
  python3 tools/build-embed.py
"""
import json, re
from urllib.parse import quote

P = json.load(open('data/praxis.json', encoding='utf-8'))
A = P['adresse']; sp = P['sprechstunde_selnau']
WA = P['whatsapp_link']; TEL = P['telefon']; TEL_HREF = 'tel:' + P['telefon_e164']
QUELLE = 'einbettung'   # Umami-Ereigniseigenschaft: Klicks aus der Einbettung unterscheidbar
UMAMI = ('<script defer src="https://cloud.umami.is/script.js" '
         'data-website-id="379f257d-7bdf-4475-9bf1-cfd267e8cfac" '
         'data-domains="dermetrics.ch,www.dermetrics.ch"></script>')
CSP = ("default-src 'self'; script-src 'self' 'unsafe-inline' https://cloud.umami.is; img-src 'self'; "
       "style-src 'self' 'unsafe-inline'; font-src 'self'; "
       "connect-src 'self' https://gateway.umami.is https://cloud.umami.is https://api-gateway.umami.dev; "
       "object-src 'none'; base-uri 'self'; form-action 'self'")

T = {
 'de': dict(src='index.html', out='embed/pre-check.html', lang='de-CH', root='../',
   title='Hautkrebs-Pre-Check und Termin – Dermetrics',
   desc='Hautkrebs-Pre-Check und Terminvereinbarung per WhatsApp bei Dermetrics, Clinic Selnau Zürich.',
   brand=f"Dr. med. Paul J. Georg, {P['arzt']['titel']}",
   wa_text='Guten Tag, ich möchte einen Termin bei Dermetrics in der Clinic Selnau vereinbaren.',
   cta='Termin per WhatsApp anfragen',
   h='Termin per WhatsApp vereinbaren',
   p=f"Sprechstunde in der {P['standortname']}, {A['strasse']}, {A['plz']} {A['ort']}: {sp['tag']} {sp['von']}–{sp['bis']} Uhr.",
   tel='Oder telefonisch:',
   foot=('Pre-Check und Terminvereinbarung von Dermetrics. Ihre Antworten im Pre-Check bleiben in Ihrem Browser '
         'und werden nicht übermittelt. Aufrufe und Klicks zählen wir ohne Cookies mit Umami.'),
   privacy='Datenschutz', privacy_href='https://dermetrics.ch/impressum.html#umami',
   home='dermetrics.ch', home_href='https://dermetrics.ch/'),
 'en': dict(src='en/index.html', out='en/embed/pre-check.html', lang='en', root='../../',
   title='Skin cancer Pre-Check and appointment – Dermetrics',
   desc='Skin cancer Pre-Check and appointment booking via WhatsApp at Dermetrics, Clinic Selnau Zurich.',
   brand='Dr. med. Paul J. Georg, specialist in Dermatology and Venereology FMH',
   wa_text='Hello, I would like to book an appointment at Dermetrics at Clinic Selnau.',
   cta='Request an appointment via WhatsApp',
   h='Book an appointment via WhatsApp',
   p=f"Consultations at {P['standortname']}, {A['strasse']}, {A['plz']} {A['ort']}: Monday {sp['von']}–{sp['bis']}.",
   tel='Or by phone:',
   foot=('Pre-Check and appointment booking by Dermetrics. Your Pre-Check answers stay in your browser '
         'and are not transmitted. We count page views and clicks without cookies using Umami.'),
   privacy='Privacy', privacy_href='https://dermetrics.ch/en/legal.html#umami',
   home='dermetrics.ch', home_href='https://dermetrics.ch/en/index.html'),
}

RESIZE = '''<script>
// Höhe an die einbettende Seite melden (nur Zahl, keine Inhalte).
(function () {
  if (window.parent === window) return;
  var last = 0;
  function send() {
    var h = Math.ceil(document.body.getBoundingClientRect().height);
    if (Math.abs(h - last) < 2) return;
    last = h;
    window.parent.postMessage({ type: 'dermetrics-embed-height', height: h }, '*');
  }
  if ('ResizeObserver' in window) new ResizeObserver(send).observe(document.body);
  window.addEventListener('load', send);
  send();
})();
</script>'''

STYLE = '''<style>
body.embed { padding-top: 0; background: var(--ivory); margin: 0; }
.embed main { padding: 8px 0 4px; }
.embed section.block { padding: 24px 0; border-top: 0; }
.embed .embed-brand { font-size: 13px; color: var(--muted); margin: 0 0 6px; }
.embed .embed-brand a { color: var(--aubergine); font-weight: 600; text-decoration: none; }
.embed .embed-termin { border-top: 1px solid var(--line); padding: 28px 0 8px; }
.embed .embed-termin h2 { margin: 0 0 8px; }
.embed .embed-termin p { margin: 0 0 16px; color: var(--muted); }
.embed .embed-termin .embed-tel { margin: 14px 0 0; font-size: 14px; }
.embed .embed-foot { font-size: 12px; color: var(--muted); border-top: 1px solid var(--line); margin: 24px 0 0; padding: 14px 0 8px; }
.embed .embed-foot a { color: var(--aubergine-mid); }
</style>'''

def wa_link(t, label, extra=''):
    href = f"{WA}?text={quote(t['wa_text'])}"
    return (f'<a class="btn btn-primary"{extra} href="{href}" target="_blank" rel="noopener" '
            f'data-umami-event="WhatsApp-Klick" data-umami-event-quelle="{QUELLE}">{label}</a>')

for lang, t in T.items():
    s = open(t['src'], encoding='utf-8').read()
    sec = re.search(r'<section class="block" id="precheck">.*?</section>', s, re.S).group(0)
    # Ergebnis-Button: statt Termin-Fenster direkt WhatsApp (id bleibt, das Skript blendet ihn ein/aus)
    sec, n = re.subn(r'<a [^>]*id="pcCta"[^>]*>.*?</a>', wa_link(t, t['cta'], ' id="pcCta"'), sec, flags=re.S)
    assert n == 1, (lang, 'pcCta')
    sec = sec.replace('<div class="wrap">', '<div class="wrap">\n<p class="embed-brand">'
                      f'<a href="{t["home_href"]}" target="_blank" rel="noopener">Dermetrics</a> · {t["brand"]}</p>', 1)
    printarea = re.search(r'<div class="pc-print-area".*?\n</div>', s, re.S).group(0)
    js = re.search(r'<script>\n(// Pre-Check.*?\n\}\)\(\);)\n', s, re.S).group(1)
    assert 'pcQPhase' in js and 'contact-form' not in js, (lang, 'precheck-js')
    termin = (f'''<section class="embed-termin" id="termin">
  <div class="wrap">
    <h2>{t["h"]}</h2>
    <p>{t["p"]}</p>
    {wa_link(t, t["cta"])}
    <p class="embed-tel">{t["tel"]} <a href="{TEL_HREF}" data-umami-event="Telefon-Klick" data-umami-event-quelle="{QUELLE}">{TEL}</a></p>
    <p class="embed-foot">{t["foot"]} <a href="{t["privacy_href"]}" target="_blank" rel="noopener">{t["privacy"]}</a> · <a href="{t["home_href"]}" target="_blank" rel="noopener">{t["home"]}</a></p>
  </div>
</section>''')
    r = t['root']
    page = f'''<!DOCTYPE html>
<html lang="{t["lang"]}">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="{CSP}">
{UMAMI}
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{t["title"]}</title>
<meta name="description" content="{t["desc"]}">
<meta name="robots" content="noindex, follow">
<link rel="icon" href="{r}assets/logo-dermetrics.svg" type="image/svg+xml">
<link rel="icon" href="{r}assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="stylesheet" href="{r}css/style.css">
{STYLE}
</head>
<body class="embed">
<!-- Automatisch erzeugt von tools/build-embed.py aus {t["src"]}. Nicht von Hand ändern. -->
<main>
{sec}
{termin}
</main>
{printarea}
<script>
{js}
</script>
{RESIZE}
</body>
</html>
'''
    import os
    os.makedirs(os.path.dirname(t['out']), exist_ok=True)
    old = open(t['out'], encoding='utf-8').read() if os.path.exists(t['out']) else ''
    if old != page:
        open(t['out'], 'w', encoding='utf-8').write(page)
        print('geschrieben', t['out'])
    else:
        print('unverändert', t['out'])
