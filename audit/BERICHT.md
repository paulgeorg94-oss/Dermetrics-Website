# SEO/GEO-Bericht dermetrics.ch

Stand: 3. November 2026 · Branch `seo-geo-2026-11` · Grundlage: `CLAUDE-CODE-PROMPT-SEO-GEO.md` vom 03.11.2026.
Offene Fragen stehen in [`OFFENE-PUNKTE.md`](../OFFENE-PUNKTE.md).

## Kurzfassung

- **Umgesetzt:** alle Punkte aus Phase 1 bis 5 und 7, die keine offenen Angaben brauchen.
- **Nicht umgesetzt:** Standortseiten (Phase 3.3), Leistungsseiten (Phase 6) und alles, wofür Angaben fehlen (Zertifikate, Koordinaten, Kartenfreigabe). Begründung je Punkt in `OFFENE-PUNKTE.md`.
- **Nicht deployed:** Die Änderungen liegen nur auf dem Branch `seo-geo-2026-11`. Die Live-Seite (Branch `claude/website-erstellung-wxrt0v`) ist unverändert.

## Werkzeuge im Repository

| Datei | Zweck |
|---|---|
| `data/praxis.json` | Verbindliche Praxisdaten (Name, Adresse, Telefon, Zeiten, Profile). Offene Werte sind `null`. |
| `tools/audit-pages.py` | Seiteninventar als CSV (`audit/seiten.csv`, Ausgangslage in `audit/seiten-vorher.csv`). |
| `tools/check-nap.py` | Prüft Name, Adresse, Telefon, E-Mail und Fusszeile aller Seiten gegen `data/praxis.json`. Ergebnis: 34 Seiten, 0 Abweichungen. |
| `tools/sync-footer.py` | Schreibt die Praxisangaben aus `data/praxis.json` in die Fusszeilen. |
| `tools/check-faq.py` | Prüft, dass FAQ im JSON-LD wortgleich mit den sichtbaren FAQ sind. Ergebnis: DE 9/9, EN 9/9 identisch. |
| `tools/build-sitemap.py` | Erzeugt `sitemap.xml` aus den Seiten (lastmod aus Git, hreflang aus dem `<head>`). |
| `tools/build-llms.py` | Erzeugt `llms.txt` aus `data/praxis.json` und der Sitemap. |
| `tools/add-page-lead.py`, `tools/fix-technical.py` | Einmalige Korrekturen (idempotent). |

## Phase 1: Befunde aus dem Crawl vom 03.11.2026

| Befund | Ergebnis | Beleg | Status |
|---|---|---|---|
| Eröffnungsdatum widersprüchlich | **Bestätigt:** Laufbahn „Okt. 2026“ vs. FAQ „7. Dezember 2026“. | `index.html` Laufbahn-Tabelle, `en/index.html` „Oct. 2026“ | Behoben: Laufbahn jetzt „7. Dez. 2026“ (DE/EN). Einladung „Ab Dezember 2026“ ist kein Widerspruch und blieb unverändert. |
| E-Mail uneinheitlich | **Bestätigt:** `clinicselnau@hin.ch` (Zuweisungen) und `paul.georg@hin.ch` (Kontaktformular, Apéro-Anmeldung, Datenschutz). | `index.html` Kontakt, `assets/eroeffnung-form.js`, `impressum.html` | Offen: Rollen bestätigen (Frage A2). |
| Name uneinheitlich | **Bestätigt:** „Dr. med. P. Georg“ in Fusszeilen, „Dr. med. Paul J. Georg“ im Impressum. | alle Fusszeilen | Behoben: überall „Dermetrics – Dr. med. Paul J. Georg“. |
| sitemap.xml defekt | **Bestätigt** (bereits am 03.11. behoben, Commit `bd48394`). | – | Jetzt per `tools/build-sitemap.py`; `xmllint --noout` ohne Fehler. |
| Interne Links auf `index.html`, Canonical auf `/` | **Bestätigt.** | alle Unterseiten | Behoben: Links auf `/` bzw. `/en/index.html`. Englische Seiten verlinkten zudem die deutsche Startseite und das deutsche Impressum; jetzt die englischen. |
| H1 ohne Leerzeichen | **Bestätigt:** 24 Seiten (z. B. „BasalzellkarzinomWeisser Hautkrebs“), dazu die Einladung („EröffnungsapéroClinic Selnau“). | H1 mit `<span class="h1sub">` | Behoben: Untertitel ist ein eigenes `<p class="h1sub">`. |
| Fehlende Alt-Texte | **Widerlegt:** 0 Bilder ohne `alt` (Clinic-Galerie und Laserbilder haben Alt-Texte). | `audit/seiten-vorher.csv`, Spalte „Bilder ohne alt“ | Zusätzlich: Breite/Höhe bei allen Bildern ergänzt. |
| EN-Startseite Title 61 / Meta 166 Zeichen | **Bestätigt.** | `audit/seiten-vorher.csv` | Behoben: 60 / 154. Gleich lang waren 4 weitere Titel und 2 Meta-Texte; alle jetzt ≤60 / ≤155. |
| og:site_name DE/EN verschieden | **Widerlegt** (beide „Dermetrics – Clinic Selnau“). | `<head>` beider Startseiten | – |
| EN-Link der Laserseite ohne Entsprechung | **Bestätigt** (vor dem 03.11.). | – | Behoben am 03.11. (englische Fassung angelegt). |
| Selbsttest ohne H2 | **Bestätigt** (DE/EN). | – | Behoben: H2 „Acht Aussagen zur Hautkrebsvorsorge“ / „Eight statements on skin cancer prevention“. |
| Startseiten-H1 ohne Orts-/Leistungsbezug | **Bestätigt.** | – | Behoben: „Hautarzt in Zürich Selnau/Enge – Hautgesundheit ist messbar.“ (EN sinngemäss). |
| JSON-LD und hreflang (vom Crawl nicht sichtbar) | Auf allen 34 Seiten vorhanden und gültig; hreflang-Paare gegenseitig. x-default fehlte auf 32 von 34 Seiten. | `tools/audit-pages.py` | Behoben: x-default auf allen Paaren. |

