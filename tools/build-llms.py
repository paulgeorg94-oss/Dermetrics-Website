#!/usr/bin/env python3
"""Erzeugt llms.txt aus data/praxis.json und sitemap.xml. Seitennamen kommen
aus der H1 der jeweiligen Seite. Aufruf: python3 tools/build-llms.py"""
import datetime, html, json, re
P = json.load(open('data/praxis.json', encoding='utf-8'))
BASE = 'https://dermetrics.ch/'
urls = re.findall(r'<loc>([^<]+)</loc>', open('sitemap.xml', encoding='utf-8').read())

def file_of(u): return 'index.html' if u == BASE else u[len(BASE):]
def h1(u):
    s = open(file_of(u), encoding='utf-8').read()
    if u == BASE: return 'Startseite'
    if u == BASE + 'en/index.html': return 'Home'
    name = html.unescape(' '.join(re.sub(r'<[^>]+>', ' ', re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S).group(1)).split()))
    if '/treatment-protocols/' in u and 'protocol' not in name.lower(): name = 'Treatment protocol: ' + name
    if '/behandlungsprotokolle/' in u and 'protokoll' not in name.lower(): name += ' (Behandlungsprotokoll)'
    return name

d = datetime.date.fromisoformat(P['eroeffnung'])
MON = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
a, arzt = P['adresse'], P['arzt']
sp = P['sprechstunde_selnau']
summary = (f"Dermatologische Praxis (Hautarzt) in Zürich {a['kreis']} ({a['quartier']}), {a['strasse']}, {a['plz']} {a['ort']}. {arzt['name']}, {arzt['titel']}, "
           f"Mitglied SGDV und EADV. Schwerpunkte: Hautkrebs-Screening, Tumorchirurgie der Haut, mikrographisch kontrollierte Chirurgie (Mohs), "
           f"Wundbehandlung (inkl. ECMP), Narbentherapie, Psoriasis, Acne inversa. Zertifizierter Praxis-OP, interdisziplinäre Zusammenarbeit mit der "
           f"Plastischen Chirurgie ({P['partner']['name']}, {P['partner']['titel']}, {P['partner']['team']}). Sprechstunde {sp['tag']} {sp['von']}–{sp['bis']} Uhr, "
           f"Eröffnung {d.day}. {MON[d.month-1]} {d.year}. Tel. {P['telefon']}. WhatsApp {P['whatsapp']}. Zuweisungen: {P['email_zuweisungen']}. "
           f"Sprachen: Deutsch (de-CH) und Englisch.")
sec = {'de_main': [], 'le': [], 'pi': [], 'bp': [], 'en': [], 'opt': []}
for u in urls:
    f = file_of(u)
    if f.startswith('en/'): sec['en'].append(u)
    elif f.startswith('leistungen/'): sec['le'].append(u)
    elif f.startswith('patienteninformationen/'): sec['pi'].append(u)
    elif f.startswith('behandlungsprotokolle/'): sec['bp'].append(u)
    elif f == 'impressum.html': sec['opt'].append(u)
    else: sec['de_main'].append(u)
def line(u, note=''): return f'- [{h1(u)}]({u})' + (f': {note}' if note else '')
NOTES = {BASE: 'Überblick, Auf einen Blick, Leistungen, Qualifikation, FAQ, Kontakt',
         BASE + 'hauterkrankungen-erklaert.html': 'Übersicht der Krankheitsbilder und Behandlungspläne',
         BASE + 'hautkrebs-selbsttest.html': '8 Aussagen zur Hautkrebsvorsorge',
         BASE + 'en/index.html': 'overview, at a glance, services, qualifications, FAQ, contact',
         BASE + 'en/skin-cancer-self-test.html': '8 statements on skin cancer prevention'}
out = [f"# Dermetrics – {P['standortname']}", '', '> ' + summary, '',
       'Hinweis: Alle Inhalte dienen der Information und ersetzen keine ärztliche Beratung. Der Online-Pre-Check ist ein statistisches Orientierungsinstrument und keine Diagnose.', '',
       '## Praxis und Leistungen']
for u in sec['de_main']:
    out.append(line(u, NOTES.get(u, '')))
    if u == BASE: out.append(f'- [Hautkrebs-Pre-Check]({BASE}#precheck): 13 Fragen, kein Diagnoseinstrument')
def subhead(u):
    m = re.search(r'<p class="subhead">(.*?)</p>', open(file_of(u), encoding='utf-8').read(), re.S)
    return html.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip() if m else ''
out += ['', '## Leistungen (Hautarzt Zürich Selnau/Enge)'] + [line(u, subhead(u)) for u in sec['le']]
out += ['', '## Patienteninformationen'] + [line(u) for u in sec['pi']]
out += ['', '## Behandlungsprotokolle'] + [line(u) for u in sec['bp']]
ORDER = lambda u: (-1 if u == BASE + 'en/index.html' else 0 if '/patient-information/' not in u and '/treatment-protocols/' not in u and 'legal' not in u else 1 if '/patient-information/' in u else 2 if '/treatment-protocols/' in u else 3)
sec['en'].sort(key=ORDER)
out += ['', '## English']
for u in sec['en']:
    out.append(line(u, NOTES.get(u, '') or (subhead(u) if '/en/services/' in u else '')))
    if u == BASE + 'en/index.html': out.append(f'- [Skin cancer Pre-Check]({BASE}en/index.html#precheck): 13 questions, not a diagnostic tool')
out += ['', '## Optional'] + [line(u) for u in sec['opt']] + [f'- [Google-Profil Clinic Selnau]({P["google_profil"]})', f'- [Sitemap]({BASE}sitemap.xml)', '']
open('llms.txt', 'w', encoding='utf-8').write('\n'.join(out))
print(len(urls), 'URLs ->', 'llms.txt')
