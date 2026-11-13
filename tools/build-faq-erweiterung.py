#!/usr/bin/env python3
"""FAQ-Erweiterung der Startseiten (DE index.html, EN en/index.html) aus data/faq-erweiterung.json.

Veröffentlicht nur Fragen mit "status": "frei". Kategorien ohne freie Frage erscheinen nicht.
Pro Kategorie: Überschrift, Fragen (<details class="faq-item">), Hinweis «Diese Informationen
ersetzen keine ärztliche Beurteilung.» und der Termin-CTA. Schreibt zwischen
<!-- faq-erweiterung:start --> und <!-- faq-erweiterung:end --> im FAQ-Block von index.html
und ergänzt die freien Fragen im FAQPage-JSON-LD (wortgleich mit dem sichtbaren Text).
EN: Felder «titel_en», «en» (frage, antwort, links relativ zu en/) und «hinweis_kategorie_en».
Idempotent. Aufruf aus dem Repo-Wurzelverzeichnis: python3 tools/build-faq-erweiterung.py
"""
import html, json, re, sys

D = json.load(open('data/faq-erweiterung.json', encoding='utf-8'))
L = {'de': dict(page='index.html', base='', more='Mehr dazu', cta='Termin buchen', hint='hinweis_kategorie', title='titel'),
     'en': dict(page='en/index.html', base='en/', more='More', cta='Book appointment', hint='hinweis_kategorie_en', title='titel_en')}


def text(fragment):
    return ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', fragment)).split()).replace(' .', '.').replace(' ,', ',').replace(' :', ':')


def link_label(href, base):
    path, _, frag = href.partition('#')
    page = open(base + path, encoding='utf-8').read()
    if frag:
        m = re.search(r'id="%s"[^>]*>\s*<summary>(.*?)</summary>' % re.escape(frag), page, re.S)
        if m: return text(m.group(1))
    return text(re.search(r'<h1[^>]*>(.*?)</h1>', page, re.S).group(1))


def build(lang):
    C = L[lang]
    s = open(C['page'], encoding='utf-8').read()
    blocks, schema, all_questions = [], [], set()
    for kat in D['kategorien']:
        all_questions.update(f['frage'] for f in kat['fragen'])
        all_questions.update(f['en']['frage'] for f in kat['fragen'] if 'en' in f)
        frei = [f for f in kat['fragen'] if f['status'] == 'frei']
        if lang == 'en': frei = [dict(f, **f['en']) for f in frei]
        if not frei: continue
        items = []
        for f in frei:
            if '{{OFFEN' in f['antwort']: sys.exit(f"{f['id']}: Antwort enthält {{{{OFFEN}}}}")
            body = f['antwort']
            if f['links']:
                body += f'<p class="faq-more">{C["more"]}: ' + ' · '.join(f'<a href="{h}">{link_label(h, C["base"])}</a>' for h in f['links']) + '</p>'
            items.append(f'        <details class="faq-item" id="faq-{f["id"].lower()}"><summary>{f["frage"]}</summary><div class="faq-answer">{body}</div></details>')
            schema.append((f['frage'], text(body)))
        blocks.append(f'''    <div class="faq-cat" id="{kat["id"]}">
      <h3>{kat[C["title"]]}</h3>
      <div class="faq-list">
{chr(10).join(items)}
      </div>
      <p class="faq-note">{D[C["hint"]]}</p>
      <a class="btn btn-primary cta-termin" href="#termin" data-cta="termin">{C["cta"]}</a>
    </div>''')

    out = '<!-- faq-erweiterung:start -->\n' + '\n'.join(blocks) + ('\n' if blocks else '') + '    <!-- faq-erweiterung:end -->'
    if '<!-- faq-erweiterung:start -->' in s:
        s = re.sub(r'<!-- faq-erweiterung:start -->.*?<!-- faq-erweiterung:end -->', lambda _: out, s, flags=re.S)
    else:
        sec = re.search(r'<section class="block" id="faq">.*?</section>', s, re.S)
        i = sec.group(0).rfind('</div>', 0, sec.group(0).rfind('</div>'))  # Ende der .faq-list, vor dem Ende von .wrap
        new = sec.group(0)[:i + len('</div>')] + '\n    ' + out + sec.group(0)[i + len('</div>'):]
        s = s.replace(sec.group(0), new)


    def fix_ld(m):
        d = json.loads(m.group(1))
        for n in d.get('@graph', []):
            if n.get('@type') == 'FAQPage':
                n['mainEntity'] = [q for q in n['mainEntity'] if q['name'] not in all_questions] + [
                    {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in schema]
        return '<script type="application/ld+json">' + json.dumps(d, ensure_ascii=False, separators=(',', ':')) + '</script>'


    s = re.sub(r'<script type="application/ld\+json">(.*?)</script>', fix_ld, s, count=1, flags=re.S)
    open(C['page'], 'w', encoding='utf-8').write(s)
    n_all = sum(len(k['fragen']) for k in D['kategorien'])
    print(f'{C["page"]}: {len(schema)} von {n_all} Fragen veröffentlicht (status frei):', ', '.join(f['id'] for k in D['kategorien'] for f in k['fragen'] if f['status'] == 'frei'))


for lang in ('de', 'en'):
    build(lang)