Kennzahlen (34 Seiten), vorher → nachher: Titel >60 Zeichen 5 → 0 · Meta >155 Zeichen 3 → 0 · H1 zusammengeklebt 24 → 0 · ohne x-default 32 → 0 · ohne H2 2 → 0 · Seiten mit „Enge“ 9 → 28.

## Phase 2: Technik

**Fakten:**
- Sitemap: 34 URLs, gültig (`xmllint`), lastmod je Datei aus Git, x-default in allen Einträgen.
- Externe Skripte mit `defer`; das App-Bundle (React, ca. 195 KB) lädt erst, wenn der App-Bereich in die Nähe kommt (`assets/stageshow-loader.js`).
- Porträt als WebP (65 KB statt 581 KB), `fetchpriority="high"`. Alle Bilder mit `width`/`height`.
- Inter-Schriften auf die verwendeten Zeichen reduziert: je ca. 19 KB statt ca. 112 KB. `font-display: swap` war bereits gesetzt; Vorladen der zwei Startseiten-Schnitte ergänzt.
- Kontrast: Popup-Grau, WhatsApp-Grün, Fusszeilen-Link und App-Store-Button angehoben; Quellenlinks unterstrichen.
- `favicon.ico` angelegt (war 404).

**Lighthouse mobil, lokal gemessen** (`audit/lighthouse/*.json`, Lighthouse 12.2.1, Python-Testserver ohne Kompression):

| Seite | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Startseite DE | 94 | 100 | 100 | 100 | 2,9 s | 0,007 | 0 ms |
| Startseite EN | 96 | 100 | 100 | 100 | 2,6 s | 0,038 | 0 ms |
| Übersicht | 97 | 100 | 100 | 100 | 2,6 s | 0,007 | 10 ms |
| Basalzellkarzinom | 98 | 100 | 100 | 100 | 2,3 s | 0,005 | 50 ms |
| Protokoll Akne | 98 | 100 | 100 | 100 | 2,1 s | 0,007 | 30 ms |
| Selbsttest | 98 | 100 | 100 | 100 | 2,1 s | 0,007 | 10 ms |

Zum Vergleich vor den Änderungen: Performance 54 / 65 / 77 / 78 / 79 / 81, LCP 3,9–6,3 s.

