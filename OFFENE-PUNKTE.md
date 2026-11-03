# Fragenplan: offene Fragen und zu klärende Probleme

Stand: 3. November 2026 · gehört zu Branch `seo-geo-2026-11` · Details im Bericht `audit/BERICHT.md`.

Bitte je Frage kurz antworten (Nummer + Antwort). Ich setze die Antworten danach in `data/praxis.json` und auf den Seiten um. Reihenfolge: zuerst **Priorität 1**, sie blockiert den Deploy oder betrifft die Rechtssicherheit.

## Priorität 1: vor dem Deploy klären

| # | Frage | Warum es zählt | Wo es steht |
|---|---|---|---|
| **D1** | Darf der Branch `seo-geo-2026-11` live gehen (Übernahme auf `claude/website-erstellung-wxrt0v`)? Alternativ: welche Teile nicht? | Ihr Prompt verlangt eine Freigabe vor jedem Deploy. | ganzer Branch |
| **C1** | „Zertifizierter Experte für Dermatochirurgie“: Welches Zertifikat, welcher Aussteller, welches Jahr? | Unbelegte Qualifikationen sind nach FMH-Standesordnung und UWG heikel; die Angabe steht sichtbar auf der Startseite. | Startseite: Qualifikation, Kopfbereich („Experte für Dermatochirurgie“) |
| **C2** | „Zertifizierter Praxis-OP“: Welches Zertifikat, welcher Aussteller? | wie C1 | Startseite: Leistungsübersicht, Qualifikation, FAQ |
| **C3** | Mohs-Chirurgie: Wo findet die Schnittrandkontrolle statt (eigenes Labor, Pathologie-Partner)? | Die FAQ beschreibt das Verfahren; der Ablauf bei Ihnen ist nicht belegt. | Startseite: FAQ |
| **C4** | Der Link zum Google-Profil führt auf eine Seite, auf der Bewertungen erscheinen können. Ist das für Sie mit der FMH-Standesordnung (keine Patientenbewertungen in eigener Werbung) vereinbar, oder soll der Link nur auf die Karte zeigen? | Ich habe den Link bewusst ohne das Wort „Bewertungen“ gesetzt. | Fusszeilen aller Seiten, Kontakt |
| ~~A2~~ | **Erledigt (3.11.2026):** Alle Adressen lauten jetzt `clinicselnau@hin.ch` (Zuweisungen, Konsile, Kontaktformular, Apéro-Anmeldung, Datenschutz). | | |
| **A3** | Datenschutztext Google Maps (Abschnitt 13, DE/EN) ist ein Entwurf. Bitte rechtlich prüfen lassen, besonders die Aussagen zu Cookies und Datenübermittlung in die USA. | Ich habe den Text nicht juristisch geprüft. | `impressum.html#google-maps`, `en/legal.html#google-maps` |
| **A4** | Hautkrebs-Screening-Seite: Dort steht „3D-Ganzkörperscan (DB-Scan)“, auf der Startseite „DeviScan“. Welcher Name stimmt? | Ich habe Ihren Text wortgleich übernommen. | `leistungen/hautkrebs-screening.html` |

## Priorität 2: Fakten bestätigen oder ergänzen

| # | Frage | Wo es steht |
|---|---|---|
| **B1** | Sprechstunde Clinic Selnau: Montag **10:00–18:00** oder **12:30–18:00**? | Startseite (Auf einen Blick, Standorte, FAQ), JSON-LD, `llms.txt` |
| **B2** | Eröffnung „7. Dezember 2026“ jetzt auch in der Einladung? Dort steht Ihr Wortlaut „Ab Dezember 2026 beginnt die operative und konservative Tätigkeit …“. Ich habe ihn nicht geändert. | `eroeffnung.html`, `en/eroeffnung.html` |
| **B3** | Kanonische Google-Maps-URL mit CID (statt des Kurzlinks `share.google/…`)? | JSON-LD `hasMap`, `sameAs` |
| **B4** | OneDoc-Profile: Sind diese URLs (aus dem Impressum) richtig und sollen sie in `sameAs` aufgenommen werden? `…/zurich/pc1tv/dr-med-paul-georg` und `…/affoltern-am-albis/pcqb0/dr-med-paul-georg` | Impressum, `data/praxis.json` |
| **B5** | Geo-Koordinaten der drei Standorte (oder Freigabe, sie aus dem Google-Profil zu übernehmen)? | JSON-LD `geo` (noch nicht gesetzt) |
| **B6** | Öffnungszeiten MediX Altstetten: Mi 09:00–17:00, Fr 08:00–12:00. Stimmt das, und gilt es ab sofort oder ab 7.12.2026? | Startseite, JSON-LD |
| **B7** | Dürfen Mitgliedschaften (SGDV, EADV) und Weiterbildungen als `hasCredential` ins JSON-LD? Welche genau, mit Aussteller und Jahr? | JSON-LD Arzt |

