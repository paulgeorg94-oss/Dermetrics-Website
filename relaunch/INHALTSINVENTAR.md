# Inhaltsinventar Startseite (Phase 1, Relaunch «Nach Anliegen»)

Stand: 05.11.2026 · Branch `relaunch-anliegen` (Basis: live, Commit 20b6700) · nur gelesen, nichts an den Seiten geändert.

Zählweise: Wörter im sichtbaren HTML des Abschnitts ohne `<script>`, `<style>`, `<svg>`. Ganze Startseite (`index.html`, Body): **2634 Wörter**. Ihr Prompt nennt ca. 3700; die Differenz kommt vermutlich von einer anderen Zählweise (z. B. mit Skript-Texten des Pre-Checks). Das ist eine Annahme.

## 1. Abschnitte und Zielort laut Mapping

| # | Abschnitt heute (Überschrift) | `index.html` Zeile | Wörter | Inhalt (Bestandteile) | Zielort laut Mapping |
|---|---|---|---|---|---|
| 1 | Hero: «Hautarzt in Zürich Selnau/Enge – Hautgesundheit ist messbar.» | 157 | 52 | Kicker «Science. Care. Longevity.», H1, Untertitel, Buttons «Pre-Check starten» und «Termin buchen →» (WhatsApp), 5 Vertrauenspunkte. **Kein Portrait** (am 04.11. auf Ihren Wunsch entfernt). | Startseite Hero (gekürzt) |
| 2 | «Auf einen Blick» – Dermetrics in Zürich Selnau/Enge (`#auf-einen-blick`) | 181 | 103 | Faktenliste: Praxis, Fachgebiet, Arzt, Adresse, Telefon, WhatsApp, Sprechstunde, Eröffnung, weitere Standorte | Startseite «Standort und Termin» + `/praxis/standorte.html` |
| 2a | MediX-Block mit QR-Code (in Abschnitt 2) | 197 | (in 2) | QR-Code `assets/qr-medix.svg` → `medix.html`, Button «Zuweisung Clinic Selnau (MediX)» | `/zuweisende.html` (+ Hinweis Standortseite Altstetten) |
| 3 | Praxisbild: Portrait «Willkommen in meiner Praxis in der Clinic Selnau» (in Abschnitt 2) | 207 | (in 2) | Bild `assets/dr-paul-j-georg-600/900.webp` (aus Ihrem bearbeiteten Foto) | `/praxis/clinic-selnau.html` · **Unsicherheit:** siehe Abschnitt 4, Punkt U1 |
| 4 | «Die drei Säulen von Dermetrics» (`#kernbereiche`) | 216 | 49 | Diagnose und Behandlung von Hautkrebs · Allgemeine Dermatologie · Prävention und Patientenedukation | `/praxis/clinic-selnau.html` |
| 5 | «Was wir messen und behandeln» (`#leistungen`, Karussell) | 249 | 84 | Kacheln: Hautkrebs-Screening · Lasertherapie · Anti-Aging-Beratung · Akne & Narben · Dermatochirurgie | Anliegen-Kacheln + `/leistungen/` |
| 6 | «Wie hoch ist Ihr Hautkrebs-Risiko?» Pre-Check (`#precheck`) | 350 | 534 | 13 Fragen, Auswertung, Hinweise, Ergebnis per PDF/E-Mail/Neu starten | `/hautkrebs-pre-check.html` |
| 7 | «Ihr Weg mit Dermetrics» (`#weg`) | 429 | 108 | Check · Messen · Verstehen · Handeln · Dranbleiben (inkl. DeviScan-Hinweis) | Ablauf auf jeder Anliegenseite |
| 8 | «Über die Clinic Selnau in Zürich-Enge» (`#clinic-selnau`) | 480 | 73 | Text + Galerie: OP-Saal, Empfang, Lounge, Eingang | `/praxis/clinic-selnau.html` |
| 9 | «Wie macht man medizinische Qualität sichtbar?» (`#praxis`) | 497 | 249 | Text, Qualifikationen, Laufbahn | Akkordeon «Qualifikation und Lebenslauf» + `/praxis/dr-paul-georg.html` |
| 10 | «Hier finden Sie Informationen zu Ihrer Behandlung» (`#wissen`) | 534 | 116 | Karten: Aktinische Keratosen · Basalzellkarzinom · Spinaliom · Solare Elastose · Rosazea · Akne · «Alle Patienteninformationen ansehen» | Akkordeon «Alle Leistungen und Informationen» + `/hauterkrankungen-erklaert.html` |
| 11 | «Lasertherapien im Überblick» (`#laserbehandlungen`) | 558 | 29 | Kachel Mosaic 3D (Erbium-Laser) | `/leistungen/lasertherapie.html` + Anliegen «Narbe» |
| 12 | «Drei Standorte im Raum Zürich» (`#kontakt`) | 571 | 261 | Buttons WhatsApp/Telefon, 3 Standortkarten mit Zeiten, Zuweisungszeile, Google-Karte per Klick, Google-Profil-Link, Kontaktformular, Hinweis «keine medizinischen Daten» | Startseite «Standort und Termin» (Selnau + Termin-Panel) + `/praxis/standorte.html` |
| 13 | «Ihr Verlauf, jederzeit im Blick» App-Vorschau (`#app`) | 653 | 97 | Text + animierte App-Vorschau (Stageshow) | `/projekte/dermetrics-app.html` |
| 14 | «Dermatologie in Zürich Selnau/Enge: unsere Leistungen» (`#leistungsuebersicht`) | 692 | 286 | 6 Leistungskacheln (Screening, Mohs, Gutartige, Akne/Rosazea, Acne inversa, PDT) + 4 Listen-Kacheln (Hautkrebs/Tumorchirurgie, Wunden/Narben, Chronische Hauterkrankungen, Ästhetische Dermatologie) | `/leistungen/index.html` + Akkordeon |
| 15 | «Qualifikation und Erfahrung» (`#qualifikation`) | 737 | 98 | Mitgliedschaften SGDV/EADV, Wundbehandlung, Dermatochirurgie (inkl. Kempf und Pfaltz), ECMP, Praxis-OP, Zusammenarbeit Plastische Chirurgie | zusammen mit 9 (Akkordeon + Arztseite) |
| 16 | «Häufige Fragen» (`#faq`) | 755 | 309 | 9 Fragen: Behandlungen · Ort · Öffnungszeit · Screening-Ablauf · Operationen in der Praxis · Mohs · Plastische Chirurgie · Chronische Wunden · Termin | 5 auf der Startseite, 4 auf Anliegen-/Leistungsseiten (Zuteilung: Abschnitt 3) |
| 17 | Claim «Longevity meets measurable science.» (in der Fusszeile, kein eigener Abschnitt) | 778 | (in 18) | Tagline | entfällt auf der Startseite (deutsch optional auf Praxisseite) |
| 18 | Fusszeile | 775 | 82 | Name, Ort, Adresse, Telefon, Google-Profil, Rechtliches, Eröffnung, FMH-Hinweis, Copyright | Fusszeile (NAP aus `data/praxis.json`) |
| 19 | Pre-Check-Ergebnisvorlage für Druck/PDF (`#pcPrintArea`) | 821 | 82 | Druckvorlage des Ergebnisses | `/hautkrebs-pre-check.html` |