**Unsicherheiten:**
- Die Werte stammen vom lokalen Testserver. dermetrics.ch war aus dieser Umgebung nicht erreichbar. Ob die Live-Werte höher oder tiefer liegen, weiss ich nicht.
- Startseite DE verfehlt das Ziel knapp (Performance 94, LCP 2,9 s statt <2,5 s).
- INP lässt sich im Labor nicht messen. TBT ist nur ein Näherungswert.
- „Critical CSS inline“ ist nicht umgesetzt: Das bräuchte einen Build-Schritt für 34 Seiten. Die Werte sind auch ohne das bei 94–98.
- Eine 301-Weiterleitung `index.html → /` ist auf GitHub Pages nicht konfigurierbar. Hosting ist GitHub Pages, belegt durch die Datei `CNAME` und den Workflow „pages build and deployment“. Abhilfe sind die kanonischen URLs und die angepassten internen Links.
- **Schriftlizenz:** Das Reduzieren der Inter-Schriften ist eine Änderung der Schriftdateien. Ob die SIL Open Font License bei Inter einen „Reserved Font Name“ festlegt, der dann eine Umbenennung verlangt, habe ich nicht geprüft.

## Phase 3: Lokales SEO

- H1 der Startseiten mit Ort.
- Block „Auf einen Blick“ (`<dl>`) auf der Startseite DE/EN.
- **Fusszeilen** auf allen 34 Seiten mit vollem Namen, Adresse, Telefon und Link zum Google-Profil. Die 13 älteren Seiten hatten vorher keine Adresse und kein Telefon.
- **Englische Seiten:** „8002 Zürich“ statt „8002 Zurich“ (NAP-Gleichheit).
- **Patienten- und Protokollseiten (24, DE/EN):** zitierfähiger Einleitungssatz mit Ort und Link zur Leistungsübersicht.
- **Nicht umgesetzt:** Standortseiten (offen: Anfahrt, eigene Texte, Freigabe) und „Kreis 2“ (Freigabe nötig).

## Phase 4: Strukturierte Daten

- **Startseite:** Google-Profil als `hasMap` und `sameAs`. Die weiteren Standorte sind eigene `MedicalClinic`-Knoten (`#affoltern`, `#altstetten`). WebSite-Knoten mit `@id`.
- **Kennungen:** `#practice` und `#dr-georg` sind unverändert, weil 66 Stellen auf den Unterseiten auf sie verweisen.
- **24 Patienten- und Protokollseiten:** `BreadcrumbList`, verknüpft mit der `MedicalWebPage`.
- **Strukturelle Prüfung:** 67 Kennungen, 156 Verweise, 0 unaufgelöst.
- **Externe Validatoren:** validator.schema.org und der Google Rich-Results-Test waren aus dieser Umgebung nicht erreichbar (Antwort 000). Siehe `audit/schema-validierung.md`.
- **Nicht umgesetzt:** Koordinaten, `hasCredential` und OneDoc in `sameAs` (warten auf Ihre Angaben).

## Phase 5: GEO

- **Einleitung je Seite:** Jede Patienten- und Protokollseite beginnt jetzt mit was, wo und durch wen. Dazu kommt eine sichtbare Zeile „Verantwortlich … · Zuletzt geprüft/Stand …“. Das Datum stammt aus `lastReviewed` bzw. `dateModified` des bestehenden JSON-LD.
- **Statische Inhalte:** FAQ und Inhalte sind statisch im HTML. Nur die dekorative App-Animation lädt per JavaScript; ihr Text steht als Rückfall im HTML.
- **`llms.txt`:** wird aus `data/praxis.json` und der Sitemap erzeugt und enthält alle 34 Seiten. Ob Anbieter diese Datei auswerten, ist nicht belegt.
- **robots.txt:** Unverändert, alle Such- und KI-Crawler sind erlaubt. Den Abgleich der Bot-Namen mit der aktuellen Doku der Anbieter habe ich **nicht** gemacht (Frage F3).
- **Testfragen:** `audit/GEO-TESTFRAGEN.md` mit 15 Fragen für das monatliche Monitoring.

## Phase 6 und 7

- **Phase 6 (Leistungsseiten):** nicht begonnen. Laut Prompt erst nach dem separaten Rechercheplan.
- **Phase 7:** `audit/OFFSITE-CHECKLISTE.md` angelegt.

## Compliance-Ampel

Die Einstufung ist meine Einschätzung der Seitentexte, keine Rechtsberatung.

| Seiten | Ampel | Grund |
|---|---|---|
| Startseite DE/EN | **gelb** | „zertifizierter Experte für Dermatochirurgie“ und „zertifizierter Praxis-OP“ ohne genannten Aussteller (Fragen C1, C2). Link zum Google-Profil: Dort können Bewertungen stehen (Frage C4). |
| Patienten- und Protokollseiten | **grün** | Sachlich, mit Quellen und Haftungshinweis; keine Heilversprechen gefunden. |
| Übersicht, Selbsttest, Impressum, Einladung | **grün** | – |
