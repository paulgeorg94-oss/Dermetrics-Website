#!/usr/bin/env python3
"""GEO-Einleitung für Patienten- und Protokollseiten: ein zitierfähiger Satz
(was, wo, durch wen) mit Link zur Leistungsübersicht, eine sichtbare Zeile
zu Verantwortung und Stand (aus lastReviewed bzw. dateModified im JSON-LD)
und eine BreadcrumbList im JSON-LD. Idempotent."""
import json, re
MON = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
MON_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']
# Was die Praxis zum Thema der Seite anbietet, wörtlich nach der Leistungsübersicht der Startseite
DE = {
 'patienteninformationen/akne-formen.html': 'behandeln wir Akne',
 'patienteninformationen/aktinische-keratosen.html': 'behandeln wir aktinische Keratosen',
 'patienteninformationen/basalzellkarzinom.html': 'behandeln wir das Basalzellkarzinom',
 'patienteninformationen/spinaliom.html': 'behandeln wir das Spinaliom',
 'patienteninformationen/rosazea.html': 'behandeln wir Rosazea',
 'patienteninformationen/solare-elastose.html': 'behandeln wir sonnenbedingte Hautalterung (solare Elastose)',
 'patienteninformationen/postinflammatorische-hyperpigmentierung.html': 'behandeln wir postinflammatorische Hyperpigmentierung',
 'patienteninformationen/mosaik-3d-erbium-laser.html': 'behandeln wir Narben auch mit Laser (Mosaic 3D Erbium)',
 'behandlungsprotokolle/akne.html': 'behandeln wir Akne',
 'behandlungsprotokolle/anti-aging-hautpflege.html': 'beraten wir zur Hautpflege',
 'behandlungsprotokolle/melasma-behandlungsprotokoll.html': 'behandeln wir Melasma',
 'behandlungsprotokolle/rosazea-behandlungsprotokoll.html': 'behandeln wir Rosazea',
}
EN = {
 'en/patient-information/acne-forms.html': 'we treat acne',
 'en/patient-information/actinic-keratosis.html': 'we treat actinic keratoses',
 'en/patient-information/basal-cell-carcinoma.html': 'we treat basal cell carcinoma',
 'en/patient-information/squamous-cell-carcinoma.html': 'we treat squamous cell carcinoma',
 'en/patient-information/rosacea.html': 'we treat rosacea',
 'en/patient-information/solar-elastosis.html': 'we treat sun-related skin ageing (solar elastosis)',
 'en/patient-information/post-inflammatory-hyperpigmentation.html': 'we treat post-inflammatory hyperpigmentation',
 'en/patient-information/mosaic-3d-erbium-laser.html': 'we also treat scars with laser (Mosaic 3D Erbium)',
 'en/treatment-protocols/acne.html': 'we treat acne',
 'en/treatment-protocols/anti-aging-skincare.html': 'we advise on skin care',
 'en/treatment-protocols/melasma-treatment-protocol.html': 'we treat melasma',
 'en/treatment-protocols/rosacea-treatment-protocol.html': 'we treat rosacea',
}
CSS = '''.page-lead { font-size: 14.5px; color: var(--ink); line-height: 1.6; max-width: 62ch; margin: 16px 0 0; }
.page-lead a { color: var(--aubergine-mid); }
.page-meta { font-size: 12.5px; color: var(--muted); margin: 6px 0 0; }
'''
def fmt(d, en):
    y, m, t = d.split('-')
    return f'{int(t)} {MON_EN[int(m)-1]} {y}' if en else f'{int(t)}. {MON[int(m)-1]} {y}'

for page, phrase in list(DE.items()) + list(EN.items()):
    en = page.startswith('en/')
    s = open(page, encoding='utf-8').read()
    if 'class="page-lead"' in s: continue
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
    g = json.loads(m.group(1)); nodes = g.get('@graph', [g])
    wp = next(n for n in nodes if n.get('@type') == 'MedicalWebPage')
    url = wp['url']
    h1 = re.sub(r'<[^>]+>', '', re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S).group(1)).strip()
    if en:
        lead = f'At Dermetrics, the practice of Dr. med. Paul Georg at Clinic Selnau in Zurich Selnau/Enge, {phrase}. <a href="/en/index.html#leistungsuebersicht">All services</a>'
        if wp.get('lastReviewed'): meta = f'Responsible: Dr. med. Paul Georg, specialist in Dermatology and Venereology · Last reviewed: {fmt(wp["lastReviewed"], True)}'
        else: meta = f'Responsible: Dr. med. Paul Georg, specialist in Dermatology and Venereology · Updated: {fmt(wp["dateModified"], True)}'
        crumbs = [('Dermetrics', 'https://dermetrics.ch/en/index.html'), ('Patient information and treatment plans', 'https://dermetrics.ch/en/skin-conditions-explained.html'), (h1, url)]
    else:
        lead = f'In der Praxis Dermetrics von Dr. med. Paul Georg in der Clinic Selnau, Zürich Selnau/Enge, {phrase}. <a href="/#leistungsuebersicht">Zur Leistungsübersicht</a>'
        if wp.get('lastReviewed'): meta = f'Verantwortlich: Dr. med. Paul Georg, Facharzt für Dermatologie und Venerologie · Zuletzt geprüft: {fmt(wp["lastReviewed"], False)}'
        else: meta = f'Verantwortlich: Dr. med. Paul Georg, Facharzt für Dermatologie und Venerologie · Stand: {fmt(wp["dateModified"], False)}'
        crumbs = [('Dermetrics', 'https://dermetrics.ch/'), ('Patienteninformationen & Behandlungspläne', 'https://dermetrics.ch/hauterkrankungen-erklaert.html'), (h1, url)]
    sub = re.search(r'(\s*)<p class="subhead">.*?</p>', s, re.S)
    ind = sub.group(1)
    s = s[:sub.end()] + f'{ind}<p class="page-lead">{lead}</p>{ind}<p class="page-meta">{meta}</p>' + s[sub.end():]
    bc_id = url + '#breadcrumb'
    wp['breadcrumb'] = {'@id': bc_id}
    nodes.append({'@type': 'BreadcrumbList', '@id': bc_id, 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': u} for i, (n, u) in enumerate(crumbs)]})
    if '@graph' not in g: g = {'@context': 'https://schema.org', '@graph': nodes}
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
    s = s[:m.start(1)] + json.dumps(g, ensure_ascii=False, separators=(',', ':')) + s[m.end(1):]
    if '<style>' in s and '.page-lead' not in s.split('</style>')[0]:
        s = s.replace('</style>', CSS + '</style>', 1)
    open(page, 'w', encoding='utf-8').write(s); print('lead', page)
