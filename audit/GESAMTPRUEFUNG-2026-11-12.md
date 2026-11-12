# Gesamtprüfung dermetrics.ch – 12.11.2026

Geprüft wurde der Live-Stand (Branch `claude/website-erstellung-wxrt0v`), nicht der Relaunch-Entwurf.

## Umfang (was geprüft wurde)

| Bereich | Umfang | Methode |
|---|---|---|
| Seiten | 52 HTML-Seiten (DE und EN), alle | Skript `audit_site.py` (statisch) + Browser-Test je Seite |
| Interne Links und Anker | alle `href` auf allen 52 Seiten | Datei- und ID-Abgleich |
| Externe Links | 67 Adressen (Quellen, Google, WhatsApp, clinicselnau.ch) | **nicht prüfbar**: Netzwerkregel der Arbeitsumgebung sperrt die Hosts |
| FAQ | 143 Fragen auf 19 Seiten | sichtbarer Text = FAQPage-JSON-LD (`tools/check-faq.py`), Duplikate, Widersprüche |
| Kopfdaten | Titel, Meta-Beschreibung, canonical, og:*, hreflang, lang, viewport | je Seite |
| Strukturierte Daten | alle JSON-LD-Blöcke | JSON-Gültigkeit, Name/Adresse/Telefon |
| Sitemap, llms.txt, robots.txt | vollständig | Abgleich mit Seiten und noindex |
| Bilder, Skripte, CSS, Schriften | alle Verweise | Datei vorhanden, alt, width/height |
| Darstellung | jede Seite bei 1366 px und 390 px | Skriptfehler, fehlende Dateien, seitliches Scrollen, kaputte Bilder |
| Funktionen | Pre-Check DE/EN, Termin-Fenster, Karte, Kontaktformular, Cookie-Einstellungen, Karussell, Navigation, Selbsttest, MediX-Formular, QR-Teilen | Browser-Test |
| Inhalte | Zeiten, Adressen, Daten, Preise, Intervalle, Dauer, Namen, Nummern | Textabgleich über alle Seiten |

## Ohne Befund

- Keine kaputten internen Links, keine fehlenden Anker, keine fehlenden Bilder/Skripte/Schriften.
- Keine Skriptfehler, kein seitliches Scrollen auf allen 52 Seiten (Desktop und Mobile).
- hreflang auf allen Seiten gegenseitig korrekt; canonical = eigene Adresse; ein H1 je Seite.
- Sitemap: alle indexierbaren Seiten enthalten, Entwürfe (noindex) nicht enthalten.
- FAQ: alle 143 Fragen wortgleich mit den strukturierten Daten.
- Telefon, WhatsApp, E-Mail, Adressen (Clinic Selnau, Affoltern, Altstetten), Sprechstunde Montag 10–18 Uhr, Eröffnung 7.12.2026, Apéro 14.12.2026 (Montag): überall gleich.
- Pre-Check (13 Fragen, DE/EN), Termin-Fenster, Karte erst nach Klick, Navigation, QR-Code, Selbsttest, Pflichtfeldprüfung MediX-Formular: funktionieren.

## Direkt korrigiert (Commit «Gesamtprüfung»)

1. **Praxisname vereinheitlicht** auf «Dermetrics – Dermatologie Clinic Selnau» (Fusszeilen, Copyright, JSON-LD «Dermetrics – Clinic Selnau», data/praxis.json, llms.txt). Vorher drei Varianten. Im Impressum steht die verantwortliche Person (Dr. med. Paul J. Georg) weiterhin als eigene Zeile.
2. **«Cookie-Einstellungen» in der Fusszeile** der Startseiten DE/EN war ohne Funktion; öffnet jetzt die Einstellungen.
3. **Vorschaubild für soziale Medien (og:image)** fehlte auf 13 Seiten (6 Leistungsseiten DE, 6 EN, Selbstuntersuchung EN); ergänzt.
4. **4 englische Seitentitel zu lang** (67–74 Zeichen) → 55–62 Zeichen («… – Dermatologist Zurich | Dermetrics»).
5. **Überschriften-Sprung h2→h4** auf 12 Leistungsseiten (Quellenblock) → h3, Aussehen unverändert.
6. **Termin-FAQ DE/EN** nannte zweimal dieselbe Nummer («telefonisch unter … oder per WhatsApp unter …») → «telefonisch oder per WhatsApp unter +41 43 234 55 55»; ebenso im MediX-Formular-Hinweis.
7. **Interne Arbeitsdateien öffentlich abrufbar**: Ordner `relaunch/` (Inventare) wurde mitveröffentlicht → in `_config.yml` ausgeschlossen.
8. Sitemap-Daten (lastmod) aktualisiert; `tools/build-llms.py` nimmt den Titel jetzt aus dem Praxisnamen.

