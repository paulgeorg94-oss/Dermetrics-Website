# Handlungsanweisung SEO für dermetrics.ch

Stand: 14.11.2026. Grundlage: Mitbewerber-Recherche vom 14.11.2026 und Strategie-Dokument «SEO-Strategie Dermetrics».
Teil A ist für Claude Code (bestehende Seiten minimal anpassen). Teil B ist für Dr. Georg (neue Themenbereiche).

---

## Teil A: Anweisung an Claude Code

### A0. Grundregeln (gelten für jede Änderung)

1. **Minimal-invasiv.** Bestehenden Text, Reihenfolge, Design und Struktur nicht umschreiben. Erlaubt sind: `<title>`, Meta-Beschreibung, H1-Ergänzung, Ortsbegriffe in bestehenden Sätzen, interne Links, Alt-Texte, JSON-LD, Sitemap, llms.txt. Fliesstext nur ändern, wenn unten ausdrücklich verlangt. Pro Datei höchstens 3 inhaltliche Zeilen ändern.
2. **Nichts erfinden.** Keine Zahlen, Quellen, Leistungen, Titel, Adressen, Preise. Fehlt eine Angabe, den Platzhalter `[Praxis ergänzen]` setzen und im Bericht melden. Genau so: «Ich weiß es nicht.»
3. **Titel:** Dr. Georg ist Facharzt für Dermatologie und Venerologie (Angabe von Dr. Georg; der Comparis-Eintrag «Assistent» ist falsch und wird korrigiert). Der Titel darf auf der Website genannt werden, aber nur wörtlich so, wie er der Weiterbildungsordnung entspricht, und überall gleich geschrieben. Dazu gehört der Titel «Experte für Dermatochirurgie» (offizieller Weiterbildungstitel laut Dr. Georg), wörtlich wie im Titelnachweis. «Dermatochirurgie» ist damit ein Kernbegriff für Title, H1 und eine eigene Seite. Keine weiteren Spezialisierungen («Spezialist für …») ohne ausdrückliche Bestätigung. Abweichende Schreibweisen im Repo melden.
4. **Keine Heilversprechen, Superlative, Heilungsraten, Patientenzahlen, Testimonials.** Nie «Nr. 1», «führend», «beste», «garantiert». Bestehende Fälle nur melden, nicht stillschweigend ändern.
5. **Keine Laserbehandlung von Muttermalen** erwähnen oder bewerben (V-NISSG Art. 6). Keine Werbung für rezeptpflichtige Arzneimittel (HMG Art. 32 Abs. 2).
6. **Angebotsabhängige Begriffe** (Acne inversa, Wundsprechstunde, Mohs-Chirurgie, Narben/Keloide) nur einsetzen, wenn Dr. Georg das Angebot im Auftrag ausdrücklich bestätigt hat. Sonst nur den Entwurf anlegen, mit `noindex`.
7. **Schweizer Orthografie** (kein ß). Name immer «Dr. med. Paul J. Georg», Marke immer «Dermetrics». Adresse immer: Clinic Selnau, Brandschenkestrasse 45, 8002 Zürich.
8. **Design-Tokens nutzen**, keine festen Farben: `--aubergine #300C61`, `--aubergine-mid #4B2C86`, `--ink #241C2E`, `--muted #756B82`, `--line #E4DEE8`, `--ivory #FBF8F6`, `--notice-bg #F5F1FA`. Schrift Inter. Abstände im 4/8-Raster. Klassennamen vor dem Anlegen prüfen (Kollision wie `.facts`).
9. **Git:** Branch `claude/website-erstellung-wxrt0v`. Vor jedem Push `git pull --rebase`. Ein Commit pro Thema, Commit-Meldung auf Deutsch, was und warum. Konflikte in `css/style.css` (beide Seiten hängen unten an) durch Behalten beider Blöcke lösen.
10. **Kein Push ohne Prüfung** (A5). Danach Bericht (A6).

### A0a. Begriffe, die Mitbewerber in Zürich nutzen

Sachliche Keywords der Mitbewerber werden übernommen, sofern Dr. Georg die Leistung anbietet. Zusätzlich zu den Clustern der Strategie:

- **Übernehmen (Angebot vorausgesetzt):** Dermatochirurgie Zürich, Hautchirurgie, Hautkrebs entfernen / Hautkrebsoperation, Muttermal entfernen (chirurgisch), Hautkrebsvorsorge, Hautcheck, Muttermalkontrolle, Hautarzt / Dermatologe Zürich, Warzen, Narbenbehandlung, Keloid, Faltenbehandlung, Skinbooster, Skin Longevity, Laser-Haarentfernung, Tattoo entfernen, Besenreiser, CO2-Laser, Picolaser, Nd:YAG, 3D-Ganzkörperfotografie / Fotofinder (nur das eigene Gerät), Online-Termin, neue Patienten, Grundversicherung / Zusatzversicherung (neutral).
- **Botox / Botulinumtoxin:** nur sachliche Information ohne Werbecharakter (rezeptpflichtig, HMG Art. 32 Abs. 2). Vor Einsatz Rechtsprüfung.
- **Nicht übernehmen, auch wenn Mitbewerber es nutzen:** Rangaussagen («Nr. 1», «führend», «erste Adresse»), Heilungsraten und Patientenzahlen, Testimonials («zufriedene Patienten»), Heilversprechen, «Muttermale weglasern» (gesetzliches Verbot, V-NISSG Art. 6). Dass andere Praxen es verwenden, macht es nicht zulässig. Sachliche Alternative: Titel, Verfahren, Ablauf, Kosten.

Jede Übernahme als eigene Zeile im Bericht (A6) mit Fundstelle der Mitbewerber-Verwendung (siehe Recherchebericht vom 14.11.2026).

### A0b. Zusätzliches Angebot (von Dr. Georg bestätigt, 14.11.2026) und Regel «nur hinzufügen»

**Regel «nur hinzufügen» (gilt für alles in diesem Dokument):** Keine bestehende Information, kein Absatz, keine Quelle, keine FAQ-Antwort, kein Link und kein Alt-Text wird entfernt, gekürzt oder umformuliert. Title, Meta und H1 werden nur um Begriffe ergänzt. Einzige Ausnahme: Meta-Beschreibungen über 160 Zeichen dürfen gekürzt werden; Originalwortlaut dann in der Commit-Meldung und im Bericht festhalten. Ergänzt wird nur, was a) Mitbewerber in Zürich sachlich nutzen oder b) laut Strategie gut abdeckbar ist. Im Zweifel nichts ändern und melden.

**Neues Angebot (Angaben von Dr. Georg):**
- Botulinumtoxin-Behandlungen (Handelsname BOTOX)
- Filler-Behandlungen mit Produkten der Firma Galderma (Restylane)
- Spezifische Konsultationen zur Vermeidung und Verbesserung der Hautalterung (Longevity-Beratung)

Umsetzung:
1. **Je Angebot eine eigene Seite** (Vorlage Patienteninformation, Entwurf mit `noindex`, A4): «Botulinumtoxin-Behandlung Zürich», «Filler-Behandlung Zürich», «Longevity-Beratung Zürich (Hautalterung)». Inhalt nur aus Material von Dr. Georg; fehlende Angaben `[Praxis ergänzen]`. Keine Anwendungsdetails (Dosierung, Mengen, Intervalle) erfinden.
2. **Bestehende Seiten ergänzen:** Leistungsübersicht, Startseite (ein Verweis je Angebot), Fusszeilen-/Menüeinträge, JSON-LD `MedicalClinic` bzw. `availableService`. Bestehenden Text nicht ändern.
3. **Wortlaut:** sachlich, ohne Wirkungsversprechen («verjüngen», «Falten verschwinden», «natürlich schön»), ohne Vorher-Nachher-Bilder, ohne Preisaktionen oder Rabatte, ohne Testimonials. Nicht «Anti-Aging garantiert», sondern «Beratung zur Vermeidung und Verbesserung der Hautalterung». Begriffe der Mitbewerber (Botox, Faltenbehandlung, Skin Longevity) dürfen als Suchbegriffe in Title, H1, Meta und FAQ stehen.
4. **Rechtlicher Vorbehalt (wichtig):** Botulinumtoxin ist ein rezeptpflichtiges Arzneimittel. Publikumswerbung dafür ist nach HMG Art. 32 Abs. 2 lit. a unzulässig; die Nennung des Handelsnamens auf einer öffentlichen Seite kann als Werbung gelten. Für Filler (Restylane, Medizinprodukt) gelten eigene Werberegeln, die hier nicht geprüft sind. Deshalb: Seiten zu Botulinumtoxin und Filler bleiben auf `noindex` und ausserhalb von Sitemap und Menü, bis Dr. Georg schriftlich bestätigt «Rechtsprüfung erledigt». Bis dahin nur sachliche Erwähnung der Behandlung in der Leistungsübersicht ohne Produktwerbung.
5. **Longevity-Beratung** ist eine Konsultation (keine Arzneimittel- oder Produktwerbung) und kann nach ärztlicher Freigabe ohne `noindex` online gehen.
6. **Verzeichnisse** (OneDoc, Comparis, local.ch, Google Business Profile) um diese Leistungen ergänzen: Aufgabe für Dr. Georg, nicht für Claude Code.

