#!/usr/bin/env python3
"""Seiten-Inventar für SEO/GEO: schreibt eine CSV mit Title, Meta, H1/H2,
Canonical, hreflang, robots, OG, JSON-LD-Typen, Alt-Lücken, internen Links,
Wortzahl und Begriffs-Vorkommen. Aufruf: python3 tools/audit-pages.py audit/seiten.csv"""
import csv, glob, html, json, re, sys
from html.parser import HTMLParser
from urllib.parse import urljoin

BASE = 'https://dermetrics.ch/'
TERMS = ['Hautarzt', 'Dermatologe', 'Zürich', 'Selnau', 'Enge', 'Kreis 2', '8002', 'Hautkrebs',
         'Tumorchirurgie', 'Mohs', 'Wundbehandlung', 'Narbentherapie', 'Psoriasis', 'Acne inversa']

def pages():
    out = sorted(glob.glob('*.html') + glob.glob('*/*.html') + glob.glob('*/*/*.html'))
    return [p for p in out if not p.startswith(('src/', 'assets/', 'tools/', 'audit/'))]

def url_of(p):
    if p == 'index.html': return BASE
    return BASE + p

def norm(u):
    u = u.split('#')[0]
    return BASE if u in (BASE + 'index.html',) else u

class Text(HTMLParser):
    """Sichtbarer Text (ohne script/style), H1/H2-Texte, Bilder ohne Alt."""
    def __init__(self):
        super().__init__(); self.skip = 0; self.buf = []; self.cur = None; self.h = {'h1': [], 'h2': []}; self.noalt = 0
    def handle_starttag(self, t, a):
        a = dict(a)
        if t in ('script', 'style', 'noscript'): self.skip += 1
        if t in ('h1', 'h2'): self.cur = [t, []]
        if t == 'img' and 'alt' not in a: self.noalt += 1
    def handle_endtag(self, t):
        if t in ('script', 'style', 'noscript'): self.skip -= 1
        if self.cur and t == self.cur[0]:
            self.h[t].append(' '.join(''.join(self.cur[1]).split())); self.cur = None
    def handle_data(self, d):
        if self.skip: return
        self.buf.append(d)
        if self.cur: self.cur[1].append(d)

def main(dest):
    rows, links = [], {}
    for p in pages():
        s = open(p, encoding='utf-8').read(); head = s.split('</head>')[0]; u = url_of(p)
        g = lambda pat: (re.search(pat, head) or [None, ''])[1]
        tp = Text(); tp.feed(s)
        words = len(re.findall(r'\w+', ' '.join(tp.buf)))
        text = ' '.join(tp.buf)
        types = []
        for blk in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
            try:
                d = json.loads(blk)
                for n in d.get('@graph', [d]):
                    t = n.get('@type'); types += t if isinstance(t, list) else [t]
            except Exception as e:
                types.append('UNGUELTIG')
        out = {norm(urljoin(u, h)) for h in re.findall(r'<a\b[^>]*href="([^"]+)"', s) if not h.startswith('#')}
        out = {x for x in out if x.startswith(BASE)}
        links[u] = out
        title = html.unescape(g(r'<title>([^<]*)</title>')); meta = html.unescape(g(r'<meta name="description" content="([^"]*)"'))
        row = {'URL': u, 'Datei': p, 'Title': title, 'Title-Länge': len(title), 'Meta': meta, 'Meta-Länge': len(meta),
               'H1': ' | '.join(tp.h['h1']), 'H1-Anzahl': len(tp.h['h1']), 'H2': ' | '.join(tp.h['h2']),
               'Canonical': g(r'<link rel="canonical" href="([^"]+)"'),
               'hreflang': ' '.join(f'{a}' for a, b in re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', head)),
               'robots': g(r'<meta name="robots" content="([^"]+)"') or '(Standard: index, follow)',
               'OG': ' '.join(sorted(set(re.findall(r'property="og:([a-z_:]+)"', head)))),
               'JSON-LD': ' '.join(dict.fromkeys(str(t) for t in types)), 'Bilder ohne alt': tp.noalt,
               'Links aus': len(out), 'Wortzahl': words}
        for t in TERMS: row[t] = len(re.findall(re.escape(t), text, re.I))
        rows.append(row)
    for r in rows:
        r['Links ein'] = sum(1 for v, o in links.items() if v != r['URL'] and r['URL'] in o)
    keys = list(rows[0].keys())
    keys.insert(keys.index('Links aus'), keys.pop(keys.index('Links ein')))
    with open(dest, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=keys, delimiter=';'); w.writeheader(); w.writerows(rows)
    print(len(rows), 'Seiten ->', dest)

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'audit/seiten.csv')
