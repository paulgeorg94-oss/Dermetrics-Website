#!/usr/bin/env python3
"""Prüft, dass jede FAQPage im JSON-LD wortgleich mit den sichtbaren FAQ
(<details class="faq-item"><summary>Frage</summary><p>Antwort</p>) ist.
Exit 1 bei Abweichung."""
import glob, html, json, re, sys
bad = 0
for p in sorted(glob.glob('*.html') + glob.glob('*/*.html') + glob.glob('*/*/*.html')):
    if p.startswith(('src/', 'assets/')): continue
    s = open(p, encoding='utf-8').read()
    for blk in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        for n in json.loads(blk).get('@graph', []):
            if n.get('@type') != 'FAQPage': continue
            schema = [(q['name'], q['acceptedAnswer']['text']) for q in n['mainEntity']]
            visible = [(html.unescape(re.sub(r'<[^>]+>', '', q)).strip(), html.unescape(re.sub(r'<[^>]+>', '', a)).strip())
                       for q, a in re.findall(r'<details class="faq-item"><summary>(.*?)</summary><p>(.*?)</p></details>', s, re.S)]
            if schema != visible:
                bad += 1; print('ABWEICHUNG', p)
                for i, (a, b) in enumerate(zip(schema, visible)):
                    if a != b: print('  #', i + 1, a, '!=', b)
                if len(schema) != len(visible): print('  Anzahl', len(schema), 'vs', len(visible))
            else:
                print('ok', p, len(schema), 'Fragen')
sys.exit(1 if bad else 0)
