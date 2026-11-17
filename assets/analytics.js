/* Dermetrics — Google Analytics 4, nur nach Einwilligung (Kategorie «Statistik»).
   - Ohne Einwilligung wird kein Google-Skript geladen und kein Cookie gesetzt.
   - Messung: Seitenaufrufe + Klicks auf WhatsApp, Telefon, E-Mail, Zuweiser-
     seiten (MediX), Google-Profil, OneDoc-Buchung.
   - Keine Google Signals, keine Werbe-Personalisierung, keine Formularinhalte.
   GA4-Mess-ID unten eintragen (Format G-XXXXXXXXXX). Leer = Messung aus. */
(function () {
  "use strict";

  var GA_ID = ""; // TODO: GA4-Mess-ID eintragen, z. B. "G-ABC123XYZ9"
  var STORAGE_KEY = "dermetrics-cookie-consent";
  var loaded = false;

  function hasConsent() {
    try {
      var c = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
      return !!(c && c.statistics);
    } catch (e) { return false; }
  }

  function load() {
    if (loaded || !GA_ID) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }

  function removeGaCookies() {
    var host = location.hostname.replace(/^www\./, "");
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name.indexOf("_ga") === 0) {
        ["", "; domain=" + host, "; domain=." + host].forEach(function (d) {
          document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
        });
      }
    });
  }

  function classify(href) {
    if (!href) return null;
    if (href.indexOf("wa.me/") !== -1 || href.indexOf("whatsapp") !== -1) return ["whatsapp_click", "whatsapp"];
    if (href.indexOf("tel:") === 0) return ["phone_click", "telefon"];
    if (href.indexOf("mailto:") === 0) return ["email_click", href.indexOf("paul.georg@") !== -1 ? "paul.georg" : "clinicselnau"];
    if (/medix(-anmeldung)?\.html/.test(href)) return ["zuweiser_click", /anmeldung/.test(href) ? "medix-anmeldung" : "medix"];
    if (href.indexOf("share.google") !== -1 || href.indexOf("maps.google") !== -1 || href.indexOf("g.page") !== -1) return ["google_profile_click", "google-profil"];
    if (href.indexOf("onedoc.ch") !== -1) return ["booking_click", "onedoc"];
    return null;
  }

  document.addEventListener("click", function (e) {
    if (!loaded || !window.gtag) return;
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var hit = classify(a.getAttribute("href"));
    if (!hit) return;
    window.gtag("event", hit[0], {
      link_target: hit[1],
      page_path: location.pathname,
      transport_type: "beacon"
    });
  }, true);

  // Reaktion auf Änderungen im Cookie-Dialog (Ereignis aus cookiebanner.js)
  document.addEventListener("dermetrics:consent", function (e) {
    var on = !!(e.detail && e.detail.statistics);
    if (on) { load(); }
    else if (loaded) {
      if (window.gtag) window.gtag("consent", "update", { analytics_storage: "denied" });
      removeGaCookies();
    } else { removeGaCookies(); }
  });

  if (hasConsent()) load();
})();
