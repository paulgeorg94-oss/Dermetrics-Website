// Dermetrics — Popup Praxiseröffnung mit Countdown (ersetzt das frühere
// assets/promo-banner.js). Erscheint bei jedem Seitenaufruf 1.5 Sekunden
// nach dem Laden, auf allen Seiten ausser der Einladungsseite selbst
// (eroeffnung.html / en/eroeffnung.html, dort via fehlenden Script-Tag
// ausgeschlossen; die Pfadprüfung unten ist eine zusätzliche Absicherung).
// Zweisprachig (DE/EN) über document.documentElement.lang.
(function () {
  "use strict";

  var TARGET = "2026-12-14T18:00:00+01:00"; // Beginn Eröffnungsapéro
  var UNTIL = "2026-12-14T20:30:00+01:00"; // Ende Eröffnungsapéro
  var SHOW_DELAY_MS = 1500; // Verzögerung bis zum Erscheinen
  var AUTO_CLOSE_MS = 20000; // automatisches Schliessen nach 20 Sekunden

  var isEn = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
  var depth = location.pathname.split("/").filter(Boolean).length - 1;
  var toRoot = depth > 0 ? new Array(depth + 1).join("../") : "";
  var eroeffnungHref = isEn ? toRoot + "en/eroeffnung.html" : toRoot + "eroeffnung.html";
  var logoHref = toRoot + "assets/logo-placeholder.png";

  // Nicht anzeigen, wenn wir bereits auf der Einladungsseite selbst sind.
  if (/eroeffnung\.html$/.test(location.pathname)) return;
  if (Date.now() > Date.parse(UNTIL)) return;

  var t = isEn
    ? {
        kicker: "Dermetrics · Clinic Selnau",
        title1: "Practice opening reception on",
        title2: "14 December 2026",
        subtitle: "Dr. med. Paul Georg, board-certified specialist in Dermatology and Venereology",
        days: "Days", hours: "Hrs", minutes: "Min", seconds: "Sec",
        open: "The practice is open.",
        event: "Opening reception: Monday, 14 December 2026, 6:00–8:30 pm",
        cta: "Register for the opening",
        note: "Appointments can be booked from 7 December 2026",
        close: "Close",
        logoAlt: "Dermetrics"
      }
    : {
        kicker: "Dermetrics · Clinic Selnau",
        title1: "Praxis-Eröffnungsapéro am",
        title2: "14.12.2026",
        subtitle: "Dr. med. Paul Georg, Facharzt für Dermatologie und Venerologie",
        days: "Tage", hours: "Std.", minutes: "Min.", seconds: "Sek.",
        open: "Die Praxis ist eröffnet.",
        event: "Eröffnungsapéro: Montag, 14. Dezember 2026, 18:00–20:30 Uhr",
        cta: "Anmeldung zur Eröffnung",
        note: "Terminvereinbarung ab 07.12.2026 möglich",
        close: "Schliessen",
        logoAlt: "Dermetrics"
      };

  // ---------- Styles ----------
  var style = document.createElement("style");
  style.textContent =
    "@font-face{font-family:'Jost';font-style:normal;font-weight:300;font-display:swap;src:url('" + toRoot + "assets/vendor/fonts/Jost-Light.woff2') format('woff2');}" +
    "@font-face{font-family:'Jost';font-style:normal;font-weight:400;font-display:swap;src:url('" + toRoot + "assets/vendor/fonts/Jost-Regular.woff2') format('woff2');}" +
    "@font-face{font-family:'Jost';font-style:normal;font-weight:500;font-display:swap;src:url('" + toRoot + "assets/vendor/fonts/Jost-Medium.woff2') format('woff2');}" +
    ".dmp{--f:Jost,'Futura','Century Gothic','Helvetica Neue',Arial,sans-serif;--bg:#F8F6F2;--ink:#2A2238;--deep:#300C61;--mid:#4B2C86;--soft:#5E5470;--muted:#8A809A;--line:#E3DDE8;" +
    "position:fixed;inset:0;z-index:65;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(36,28,46,.55);font-family:var(--f);}" +
    ".dmp.dmp-visible{display:flex;}" +
    ".dmp *{box-sizing:border-box;}" +
    ".dmp [hidden]{display:none!important;}" +
    ".dmp-box{position:relative;width:100%;max-width:440px;background:var(--bg);color:var(--ink);border-radius:6px;padding:40px 32px 30px;text-align:center;box-shadow:0 24px 60px rgba(36,28,46,.25);animation:dmpIn .35s ease-out;}" +
    "@keyframes dmpIn{from{transform:translateY(12px);opacity:.4;}to{transform:none;opacity:1;}}" +
    "@media (prefers-reduced-motion:reduce){.dmp-box{animation:none;}}" +
    ".dmp-x{position:absolute;top:10px;right:10px;width:36px;height:36px;border:0;background:none;color:var(--muted);font-size:22px;line-height:1;cursor:pointer;border-radius:50%;}" +
    ".dmp-x:hover{color:var(--deep);}" +
    ".dmp-x:focus-visible,.dmp-cta:focus-visible{outline:2px solid var(--mid);outline-offset:2px;}" +
    ".dmp-box img{width:34px;height:auto;}" +
    ".dmp-k{margin:14px 0 0;font-size:.68rem;letter-spacing:.26em;text-transform:uppercase;color:var(--mid);font-weight:500;}" +
    ".dmp-h{margin:8px 0 0;font-weight:300;font-size:1.65rem;line-height:1.2;color:var(--deep);}" +
    ".dmp-p{margin:8px 0 0;color:var(--soft);font-weight:300;font-size:.95rem;}" +
    ".dmp-cd{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:22px 0 0;padding:16px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);}" +
    ".dmp-cd b{display:block;font-weight:300;font-size:1.9rem;line-height:1;color:var(--deep);font-variant-numeric:tabular-nums;}" +
    ".dmp-cd small{display:block;margin-top:6px;font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);}" +
    ".dmp-open{margin:22px 0 0;padding:14px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);color:var(--deep);font-size:1.05rem;}" +
    ".dmp-ev{margin:16px 0 0;font-size:.85rem;color:var(--soft);}" +
    ".dmp-cta{display:inline-block;margin-top:18px;background:var(--deep);color:#fff;text-decoration:none;font-weight:500;letter-spacing:.14em;text-transform:uppercase;font-size:.76rem;padding:14px 22px;border-radius:4px;}" +
    ".dmp-cta:hover{background:var(--mid);color:#fff;}" +
    ".dmp-note{margin:16px 0 0;font-size:.75rem;color:var(--muted);}" +
    "@media (max-width:420px){.dmp-box{padding:34px 20px 24px;}.dmp-cd b{font-size:1.5rem;}}";
  document.head.appendChild(style);

  // ---------- Markup ----------
  var overlay = document.createElement("div");
  overlay.className = "dmp";
  overlay.id = "dmp";

  var box = document.createElement("div");
  box.className = "dmp-box";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-labelledby", "dmp-h");

  var closeBtn = document.createElement("button");
  closeBtn.className = "dmp-x";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", t.close);
  closeBtn.textContent = "✕";
  box.appendChild(closeBtn);

  var logo = document.createElement("img");
  logo.src = logoHref;
  logo.alt = t.logoAlt;
  logo.width = 34;
  logo.height = 26;
  box.appendChild(logo);

  var kicker = document.createElement("p");
  kicker.className = "dmp-k";
  kicker.textContent = t.kicker;
  box.appendChild(kicker);

  var heading = document.createElement("h2");
  heading.className = "dmp-h";
  heading.id = "dmp-h";
  heading.appendChild(document.createTextNode(t.title1));
  heading.appendChild(document.createElement("br"));
  heading.appendChild(document.createTextNode(t.title2));
  box.appendChild(heading);

  var subtitle = document.createElement("p");
  subtitle.className = "dmp-p";
  subtitle.textContent = t.subtitle;
  box.appendChild(subtitle);

  var cd = document.createElement("div");
  cd.className = "dmp-cd";
  cd.setAttribute("aria-live", "off");
  var cells = {};
  [["d", t.days], ["h", t.hours], ["m", t.minutes], ["s", t.seconds]].forEach(function (pair) {
    var cell = document.createElement("div");
    var b = document.createElement("b");
    b.textContent = "–";
    var small = document.createElement("small");
    small.textContent = pair[1];
    cell.appendChild(b);
    cell.appendChild(small);
    cd.appendChild(cell);
    cells[pair[0]] = b;
  });
  box.appendChild(cd);

  var openMsg = document.createElement("p");
  openMsg.className = "dmp-open";
  openMsg.textContent = t.open;
  openMsg.hidden = true;
  box.appendChild(openMsg);

  var eventP = document.createElement("p");
  eventP.className = "dmp-ev";
  eventP.textContent = t.event;
  box.appendChild(eventP);

  var cta = document.createElement("a");
  cta.className = "dmp-cta";
  cta.href = eroeffnungHref;
  cta.textContent = t.cta;
  box.appendChild(cta);

  var note = document.createElement("p");
  note.className = "dmp-note";
  note.textContent = t.note;
  box.appendChild(note);

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // ---------- Behaviour ----------
  var target = Date.parse(TARGET);
  var countdownTimer = null;
  var autoCloseTimer = null;
  var lastFocused = null;

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function tick() {
    var ms = target - Date.now();
    if (ms <= 0) {
      cd.hidden = true;
      openMsg.hidden = false;
      clearInterval(countdownTimer);
      return;
    }
    var s = Math.floor(ms / 1000);
    cells.d.textContent = Math.floor(s / 86400);
    cells.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cells.m.textContent = pad(Math.floor((s % 3600) / 60));
    cells.s.textContent = pad(s % 60);
  }

  function close() {
    overlay.classList.remove("dmp-visible");
    clearInterval(countdownTimer);
    clearTimeout(autoCloseTimer);
    document.removeEventListener("keydown", onKey);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function onKey(e) {
    if (e.key === "Escape") close();
  }

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();
  });

  setTimeout(function () {
    lastFocused = document.activeElement;
    tick();
    countdownTimer = setInterval(tick, 1000);
    overlay.classList.add("dmp-visible");
    document.addEventListener("keydown", onKey);
    closeBtn.focus();
    autoCloseTimer = setTimeout(close, AUTO_CLOSE_MS);
  }, SHOW_DELAY_MS);
})();