Jeder Bestandteil der Startseite ist einer der Zeilen 1–19 zugeordnet. **Nicht im Mapping erfasst, aber vorhanden:**
- **Navigation** (8 Links + DE/EN + «Pre-Check starten»), Zeile 138: wird laut 3.2 ersetzt.
- **Eröffnungs-Popup** (`assets/opening-popup.js`, auf allen Seiten) und **Cookie-Hinweis** (`assets/cookiebanner.js`): bleiben technisch, kein Startseiten-Inhalt.
- **Strukturierte Daten** im `<head>` (WebPage, MedicalClinic ×3, Physician ×2, WebSite, FAQPage mit 9 Fragen): werden in Phase 5 neu verteilt.

## 2. Termin-CTAs heute

Vollständige Liste mit Datei und Zeile: `relaunch/CTA-INVENTAR.md` (87 Fundstellen, 20 Varianten).

Zusammenfassung (Fakten):
- **Navigation «Termin» → `/#kontakt`**: 20× (DE), «Appointment» → `/en/index.html#kontakt` 13× (EN), dazu 3 Abweichungen mit `#kontakt`.
- **«Termin per WhatsApp buchen» → wa.me**: 18× (DE-Seiten, WhatsApp-Block), **«Book via WhatsApp»**: 18× (EN).
- **Hero:** «Termin buchen →» / «Book appointment →» → wa.me.
- **Karussell Abschnitt 5:** «Termin vereinbaren» → `#kontakt` (2×).
- **«Termin anfragen»**, **«Request an appointment»**, **«Termin per WhatsApp buchen →»**, **«Book via WhatsApp →»**: je 1×.
- **OneDoc:** «Termin buchen (OneDoc) →» / «Book appointment (OneDoc) →» im Impressum DE/EN (`impressum.html:223, 231`, `en/legal.html:218, 226`), je 2×. Die OneDoc-Verknüpfung auf der Startseite hatten Sie früher löschen lassen; im Impressum stehen die beiden Buttons noch.