### A1. Ausgangsprüfung (nur lesen, nichts ändern)

Für jede HTML-Seite eine Tabelle erzeugen und als `seo-audit.md` im Arbeitsordner (nicht im Repo) ablegen:

| Datei | Title (Zeichen) | Meta (Zeichen) | H1 | Wörter | canonical | hreflang | JSON-LD-Typen | noindex | in Sitemap |

Zusätzlich melden: Seiten ohne H2, doppelte Titles, Meta unter 110 oder über 160 Zeichen, Bilder ohne Alt, beide E-Mail-Adressen (clinicselnau@hin.ch, paul.georg@hin.ch), Zeilen mit Superlativen oder Heilversprechen, Erwähnungen von Muttermal und Laser im selben Absatz.
Hinweis: Die folgenden Befunde stammen aus einer früheren Prüfung und sind teilweise schon erledigt (FAQ der Patientenseiten ergänzt, Pico-Meta auf 130 Zeichen gekürzt). Alles neu prüfen, nichts davon als aktuell annehmen. Bekannt aus früherer Prüfung: `medix-anmeldung.html` ohne H2; Pico-Meta 182 Zeichen (zu lang); Akne/Rosazea 115 und Mohs 120 Zeichen (zu kurz); Patientenseiten dünn (Solare Elastose 362, Spinaliom 368, Basalzellkarzinom 410, Rosazea 439, Aktinische Keratosen 460 Wörter). Die Live-Seite war für die Recherche nicht abrufbar, daher selbst prüfen.

### A2. Standort und Konsistenz (Priorität 1)

1. **Standortseite** `standort.html` (oder bestehende Kontaktseite erweitern, wenn vorhanden): Clinic Selnau, Brandschenkestrasse 45, 8002 Zürich; Nähe Bahnhof Enge und Paradeplatz (nur Angaben, die im Auftrag stehen oder auf clinicselnau.ch belegt sind). Ortsbegriffe «Zürich Enge», «Kreis 2», «Selnau» zusammen verwenden, «Selnau» nie allein. Zeitangaben zu Wegen nur mit `[Praxis ergänzen]`.
2. **Fusszeile und JSON-LD** auf allen Seiten: gleiche Schreibweise von Name, Adresse, Telefon. JSON-LD `MedicalClinic` bzw. `Physician` mit `address` (PostalAddress), `telephone`, `url`. `medicalSpecialty` nur im Rahmen von Regel A0.3 (Dermatologie und Venerologie).
3. **Startseite:** Title und H1 um den Ortsbegriff ergänzen, Inhalt unverändert. Entwurf: Title «Hautarzt Zürich Enge, Kreis 2 | Dermetrics», H1 «Dermatologie in Zürich Enge: Dermetrics an der Clinic Selnau». Vorher den bestehenden Wortlaut zeigen und nur die Ortsergänzung vornehmen.
4. **E-Mail-Adressen:** beide Adressen nur melden, nicht ändern.

### A3. Bestehende Seiten verbessern (je Seite nur Folgendes)

Für jede Patienten- und Leistungsseite (aktinische-keratosen, basalzellkarzinom, spinaliom, solare-elastose, rosazea, photodynamische-therapie, Mohs, Akne/Rosazea) in dieser Reihenfolge:

1. **Meta-Beschreibung** auf 120 bis 155 Zeichen bringen. Aus dem bestehenden Text ableiten, einen Satz, mit Hauptbegriff und «Zürich».
2. **Title** (um 60 Zeichen): «<Hauptbegriff> Zürich: <Zusatz> | Dermetrics». Bestehenden Title als Ausgangspunkt nehmen.
3. **H1** unverändert, ausser sie enthält den Hauptbegriff nicht. Dann Ergänzung in Klammern.
4. **«Kurz gesagt»-Absatz** (40 bis 60 Wörter), falls fehlend: nur aus vorhandenem Seitentext zusammenfassen, nichts Neues. Als `.notice` einfügen.
5. **FAQ** je Seite 4 bis 6 Fragen, nur wenn die Antworten bereits in der FAQ oder auf der Seite stehen. Dazu JSON-LD `FAQPage`, deckungsgleich mit dem sichtbaren Text.
6. **Interne Links:** Verweis auf die Standortseite und von der Startseite auf jede Leistungsseite. Ankertext sachlich («Hautkrebsvorsorge in Zürich»).
7. **Alt-Texte** ergänzen, wo sie fehlen.
8. **Quellenliste** nicht anfassen. Neue Quellen nur auf Auftrag.

Dünne Seiten (unter 500 Wörter) nicht selbst aufblähen. Stattdessen im Bericht auflisten, welche Abschnitte aus dem Fachtext von Dr. Georg ergänzt werden sollten.

### A4. Neue Seiten anlegen (nur auf ausdrücklichen Auftrag)

Reihenfolge nach Strategie: 1 Acne inversa, 1 Standort, 2 Hautkrebsvorsorge, 2 Muttermal (chirurgisch), 3 Psoriasis, 3 Neurodermitis, 3 Chronische Wunden, 3 Narben/Keloide, 4 Mohs.

Für jede neue Seite:
- Vorlage `patienteninformationen/rosazea.html` bzw. die Pico-/Nd:YAG-Seiten (Praktisches-Kacheln `.pfacts`). Aufbau: Head (canonical, hreflang, OG, JSON-LD `MedicalWebPage`), Nav und Footer wortgleich, «Kurz gesagt», Übersicht, Optionen, Pullquote, Quellen, CTA `cta-termin`, `qrshare`, Rücklink.
- **Inhalt nur aus Material von Dr. Georg oder freigegebenem Fachtext.** Fehlendes als `[Praxis ergänzen]`.
- **Entwurfsschutz:** `<meta name="robots" content="noindex, nofollow">` und HTML-Kommentar «ENTWURF: noindex entfernen, sobald Literaturliste ergänzt und Inhalt ärztlich freigegeben ist». Nicht in Sitemap, nicht im Menü.
- Freigabe (nur auf Auftrag): `noindex` entfernen, `sitemap.xml` (lastmod), `llms.txt`, Kachel in «Wissen & Education» und `hauterkrankungen-erklaert.html`, EN-Seite mit hreflang, Rücklink von verwandten Seiten.

### A5. Prüfung vor dem Push

1. `xmllint --noout sitemap.xml` ohne Fehler; jede indexierbare Seite hat einen Eintrag, keine `noindex`-Seite steht darin.
2. Alle JSON-LD-Blöcke parsen (Python `json.loads`).
3. Pro Seite genau ein H1, keine Sprünge in der Überschriftenhierarchie, canonical und hreflang vorhanden und gegenseitig korrekt.
4. Alle internen Links lösen auf (kein 404). Bilder mit Alt.
5. Mobil 390 px: kein horizontaler Überlauf (Playwright, Screenshot).
6. Textvergleich: `git diff --stat` und `git diff` zeigen nur die in A2 und A3 erlaubten Zeilen. Jede unerlaubte Änderung rückgängig machen.
7. Suche im Diff nach: «Nr. 1», «führend», «beste», «garantiert», «Heilung», «Laser» neben «Muttermal», Preisen, Zahlen. Treffer prüfen und melden.
8. Live-Deployment nach dem Push prüfen (GitHub Pages) und Ergebnis melden. Wenn nicht prüfbar: «Ich weiß es nicht.»