## Priorität 3: Entscheidungen für weitere Phasen

| # | Frage | Phase |
|---|---|---|
| **E1** | Standortseiten (Selnau/Enge, Affoltern, Altstetten): Anfahrt (ÖV, Parkplätze), eigene Texte je Standort, Leistungen je Standort. Wer liefert die Texte? | 3.3 |
| ~~E2~~ | **Erledigt:** „Kreis 2“ von Ihnen bestätigt und eingebaut (Startseite, Fusszeilen, Leistungsseiten, JSON-LD, `llms.txt`). | 3.5 |
| ~~E3~~ | **Erledigt:** Karte per Klick im Kontaktbereich (DE/EN), `frame-src` für Google, Datenschutz-Abschnitt 13. Ob die Karte lädt, konnte ich nicht prüfen: `www.google.com` ist aus der Arbeitsumgebung gesperrt. Nach dem Deploy bitte einmal anklicken. | 2.5 / 3.3 |
| **E4** | Leistungsseiten: 5 Seiten von Ihnen geliefert und eingebaut (Hautkrebs-Screening, Mohs-Chirurgie, gutartige Hautveränderungen, Akne und Rosazea, Acne inversa). Es fehlen noch: Psoriasis, Wundbehandlung, Narbentherapie, Tumorchirurgie (in Ihren Vorlagen verlinkt, Links vorerst entfernt). Englische Fassungen der 5 Seiten: übersetzen? | 6 |
| **E6** | Startseite: Die Leistungsübersicht zeigt jetzt nur noch die 5 Kacheln. Die bisherigen Listen (Wunden, Narben, Psoriasis, Melasma, ECMP) stehen dort nicht mehr, sondern nur noch in „Auf einen Blick“, in der FAQ und im JSON-LD. So gewollt? | Startseite |
| **E5** | Sollen die 13 älteren Seiten (Behandlungsprotokolle DE/EN, ältere englische Patientenseiten) auf das neue Seitenlayout mit Navigation umgestellt werden? Heute haben sie ein eigenes, schlichteres Layout. | Technik |

## Zu klärende Probleme

| # | Problem | Vorschlag |
|---|---|---|
| **P1** | **Kritisches CSS:** Auf 24 Seiten umgesetzt (`tools/critical-css.js`), Design pixelgleich geprüft. Lokal kein messbarer Gewinn: Startseite DE 93 (vorher 93), EN 93 (vorher 95), Mohs-Seite 95–97 (vorher 96–97). Lighthouse meldete schon vorher keine render-blockierenden Dateien. Live-Werte kenne ich nicht. | Nach dem Deploy mit PageSpeed Insights messen. Bringt es live nichts: `node tools/critical-css.js --restore`. Nach jeder Änderung an `css/style.css` das Werkzeug neu laufen lassen. |
| **P2** | **Weiterleitung:** Eine 301-Weiterleitung `index.html → /` ist auf GitHub Pages nicht möglich. | Kanonische URLs und interne Links sind angepasst; mehr ist auf diesem Hosting nicht machbar. |
| **P3** | **Validatoren:** Schema-Validator und Rich-Results-Test waren aus der Arbeitsumgebung nicht erreichbar. | Nach dem Deploy einmal prüfen, Ergebnis in `audit/schema-validierung.md`. |
| **P4** | **robots.txt:** Die Bot-Namen habe ich nicht mit der aktuellen Doku der Anbieter abgeglichen. | Ich kann das mit einer Web-Recherche nachholen; die Regel `User-agent: * / Allow: /` erlaubt ohnehin alle. |
| **P5** | **Schriftlizenz:** Die Inter-Schriften wurden auf die verwendeten Zeichen reduziert. Ob die Lizenz dafür eine Umbenennung verlangt (Reserved Font Name), habe ich nicht geprüft. | Prüfen oder auf die vollen Dateien zurückgehen (Leistung sinkt dann). |
| **P6** | **Aufgezählte Leistungen:** Für Acne inversa und Mohs gibt es jetzt Seiten. Für Psoriasis, Wundbehandlung, ECMP und Narbentherapie noch nicht. | Siehe E4. |
| **P7** | **Text auf 24 Seiten:** Der neue Einleitungssatz lautet „In der Praxis Dermetrics … behandeln wir [Thema]“. Für das Anti-Aging-Protokoll steht „beraten wir zur Hautpflege“, für Mosaic 3D „behandeln wir Narben auch mit Laser“. Bitte die Formulierungen bestätigen. | `patienteninformationen/*`, `behandlungsprotokolle/*`, EN-Pendants |
| **P8** | **Kopfbereich:** Der Satz „Experte für Dermatochirurgie“ im Kopfbereich und „zertifizierter Experte“ in der Qualifikation sollten gleich lauten, sobald C1 geklärt ist. | Startseite |
