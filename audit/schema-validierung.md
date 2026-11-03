# Validierung der strukturierten Daten

Stand: 3. November 2026.

## Durchgeführt

- **JSON-Syntax:** Alle JSON-LD-Blöcke der 34 Seiten lassen sich fehlerfrei parsen (`tools/audit-pages.py`, Spalte „JSON-LD“, kein „UNGUELTIG“).
- **Verweise:** 67 eindeutige `@id`, 156 `@id`-Verweise, 0 Verweise ohne Ziel.
- **FAQ:** `tools/check-faq.py` vergleicht FAQPage mit den sichtbaren FAQ: DE 9/9 und EN 9/9 wortgleich.
- **Typen je Seitentyp:**
  - Startseite: WebPage, MedicalClinic (3), Physician (2), WebSite, FAQPage
  - Patienten- und Protokollseiten: MedicalWebPage, BreadcrumbList
  - Übrige Seiten: wie bisher

## Nicht durchgeführt

- **Schema-Validator und Rich-Results-Test:** `https://validator.schema.org/` und `https://search.google.com/test/rich-results` waren aus der Arbeitsumgebung nicht erreichbar (HTTP-Status 000). Bitte nach dem Deploy einmal pro Seitentyp prüfen:
  - Startseite
  - eine Patientenseite
  - ein Behandlungsprotokoll
  - Selbsttest

  Ergebnis hier eintragen.

| Seite | Schema-Validator | Rich-Results-Test | Datum |
|---|---|---|---|
| / | {{OFFEN}} | {{OFFEN}} | |
| /patienteninformationen/basalzellkarzinom.html | {{OFFEN}} | {{OFFEN}} | |
| /behandlungsprotokolle/akne.html | {{OFFEN}} | {{OFFEN}} | |
| /hautkrebs-selbsttest.html | {{OFFEN}} | {{OFFEN}} | |