## 3. Vorschlag: Zuteilung der 9 FAQ (zur Freigabe)

| Frage | Vorschlag |
|---|---|
| Welche Behandlungen bietet Dermetrics …? | Startseite (Kasse fehlt als Frage; siehe U4) |
| Wo befindet sich die Praxis? | Startseite (Standort) |
| Wann ist die Clinic Selnau geöffnet? | Startseite (Eröffnung) |
| Wie vereinbare ich einen Termin? | Startseite (Termin) |
| Wie läuft ein Hautkrebs-Screening ab? | Startseite (Pre-Check-Bezug) oder `/anliegen/hautkrebs-vorsorge.html` |
| Werden Operationen direkt in der Praxis durchgeführt? | `/anliegen/hautveraenderung-entfernen.html` |
| Bieten Sie Mohs-Chirurgie an? | `/leistungen/mohs-chirurgie.html` |
| Arbeiten Sie mit der Plastischen Chirurgie zusammen? | `/praxis/clinic-selnau.html` oder Anliegen «Fleck/Muttermal» |
| Wie werden chronische Wunden behandelt? | `/anliegen/wunde-heilt-nicht.html` |

## 4. Fakten · Annahmen · Unsicherheiten

### Fakten (Datei/Zeile)
- F1 `data/praxis.json` besteht seit 03.11.2026 und ist die Quelle für `tools/check-nap.py`; Prüfung heute: 48 Seiten, 0 Abweichungen. Ich habe sie nicht neu angelegt, sondern nur ergänzt (siehe F12).
- F2 Name auf allen Seiten: **«Dr. med. Paul J. Georg»** (Ihre Vorgabe vom 04.11.). Ihr Prompt schreibt «Dr. med. Paul Georg» und `/praxis/dr-paul-georg.html`.
- F3 `og:site_name` auf allen 48 Seiten: **«Dermetrics»** (Ihre Vorgabe vom 05.11.). Ihr Prompt verlangt «Dermetrics – Clinic Selnau».
- F4 Die 3 Titel (PDT, Gutartige, Screening) und 2 Metas sind seit 05.11. gekürzt (50/57/51 Zeichen); Prompt 4.2 nennt noch die alten Längen 73/70/62.
- F5 Eröffnungsseite DE/EN: «Ab dem 7. Dezember 2026» seit 05.11. (Prompt Abschnitt 7 führt das noch als offen).
- F6 E-Mail-Rollen auf der Seite: `clinicselnau@hin.ch` für Zuweisungen, Kontakt, Datenschutz, MediX-Anmeldung; `paul.georg@hin.ch` nur für den Apéro (`eroeffnung.html:143`, `assets/eroeffnung-form.js`). «Konsile» kommen auf keiner Seite vor. `praxis.json` führt `email_konsile: clinicselnau@hin.ch`; Ihr Prompt nennt `paul.georg@hin.ch` für Konsile.
- F7 Sprechstunde Clinic Selnau überall «Montag 10:00–18:00», in `praxis.json` als `bestaetigt: false` markiert.
- F8 Google-Profil: nur Kurzlink `https://share.google/EMOgfxDGYLcdnslC7`; `google_maps_cid_url: null`.
- F9 Weitere Standorte: Novaderm Affoltern (Di/Do 08:00–17:00), MediX Altstetten (Mi 09:00–17:00, Fr 08:00–12:00, 3D-Analyse).
- F10 MediX-Zuweisung besteht als `medix.html` + `medix-anmeldung.html` (nicht im Menü); Ihr Prompt plant `/zuweisende.html`.
- F11 Bestehende Seiten: 6 Leistungsseiten DE + 6 EN (`leistungen/`, `en/services/`), 8 Patienteninformationen DE, 4 Behandlungsprotokolle DE, je EN-Pendants, `hautkrebs-selbsttest.html` (Wahr-oder-falsch-Test), `hauterkrankungen-erklaert.html`.
- F12 In `praxis.json` habe ich nur ein Prüfdatum ergänzt; keine Werte geändert.

