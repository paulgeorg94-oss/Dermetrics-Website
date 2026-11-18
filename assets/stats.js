/* Dermetrics — eigene Besucherstatistik, ohne Drittanbieter und ohne Cookies.
   - Kein Cookie, kein localStorage, keine Kennung im Browser.
   - Gesendet werden nur: Seite, Herkunfts-Domain, UTM-Kampagne, Gerätetyp,
     Sprache und Klicks auf Kontaktwege. Keine Formular- oder Pre-Check-Inhalte.
   - Respektiert «Do Not Track» und «Global Privacy Control».
   Empfänger ist der eigene Sammel-Server (Ordner stats-server/). */
(function () {
  "use strict";

  var ENABLED = false; // auf true setzen, sobald der Sammel-Server läuft
  var ENDPOINT = "https://stats.dermetrics.ch/e";

  if (!ENABLED) return;
  if (!/(^|\.)dermetrics\.ch$/.test(location.hostname)) return;
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true) return;

  function send(o) {
    o.p = location.pathname;
    o.l = (document.documentElement.lang || "").slice(0, 5);
    var body = JSON.stringify(o);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "text/plain" }))) return;
      fetch(ENDPOINT, { method: "POST", body: body, keepalive: true, mode: "no-cors", headers: { "Content-Type": "text/plain" } });
    } catch (e) { /* Statistik darf die Seite nie stören */ }
  }

  var q = new URLSearchParams(location.search);
  var ref = "";
  try {
    if (document.referrer) {
      var u = new URL(document.referrer);
      if (u.hostname !== location.hostname) ref = u.hostname.replace(/^www\./, "");
    }
  } catch (e) { /* ungültiger Referrer */ }
  var w = window.innerWidth || 0;

  send({
    t: "pv",
    r: ref,
    us: q.get("utm_source") || "",
    um: q.get("utm_medium") || "",
    uc: q.get("utm_campaign") || "",
    d: w < 700 ? "mobile" : w < 1100 ? "tablet" : "desktop"
  });

  function classify(href) {
    if (!href) return null;
    if (href.indexOf("wa.me/") !== -1 || href.indexOf("whatsapp") !== -1) return ["whatsapp", "whatsapp"];
    if (href.indexOf("tel:") === 0) return ["telefon", "telefon"];
    if (href.indexOf("mailto:") === 0) return ["email", href.indexOf("paul.georg@") !== -1 ? "paul.georg" : "clinicselnau"];
    if (/medix-anmeldung\.html/.test(href)) return ["zuweiser", "medix-anmeldung"];
    if (/medix\.html/.test(href)) return ["zuweiser", "medix"];
    if (href.indexOf("share.google") !== -1 || href.indexOf("maps.google") !== -1 || href.indexOf("g.page") !== -1) return ["google_profil", "google-profil"];
    if (href.indexOf("onedoc.ch") !== -1) return ["buchung", "onedoc"];
    return null;
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var hit = classify(a.getAttribute("href"));
    if (hit) send({ t: "ev", e: hit[0], k: hit[1] });
  }, true);

  // Absenden der MediX-Anmeldung (öffnet E-Mail-Programm) als Zuweiser-Ereignis
  document.addEventListener("submit", function (e) {
    if (/medix-anmeldung/.test(location.pathname)) send({ t: "ev", e: "zuweiser", k: "anmeldung-abgesendet" });
  }, true);
})();