## Zu entscheiden (bitte festlegen)

| # | Unstimmigkeit | Fundstellen |
|---|---|---|
| E1 | **Kosten Hautkrebs-Vorsorge widersprüchlich**: Startseite (A4) «ca. 160 CHF, Zusatzversicherung (VVG)»; Leistungsseite «Grundversicherung nur unter Voraussetzungen, sonst Selbstzahler», ohne Preis. | `index.html` FAQ A4; `leistungen/hautkrebs-screening.html` + EN |
| E2 | **Kontrollintervall**: «jährlich / einmal im Jahr» vs. «individuell nach Risiko». | jährlich: Basalzellkarzinom, Spinaliom (Text + FAQ), Selbstuntersuchung (DE/EN). Individuell: Startseite A3/A7, Leistungsseite Screening |
| E3 | **PDT-Dauer**: «rund zwei Stunden» vs. «1 Stunde Einwirkzeit + 10–30 Min. Licht». | `patienteninformationen/aktinische-keratosen.html` + EN vs. PDT-Seite |
| E4 | **Kontaktformular**: Hinweis «Ihre Anfrage wird direkt an die Praxis übermittelt». Tatsächlich öffnet sich das E-Mail-Programm der Besucher (Formspree nicht eingerichtet); keine Bestätigung auf der Seite. | Startseite DE/EN |
| E5 | **Werbeaussage** «garantiert eine sehr sichere und deutlich über dem Durchschnitt liegende … Exzision» (UWG/HMG/FMH). | `patienteninformationen/basalzellkarzinom.html` + EN |
| E6 | **Nd:YAG / Pico**: Entwurf (noindex, nicht in Sitemap), aber im Menü und auf der Startseite verlinkt; Preis «ab 300 CHF pro Sitzung» – Quelle/Freigabe? Keine EN-Fassung. | beide Seiten |
| E7 | **Altes Layout ohne Menü und ohne Fusszeile**: 4 DE-Behandlungspläne, 9 EN-Seiten (Patienteninfos, Behandlungspläne). | `behandlungsprotokolle/*`, `en/patient-information/*` (5), `en/treatment-protocols/*` |
| E8 | **Fehlende EN-Seiten**: Zuweisung (MediX), Anmeldung, Nd:YAG, Pico; EN-Startseite ohne die 32 neuen FAQ. | – |
| E9 | **Doppelte Frage** «Wie läuft ein Hautkrebs-Screening ab?» mit unterschiedlichen (nicht widersprüchlichen) Antworten. | Startseite und Leistungsseite Screening |
| E10 | **Meta-Beschreibungen kurz** (107–109 Zeichen). | EN: Selbstuntersuchung, Akne/Rosazea, Mohs |
| E11 | **«Facharztprüfung Dermatologie und Venerologie FMH»** im Lebenslauf (Prüfungsname, kein Titel) – so lassen? | Startseite DE/EN |
| E12 | **WhatsApp = Festnetznummer**: funktioniert nur mit WhatsApp Business auf +41 43 234 55 55. | überall |
| E13 | **Externe Links (67)** konnten nicht geprüft werden (Netzwerksperre der Arbeitsumgebung). | Quellenlisten |
