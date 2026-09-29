/* Dermetrics — Cookie-Hinweis-Banner.
   Diese Website setzt aktuell keine Cookies ein (keine Statistik-, kein
   Marketing-Tracking). Der Banner informiert transparent darüber und merkt
   sich die Bestätigung lokal (localStorage) — kein Cookie, keine
   Server-Übertragung. Zweisprachig (DE/EN) über document.documentElement.lang. */
(function () {
  "use strict";

  var STORAGE_KEY = "dermetrics-cookie-notice-seen";
  var isEn = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;

  var t = isEn
    ? {
        text: "This website uses no tracking or marketing cookies — only what is technically necessary to display the page.",
        details: "Details",
        accept: "Understood",
        tableCaption: "Cookie categories",
        th: ["Category", "Purpose", "Currently in use"],
        rows: [
          ["Strictly necessary", "Basic operation of the website", "No — this website uses no cookies"],
          ["Statistics", "Audience measurement, usage analysis", "No, not in use"],
          ["Marketing", "Personalised advertising, cross-site tracking", "No, not in use"]
        ]
      }
    : {
        text: "Diese Website verwendet keine Statistik- oder Marketing-Cookies — nur das technisch Nötige, um die Seite darzustellen.",
        details: "Details",
        accept: "Verstanden",
        tableCaption: "Cookie-Kategorien",
        th: ["Kategorie", "Zweck", "Aktuell im Einsatz"],
        rows: [
          ["Technisch notwendig", "Grundlegender Betrieb der Website", "Nein — diese Website setzt keine Cookies"],
          ["Statistik", "Reichweitenmessung, Analyse des Nutzungsverhaltens", "Nein, nicht im Einsatz"],
          ["Marketing", "Personalisierte Werbung, websiteübergreifendes Tracking", "Nein, nicht im Einsatz"]
        ]
      };

  function alreadySeen() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function markSeen() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {
      /* localStorage nicht verfügbar (z. B. privater Modus) — Banner zeigt sich dann bei jedem Besuch erneut. */
    }
  }

  if (alreadySeen()) return;

  var style = document.createElement("style");
  style.textContent =
    ".dm-cookiebar{position:fixed;left:0;right:0;bottom:0;z-index:40;background:#fff;border-top:1px solid #E4DEE8;" +
    "padding:16px 20px;box-shadow:0 -4px 20px rgba(36,28,46,0.08);font-family:'Inter',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;}" +
    ".dm-cookiebar__row{max-width:1040px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:14px;}" +
    ".dm-cookiebar__text{flex:1 1 320px;font-size:13px;line-height:1.5;color:#241C2E;margin:0;}" +
    ".dm-cookiebar__actions{display:flex;gap:10px;flex:0 0 auto;}" +
    ".dm-cookiebar button{font-family:inherit;font-size:12.5px;cursor:pointer;border-radius:999px;padding:9px 18px;}" +
    ".dm-cookiebar__details-btn{background:transparent;border:1px solid #E4DEE8;color:#241C2E;}" +
    ".dm-cookiebar__accept-btn{background:#300C61;border:1px solid #300C61;color:#fff;}" +
    ".dm-cookiebar__panel{display:none;max-width:1040px;margin:14px auto 0;border-top:1px solid #E4DEE8;padding-top:14px;}" +
    ".dm-cookiebar__panel.dm-open{display:block;}" +
    ".dm-cookiebar__panel table{width:100%;border-collapse:collapse;font-size:12px;}" +
    ".dm-cookiebar__panel th,.dm-cookiebar__panel td{text-align:left;padding:6px 10px 6px 0;border-bottom:1px solid #E4DEE8;color:#241C2E;}" +
    ".dm-cookiebar__panel th{color:#756B82;font-weight:500;}" +
    "@media (max-width:640px){.dm-cookiebar__row{flex-direction:column;align-items:stretch;}.dm-cookiebar__actions{justify-content:flex-end;}}";
  document.head.appendChild(style);

  var bar = document.createElement("div");
  bar.className = "dm-cookiebar";
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", isEn ? "Cookie notice" : "Cookie-Hinweis");

  var rowsHtml = t.rows.map(function (r) {
    return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>";
  }).join("");

  bar.innerHTML =
    '<div class="dm-cookiebar__row">' +
      '<p class="dm-cookiebar__text">' + t.text + "</p>" +
      '<div class="dm-cookiebar__actions">' +
        '<button type="button" class="dm-cookiebar__details-btn" id="dmCookieDetails">' + t.details + "</button>" +
        '<button type="button" class="dm-cookiebar__accept-btn" id="dmCookieAccept">' + t.accept + "</button>" +
      "</div>" +
    "</div>" +
    '<div class="dm-cookiebar__panel" id="dmCookiePanel">' +
      "<table>" +
        "<thead><tr><th>" + t.th[0] + "</th><th>" + t.th[1] + "</th><th>" + t.th[2] + "</th></tr></thead>" +
        "<tbody>" + rowsHtml + "</tbody>" +
      "</table>" +
    "</div>";

  document.body.appendChild(bar);

  document.getElementById("dmCookieDetails").addEventListener("click", function () {
    document.getElementById("dmCookiePanel").classList.toggle("dm-open");
  });
  document.getElementById("dmCookieAccept").addEventListener("click", function () {
    markSeen();
    bar.remove();
  });
})();
