# Einbettung auf clinicselnau.ch: Pre-Check und Termin per WhatsApp

Stand: 25. November 2026. Die eingebettete Seite liegt auf dermetrics.ch und wird mit
`python3 tools/build-embed.py` aus der Startseite erzeugt (Fragen, Auswertung und Hinweise
bleiben dadurch identisch mit dermetrics.ch).

- Deutsch: https://dermetrics.ch/embed/pre-check.html
- Englisch: https://dermetrics.ch/en/embed/pre-check.html

## HTML-Code für die Clinic-Selnau-Seite (Deutsch)

In der Clinic-Selnau-Seite an der gewünschten Stelle als HTML-Block einfügen:

```html
<!-- Dermetrics: Hautkrebs-Pre-Check und Termin per WhatsApp (Einbettung) -->
<div style="max-width:780px;margin:0 auto;">
  <iframe id="dermetrics-precheck"
          src="https://dermetrics.ch/embed/pre-check.html"
          title="Dermetrics – Hautkrebs-Pre-Check und Termin per WhatsApp"
          loading="lazy"
          style="display:block;width:100%;height:1400px;border:0;"
          referrerpolicy="strict-origin-when-cross-origin"></iframe>
</div>
<script>
  (function () {
    var frame = document.getElementById('dermetrics-precheck');
    window.addEventListener('message', function (e) {
      if (e.origin !== 'https://dermetrics.ch' || !e.data || e.data.type !== 'dermetrics-embed-height') return;
      var h = parseInt(e.data.height, 10);
      if (h > 300 && h < 8000) frame.style.height = h + 'px';
    });
  })();
</script>
```

Für die englische Seite nur die `src` ersetzen durch
`https://dermetrics.ch/en/embed/pre-check.html` und den `title` durch
`Dermetrics – Skin cancer Pre-Check and appointment via WhatsApp`.

## So funktioniert es

- Der iframe zeigt den Pre-Check (13 Fragen, Auswertung, PDF) und darunter «Termin per WhatsApp anfragen»
  sowie die Telefonnummer. Nach einem auffälligen Ergebnis erscheint der WhatsApp-Button auch direkt im Ergebnis.
- WhatsApp öffnet sich in einem neuen Tab mit vorausgefülltem Text, ohne Pre-Check-Ergebnis.
- Die eingebettete Seite meldet ihre Höhe per `postMessage`; das kleine Skript im Code passt die
  iframe-Höhe an, damit kein Scrollbalken entsteht. Es akzeptiert nur Nachrichten von https://dermetrics.ch.
- Entfernt das CMS das `<script>`, bleibt der iframe 1400 px hoch und ist innen scrollbar.
- Umami zählt Aufrufe der Einbettung (Pfad `/embed/pre-check.html`) und Klicks mit der Eigenschaft
  `quelle = einbettung`, getrennt von Klicks auf dermetrics.ch.

## Voraussetzungen auf clinicselnau.ch

- Falls die Clinic-Selnau-Seite eine Content Security Policy verwendet: `frame-src https://dermetrics.ch`
  ergänzen, sonst blockiert der Browser den iframe.
- Datenschutzerklärung der Clinic Selnau um die eingebettete Drittseite ergänzen
  (Vorschlag, rechtlich nicht geprüft): «Auf dieser Seite ist der Hautkrebs-Pre-Check von Dermetrics
  (Dr. med. Paul J. Georg) eingebettet. Beim Laden verbindet sich Ihr Browser mit dermetrics.ch
  (Hosting: GitHub Pages) und mit Umami (Reichweitenmessung ohne Cookies). Ihre Antworten im Pre-Check
  bleiben in Ihrem Browser. Details: https://dermetrics.ch/impressum.html#datenschutz»