### Annahmen
- A1 «Praxisbild» (Mapping Nr. 3) ist das Portrait neben «Auf einen Blick». Ein anderes Praxisbild gibt es auf der Startseite nicht; die Clinic-Fotos gehören zu Nr. 8.
- A2 «Abschluss «Longevity meets measurable science.»» (Nr. 17) ist die Tagline in der Fusszeile.
- A3 «Pre-Check-Ergebnisvorlage» (Nr. 19) ist die Druckvorlage `#pcPrintArea`.

### Unsicherheiten / zu entscheiden (vor Phase 2)
- U1 **Portrait im Hero:** Am 04.11. haben Sie es aus dem Kopfbereich entfernen lassen; der Prompt (3.1) setzt es wieder in den Hero. Welche Variante gilt? Die Datei `dermetrics_dr-paul-georg_retusche.jpg` liegt nicht im Repository; vorhanden ist Ihr bearbeitetes Foto als `assets/dr-paul-j-georg-600/900.webp`. Ist das dasselbe Bild?
- U2 **Name:** «Dr. med. Paul J. Georg» (aktuell) oder «Dr. med. Paul Georg» (Prompt)? Und Dateiname `/praxis/dr-paul-georg.html` so lassen?
- U3 **og:site_name:** «Dermetrics» (seit 05.11.) oder «Dermetrics – Clinic Selnau» (Prompt 4)?
- U4 **FAQ «Kasse»:** Es gibt heute keine Startseiten-Frage zur Krankenkasse. Die Leistungsseiten haben Kassen-Fragen (Ihr Text). Soll ich eine allgemeine Kassen-Frage aus diesen Texten zusammenstellen (Neutext → Ihre Freigabe) oder bleibt es bei den 4 vorhandenen + Screening?
- U5 **OneDoc im Impressum:** Werden die beiden OneDoc-Buttons beim CTA-Umbau entfernt oder bleiben sie (dann zählt `check-cta.py` sie als Ausnahme)?
- U6 **Video:** `dermetrics_video_paul-georg_graded.mp4` liegt nicht vor (Drive-Download ist aus der Arbeitsumgebung gesperrt, siehe 04.11.).
- U7 **MediX:** `medix.html`/`medix-anmeldung.html` behalten und von `/zuweisende.html` verlinken, oder in `/zuweisende.html` aufgehen lassen? Der QR-Code zeigt heute auf `medix.html`; eine Umleitung ist auf GitHub Pages nicht möglich, die Adresse sollte also bestehen bleiben.
- U8 **Termin-Panel «Anfrageformular»:** Gemeint ist das bestehende Kontaktformular (mailto/Formspree) aus Abschnitt 12? Ich nehme das an.

## 5. Ihre Entscheidungen (05.11.2026)

- U1 Portrait: Das bearbeitete Foto (`assets/dr-paul-j-georg-*.webp`) ist das Bild für den Hero.
- U2 Name: «Dr. med. Paul J. Georg» bleibt.
- U3 `og:site_name`: «Dermetrics – Dermatologie Clinic Selnau» (umgesetzt in Phase 2 auf allen 48 Seiten).
- U4 FAQ «Kasse»: noch offen.
- U5 OneDoc: aus dem Impressum DE/EN entfernt (Phase 2).
- U6 Video: bleibt aussen vor.
- U7 MediX und andere Zuweisungen: gleich handhaben (Phase 4.3, `/zuweisende.html`; `medix.html` bleibt wegen QR-Code bestehen).
- U8 Anfrageformular im Termin-Panel: das bestehende Kontaktformular (`#contact-form`).
- Nr. 7 «Ihr Weg mit Dermetrics»: auf der Startseite als aufklappbarer Eintrag im FAQ-Bereich unten (DE/EN, `#weg`, Deep-Link öffnet den Eintrag), zusätzlich wie geplant als Ablauf auf den Anliegenseiten (Ihre Vorgabe vom 05.11.2026).