### A6. Bericht an Dr. Georg (kurz)

- Was geändert wurde (Datei, alt, neu) als Tabelle.
- Was bewusst nicht geändert wurde und warum (Regeln A0).
- Platzhalter `[Praxis ergänzen]`, die offen sind.
- Auffälligkeiten (Superlative, Zahlen ohne Quelle, E-Mails, dünne Seiten).
- Was nicht geprüft werden konnte.

---

## Teil B: Ablauf für neue Themenbereiche (für Dr. Georg)

Ziel: Ein neues Thema in einem Durchgang von der Idee zur indexierbaren Seite bringen, ohne Fakten zu erfinden und ohne Rechtsrisiko.

### B1. Entscheiden

- [ ] Bietet Dr. Georg die Leistung tatsächlich an? (Pflicht bei Acne inversa, Wunden, Mohs, Narben/Keloide.)
- [ ] Ein Hauptbegriff in Patientensprache (zum Beispiel «Acne inversa Zürich»).
- [ ] Prüfen, ob schon eine Seite existiert (dann ausbauen statt neu anlegen).
- [ ] Rechtsprüfung: kein Laser bei Muttermalen, keine Werbung für rezeptpflichtige Arzneimittel, Titel nur gemäss Weiterbildungsordnung und überall gleich.

### B2. Recherchieren (Skill «dermatologie-recherche-workflow»)

1. Etablierte Indikationen und Leitlinien (AWMF, S2k/S3, internationale Konsensus) prüfen.
2. Rechercheplan, dann OpenEvidence-Prompt. Ergebnis (Text oder Datei) zurückgeben.
3. Quellen mit Status führen: «Volltext gelesen», «Abstract gelesen», «nur Titel gefunden», «aus Material des Nutzers, nicht geprüft».
4. Fachübersicht für Ärzte, dann Patienteninformation in einfacher Sprache.

### B3. SEO-Grundgerüst je Seite

| Element | Vorgabe |
| --- | --- |
| Title | Hauptbegriff plus Zürich, etwa 60 Zeichen, «\| Dermetrics» am Ende |
| Meta | 120 bis 155 Zeichen, ein sachlicher Satz |
| H1 | Hauptbegriff in Patientensprache |
| Kurz gesagt | 40 bis 60 Wörter, Antwort zuerst |
| Struktur | Was ist es, wann zum Hautarzt, Behandlungswege, Ablauf, Kosten und Kostenübernahme (neutral), Praktisches (`.pfacts`) |
| FAQ | 4 bis 6 Fragen aus echten Patientenfragen, Antworten kurz |
| Quellen | nummeriert, echter Link, Studientyp |
| Intern | Link zur Standortseite, zu verwandten Seiten, Termin-Button |
| Daten | JSON-LD `MedicalWebPage` und `FAQPage`, Datum «Zuletzt geprüft» |
| Länge | mindestens 600 Wörter, wo der Inhalt es trägt; nicht auffüllen |

### B4. Freigabe und Start

1. Ärztliche Freigabe, Literaturliste vollständig, Platzhalter ersetzt.
2. Claude Code: `noindex` entfernen, Sitemap, `llms.txt`, Kacheln, EN-Seite (A4).
3. Verzeichnisse aktualisieren: OneDoc-Expertisen, Comparis-Leistungen, local.ch, search.ch, Google Business Profile.
4. Search Console: URL zur Indexierung einreichen.

### B5. Messen

- Search Console: Impressionen, Klicks, Position je Seite, nach 4 bis 8 Wochen vergleichen.
- Monatliche Stichprobe der Google-Suche in Zürich (Top-10, lokale Karte, KI-Übersicht), Datum notieren.
- Suchvolumen nur aus Keyword Planner oder anderen belegbaren Quellen. Sonst: «Ich weiß es nicht.»

### B6. Priorität der Themen

1. Acne inversa, Standortseite (freie Begriffe)
2. Startseite (Ortsbegriff), Hautkrebsvorsorge, Muttermal (chirurgisch)
3. Psoriasis, Neurodermitis, Chronische Wunden, Narben/Keloide
4. Mohs-Chirurgie nur nach Bestätigung; Laser-Seiten (Nd:YAG, Pico) nach ärztlicher Freigabe
