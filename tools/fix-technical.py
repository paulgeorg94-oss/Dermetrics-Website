#!/usr/bin/env python3
"""Einmalige technische SEO-Korrekturen (Phase 2). Idempotent: ein zweiter
Lauf ändert nichts mehr. Aufruf aus dem Repository-Wurzelverzeichnis."""
import glob, os, re
from PIL import Image

BASE = 'https://dermetrics.ch/'
pages = [p for p in sorted(glob.glob('*.html') + glob.glob('*/*.html') + glob.glob('*/*/*.html'))
         if not p.startswith(('src/', 'assets/', 'tools/', 'audit/'))]

def rel_target(page, href):
    """Absoluter Pfad (ab /) eines relativen Links."""
    d = os.path.dirname(page)
    return os.path.normpath(os.path.join(d, href)).replace('\\', '/')

changed = {}
for p in pages:
    s = o = open(p, encoding='utf-8').read()
    en = p.startswith('en/')

    # 1) H1-Untertitel als eigenes Element statt <span> im <h1>
    s = re.sub(r'<h1>([^<]*)<span class="h1sub">([^<]*)</span></h1>', r'<h1>\1</h1>\n    <p class="h1sub">\2</p>', s)
    s = s.replace('Eröffnungsapéro<br>Clinic Selnau</h1>', 'Eröffnungsapéro<br> Clinic Selnau</h1>')
    s = s.replace('Opening Reception<br>Clinic Selnau</h1>', 'Opening Reception<br> Clinic Selnau</h1>')

    # 2) Interne Links auf die Startseiten: kanonische Pfade statt index.html;
    #    englische Seiten verlinken die englische Startseite und das englische Impressum
    def link(m):
        attr, href = m.group(1), m.group(2)
        if re.match(r'(https?:|mailto:|tel:|#|/)', href): return m.group(0)
        path, _, frag = href.partition('#')
        t = rel_target(p, path)
        frag = ('#' + frag) if frag else ''
        is_lang_switch = 'class="lang"' in s[max(0, m.start() - 200):m.start()] and '<span class="current">' in s[max(0, m.start() - 200):m.end() + 80]
        if t == 'index.html':
            if en and not is_lang_switch and frag: return f'{attr}"/en/index.html{frag}"'
            return f'{attr}"/{frag}"' if frag else f'{attr}"/"'
        if t == 'en/index.html': return f'{attr}"/en/index.html{frag}"'
        if en and t == 'impressum.html' and not is_lang_switch: return f'{attr}"/en/legal.html{frag}"'
        return m.group(0)
    s = re.sub(r'(<a\b[^>]*?href=)"([^"]+)"', link, s)

    # 3) hreflang x-default (deutsche Fassung) bei jedem Sprachpaar
    head = s.split('</head>')[0]
    alts = dict(re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">', head))
    if 'x-default' not in alts and 'de-CH' in alts and 'en' in alts:
        last = list(re.finditer(r'<link rel="alternate" hreflang="[^"]+" href="[^"]+">', head))[-1]
        s = s[:last.end()] + f'\n<link rel="alternate" hreflang="x-default" href="{alts["de-CH"]}">' + s[last.end():]

    # 4) Externe Skripte nicht blockierend laden
    s = re.sub(r'<script src="([^"]+)"></script>', r'<script src="\1" defer></script>', s)

    # 5) Bilder mit Breite/Höhe (gegen Layout-Verschiebungen)
    def img(m):
        tag = m.group(0)
        if ' width=' in tag or 'data:' in tag: return tag
        src = re.search(r'src="([^"]+)"', tag).group(1)
        fp = rel_target(p, src) if not src.startswith('/') else src.lstrip('/')
        if not os.path.exists(fp): return tag
        w, h = Image.open(fp).size
        return tag.replace('<img ', f'<img width="{w}" height="{h}" ', 1)
    s = re.sub(r'<img\b[^>]*>', img, s)

    if s != o:
        open(p, 'w', encoding='utf-8').write(s); changed[p] = True
print(len(changed), 'Seiten geändert')
