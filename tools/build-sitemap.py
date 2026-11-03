#!/usr/bin/env python3
"""Erzeugt sitemap.xml aus den HTML-Seiten: loc = kanonische URL, lastmod =
letzter Commit der Datei (heute, wenn ungespeicherte Änderungen), hreflang
wie im <head> der Seite. changefreq/priority bleiben aus der bestehenden
sitemap.xml erhalten. Aufruf: python3 tools/build-sitemap.py && xmllint --noout sitemap.xml"""
import re, glob, subprocess, datetime
BASE='https://dermetrics.ch/'
old=open('sitemap.xml').read()
meta={}; order=[]
for blk in re.findall(r'<url>(.*?)</url>', old, re.S):
    loc=re.search(r'<loc>([^<]+)</loc>', blk).group(1); order.append(loc)
    meta[loc]=(re.search(r'<changefreq>([^<]+)</changefreq>', blk).group(1), re.search(r'<priority>([^<]+)</priority>', blk).group(1))
pages=[p for p in sorted(glob.glob('*.html')+glob.glob('*/*.html')+glob.glob('*/*/*.html')) if not p.startswith(('src/','assets/','tools/','audit/'))]
url={p:(BASE if p=='index.html' else BASE+p) for p in pages}; byurl={v:k for k,v in url.items()}
# new pages go right after their German counterpart
for p,u in url.items():
    if u in order: continue
    s=open(p,encoding='utf-8').read()
    de=re.search(r'hreflang="de-CH" href="([^"]+)"', s)
    if p.startswith('leistungen/'):  # Leistungsseiten direkt nach der Startseite
        i=order.index(BASE)+1+sum(1 for x in order if x.startswith(BASE+'leistungen/'))
        order.insert(i,u); meta[u]=('monthly','0.8'); continue
    i=order.index(de.group(1))+1 if de and de.group(1) in order else len(order)
    order.insert(i,u); meta[u]=meta.get(de.group(1) if de else '',('monthly','0.7'))
today=datetime.date.today().isoformat()
def lastmod(p):
    if subprocess.run(['git','status','--porcelain','--',p],capture_output=True,text=True).stdout.strip(): return today
    return subprocess.run(['git','log','-1','--format=%cs','--',p],capture_output=True,text=True).stdout.strip() or today
out=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"','        xmlns:xhtml="http://www.w3.org/1999/xhtml">','']
for u in dict.fromkeys(order):
    p=byurl.get(u)
    if not p: continue
    head=open(p,encoding='utf-8').read().split('</head>')[0]
    cf,pr=meta[u]
    out+=['  <url>',f'    <loc>{u}</loc>',f'    <lastmod>{lastmod(p)}</lastmod>',f'    <changefreq>{cf}</changefreq>',f'    <priority>{pr}</priority>']
    out+=[f'    <xhtml:link rel="alternate" hreflang="{l.lower()}" href="{h}"/>' for l,h in re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', head)]
    out+=['  </url>','']
out.append('</urlset>')
open('sitemap.xml','w').write('\n'.join(out)+'\n'); print(sum(1 for x in out if '<loc>' in x),'urls')
