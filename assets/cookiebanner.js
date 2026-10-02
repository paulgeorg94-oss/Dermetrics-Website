/* Dermetrics — Mehrstufiger Cookie-Consent-Dialog.
   Diese Website setzt aktuell keine Cookies ein (keine Funktions-, Statistik-
   oder Marketing-Cookies). Der Dialog ist dennoch als echtes Kategorien-
   Consent-Modal gebaut (Toggles je Kategorie, ausklappbare Detailtexte,
   "Alle akzeptieren" / "Nur Auswahl akzeptieren" / "Alle ablehnen"), damit
   die Struktur sofort trägt, sobald künftig tatsächlich ein Dienst in einer
   Kategorie hinzukommt — die Auswahl der Nutzerin/des Nutzers wird dafür
   schon heute lokal gespeichert (kein Cookie, keine Server-Übertragung).
   Zweisprachig (DE/EN) über document.documentElement.lang. */
(function () {
  "use strict";

  var STORAGE_KEY = "dermetrics-cookie-consent";
  var isEn = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;

  // Pfad zur Wurzel der Website berechnen, unabhängig von der Verschachtelungstiefe
  // der aktuellen Seite — damit die Links zu Impressum/Datenschutz auf jeder
  // der 22 Seiten korrekt auflösen, ohne pro Seite einen Präfix zu pflegen.
  var depth = location.pathname.split("/").filter(Boolean).length - 1;
  var toRoot = depth > 0 ? new Array(depth + 1).join("../") : "";
  var legalHref = isEn ? toRoot + "en/legal.html" : toRoot + "impressum.html";
  var legalAnchor = isEn ? "#impressum" : "#impressum";
  var privacyAnchor = "#datenschutz";

  var CATEGORIES = [
    {
      key: "necessary",
      locked: true,
      label: isEn ? "Strictly necessary" : "Unbedingt erforderlich",
      detail: isEn
        ? "Technically required for the basic operation of the website. This website currently sets no cookies at all; this category is listed for transparency and cannot be switched off."
        : "Für den grundlegenden Betrieb der Website technisch notwendig. Diese Website setzt aktuell keinerlei Cookies; diese Kategorie wird aus Transparenzgründen aufgeführt und kann nicht deaktiviert werden."
    },
    {
      key: "functional",
      locked: false,
      label: isEn ? "Functional" : "Funktionell",
      detail: isEn
        ? "Would enable extended functionality and personalisation (e.g. remembered settings). Not currently in use."
        : "Würden erweiterte Funktionen und Personalisierung ermöglichen (z. B. gespeicherte Einstellungen). Aktuell nicht im Einsatz."
    },
    {
      key: "statistics",
      locked: false,
      label: isEn ? "Statistics" : "Statistik",
      detail: isEn
        ? "Would help understand how visitors use the website (audience measurement). Not currently in use."
        : "Würden helfen zu verstehen, wie Besucher:innen die Website nutzen (Reichweitenmessung). Aktuell nicht im Einsatz."
    },
    {
      key: "marketing",
      locked: false,
      label: isEn ? "Marketing" : "Marketing",
      detail: isEn
        ? "Would enable personalised advertising and cross-site tracking. Not currently in use."
        : "Würden personalisierte Werbung und websiteübergreifendes Tracking ermöglichen. Aktuell nicht im Einsatz."
    }
  ];

  var t = isEn
    ? {
        title: "Cookie settings",
        intro: "This website uses only strictly necessary cookies — in fact, it currently sets no cookies at all. No functional, statistics or marketing cookies are used. More in our ",
        introLinkImprint: "Imprint",
        introLinkAnd: " and ",
        introLinkPrivacy: "Privacy Policy",
        introEnd: ".",
        acceptAll: "Accept all",
        acceptSelected: "Accept selection only",
        rejectAll: "Reject all",
        reopen: "Cookie settings",
        closeLabel: "Close"
      }
    : {
        title: "Cookie-Einstellungen",
        intro: "Diese Website verwendet nur unbedingt notwendige Cookies — tatsächlich setzt sie aktuell gar keine Cookies ein. Es werden keine Funktions-, Statistik- oder Marketing-Cookies genutzt. Mehr dazu im ",
        introLinkImprint: "Impressum",
        introLinkAnd: " und in der ",
        introLinkPrivacy: "Datenschutzerklärung",
        introEnd: ".",
        acceptAll: "Alle akzeptieren",
        acceptSelected: "Nur Auswahl akzeptieren",
        rejectAll: "Alle ablehnen",
        reopen: "Cookie-Einstellungen",
        closeLabel: "Schliessen"
      };

  function readConsent() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(obj) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch (e) {
      /* localStorage nicht verfügbar (z. B. privater Modus) — Dialog erscheint dann bei jedem Besuch erneut. */
    }
  }

  function defaultState(allOn) {
    var state = {};
    CATEGORIES.forEach(function (c) {
      state[c.key] = c.locked ? true : !!allOn;
    });
    return state;
  }

  // ---------- Styles ----------
  var style = document.createElement("style");
  style.textContent =
    ".dm-cc-overlay{position:fixed;inset:0;z-index:50;background:rgba(36,28,46,0.55);display:flex;align-items:flex-end;justify-content:center;padding:0;font-family:'Inter',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;}" +
    "@media (min-width:640px){.dm-cc-overlay{align-items:center;padding:24px;}}" +
    ".dm-cc-modal{background:#fff;width:100%;max-width:480px;max-height:92vh;overflow-y:auto;border-radius:20px 20px 0 0;padding:26px 24px 24px;position:relative;box-shadow:0 -8px 40px rgba(36,28,46,0.18);}" +
    "@media (min-width:640px){.dm-cc-modal{border-radius:20px;box-shadow:0 20px 60px rgba(36,28,46,0.25);}}" +
    ".dm-cc-close{position:absolute;top:18px;right:18px;background:none;border:0;cursor:pointer;color:#756B82;font-size:20px;line-height:1;padding:4px;}" +
    ".dm-cc-close:hover{color:#241C2E;}" +
    ".dm-cc-title{font-size:21px;font-weight:300;color:#241C2E;margin:0 0 14px;padding-right:28px;}" +
    ".dm-cc-intro{font-size:13.5px;line-height:1.6;color:#756B82;margin:0 0 20px;}" +
    ".dm-cc-intro a{color:#4B2C86;}" +
    ".dm-cc-list{display:flex;flex-direction:column;gap:0;border-top:1px solid #E4DEE8;margin-bottom:20px;}" +
    ".dm-cc-row{border-bottom:1px solid #E4DEE8;}" +
    ".dm-cc-row-head{display:flex;align-items:center;gap:12px;padding:14px 0;cursor:pointer;}" +
    ".dm-cc-row-head[data-locked='1']{cursor:default;}" +
    ".dm-cc-switch{position:relative;flex:0 0 auto;width:42px;height:24px;border-radius:999px;background:#E4DEE8;border:0;padding:0;cursor:pointer;transition:background-color 0.15s ease;}" +
    ".dm-cc-switch[data-on='1']{background:#300C61;}" +
    ".dm-cc-switch[disabled]{cursor:not-allowed;opacity:0.65;}" +
    ".dm-cc-switch i{position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform 0.15s ease;display:block;box-shadow:0 1px 2px rgba(0,0,0,0.2);}" +
    ".dm-cc-switch[data-on='1'] i{transform:translateX(18px);}" +
    ".dm-cc-row-label{flex:1 1 auto;font-size:14.5px;color:#241C2E;font-weight:500;}" +
    ".dm-cc-chevron{flex:0 0 auto;width:18px;height:18px;color:#756B82;transition:transform 0.15s ease;}" +
    ".dm-cc-row[data-open='1'] .dm-cc-chevron{transform:rotate(90deg);}" +
    ".dm-cc-row-detail{max-height:0;overflow:hidden;transition:max-height 0.2s ease;}" +
    ".dm-cc-row[data-open='1'] .dm-cc-row-detail{max-height:140px;}" +
    ".dm-cc-row-detail p{font-size:12.5px;line-height:1.55;color:#756B82;margin:0 0 14px;}" +
    ".dm-cc-actions{display:flex;flex-direction:column;gap:10px;}" +
    ".dm-cc-actions button{font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;border-radius:999px;padding:13px 20px;width:100%;}" +
    ".dm-cc-btn-primary{background:#300C61;border:1px solid #300C61;color:#fff;}" +
    ".dm-cc-btn-primary:hover{opacity:0.88;}" +
    ".dm-cc-btn-secondary{background:transparent;border:1px solid #300C61;color:#300C61;}" +
    ".dm-cc-btn-secondary:hover{background:#F5F1FA;}" +
    ".dm-cc-btn-tertiary{background:transparent;border:1px solid transparent;color:#756B82;}" +
    ".dm-cc-btn-tertiary:hover{color:#241C2E;}" +
    ".dm-cc-reopen{position:fixed;left:18px;bottom:18px;z-index:40;background:#fff;border:1px solid #E4DEE8;color:#241C2E;font-family:inherit;font-size:12px;font-weight:500;padding:9px 14px;border-radius:999px;cursor:pointer;box-shadow:0 4px 16px rgba(36,28,46,0.12);display:inline-flex;align-items:center;gap:6px;}" +
    ".dm-cc-reopen:hover{border-color:#300C61;color:#300C61;}";
  document.head.appendChild(style);

  // ---------- Markup builders ----------
  function buildModal(initialState) {
    var overlay = document.createElement("div");
    overlay.className = "dm-cc-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", t.title);

    var modal = document.createElement("div");
    modal.className = "dm-cc-modal";

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "dm-cc-close";
    closeBtn.setAttribute("aria-label", t.closeLabel);
    closeBtn.textContent = "✕";
    modal.appendChild(closeBtn);

    var title = document.createElement("h2");
    title.className = "dm-cc-title";
    title.textContent = t.title;
    modal.appendChild(title);

    var intro = document.createElement("p");
    intro.className = "dm-cc-intro";
    intro.appendChild(document.createTextNode(t.intro));
    var aImprint = document.createElement("a");
    aImprint.href = legalHref + legalAnchor;
    aImprint.textContent = t.introLinkImprint;
    intro.appendChild(aImprint);
    intro.appendChild(document.createTextNode(t.introLinkAnd));
    var aPrivacy = document.createElement("a");
    aPrivacy.href = legalHref + privacyAnchor;
    aPrivacy.textContent = t.introLinkPrivacy;
    intro.appendChild(aPrivacy);
    intro.appendChild(document.createTextNode(t.introEnd));
    modal.appendChild(intro);

    var list = document.createElement("div");
    list.className = "dm-cc-list";

    var state = {};
    CATEGORIES.forEach(function (c) { state[c.key] = initialState[c.key]; });

    CATEGORIES.forEach(function (cat) {
      var row = document.createElement("div");
      row.className = "dm-cc-row";

      var head = document.createElement("div");
      head.className = "dm-cc-row-head";
      if (cat.locked) head.setAttribute("data-locked", "1");

      var switchBtn = document.createElement("button");
      switchBtn.type = "button";
      switchBtn.className = "dm-cc-switch";
      switchBtn.setAttribute("data-on", state[cat.key] ? "1" : "0");
      switchBtn.setAttribute("role", "switch");
      switchBtn.setAttribute("aria-checked", state[cat.key] ? "true" : "false");
      switchBtn.setAttribute("aria-label", cat.label);
      if (cat.locked) switchBtn.disabled = true;
      var knob = document.createElement("i");
      switchBtn.appendChild(knob);

      var label = document.createElement("span");
      label.className = "dm-cc-row-label";
      label.textContent = cat.label;

      var chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      chevron.setAttribute("class", "dm-cc-chevron");
      chevron.setAttribute("viewBox", "0 0 24 24");
      chevron.setAttribute("fill", "none");
      chevron.setAttribute("stroke", "currentColor");
      chevron.setAttribute("stroke-width", "1.8");
      chevron.setAttribute("stroke-linecap", "round");
      chevron.setAttribute("stroke-linejoin", "round");
      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M9 5l7 7-7 7");
      chevron.appendChild(path);

      head.appendChild(switchBtn);
      head.appendChild(label);
      head.appendChild(chevron);

      var detail = document.createElement("div");
      detail.className = "dm-cc-row-detail";
      var detailP = document.createElement("p");
      detailP.textContent = cat.detail;
      detail.appendChild(detailP);

      row.appendChild(head);
      row.appendChild(detail);
      list.appendChild(row);

      function toggleOpen() {
        var open = row.getAttribute("data-open") === "1";
        row.setAttribute("data-open", open ? "0" : "1");
      }

      head.addEventListener("click", function (e) {
        if (e.target === switchBtn || e.target === knob) return;
        toggleOpen();
      });

      if (!cat.locked) {
        switchBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          var next = switchBtn.getAttribute("data-on") !== "1";
          switchBtn.setAttribute("data-on", next ? "1" : "0");
          switchBtn.setAttribute("aria-checked", next ? "true" : "false");
          state[cat.key] = next;
        });
      }
    });

    modal.appendChild(list);

    var actions = document.createElement("div");
    actions.className = "dm-cc-actions";

    var btnAccept = document.createElement("button");
    btnAccept.type = "button";
    btnAccept.className = "dm-cc-btn-primary";
    btnAccept.textContent = t.acceptAll;

    var btnSelected = document.createElement("button");
    btnSelected.type = "button";
    btnSelected.className = "dm-cc-btn-secondary";
    btnSelected.textContent = t.acceptSelected;

    var btnReject = document.createElement("button");
    btnReject.type = "button";
    btnReject.className = "dm-cc-btn-tertiary";
    btnReject.textContent = t.rejectAll;

    actions.appendChild(btnAccept);
    actions.appendChild(btnSelected);
    actions.appendChild(btnReject);
    modal.appendChild(actions);

    overlay.appendChild(modal);

    function finish(resultState) {
      writeConsent(resultState);
      overlay.remove();
      showReopenTrigger();
    }

    btnAccept.addEventListener("click", function () { finish(defaultState(true)); });
    btnReject.addEventListener("click", function () { finish(defaultState(false)); });
    btnSelected.addEventListener("click", function () { finish(state); });
    closeBtn.addEventListener("click", function () { finish(defaultState(false)); });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) finish(defaultState(false));
    });

    return overlay;
  }

  function openModal() {
    var existing = document.querySelector(".dm-cc-overlay");
    if (existing) return;
    var stored = readConsent() || defaultState(false);
    document.body.appendChild(buildModal(stored));
  }

  function showReopenTrigger() {
    if (document.querySelector(".dm-cc-reopen")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dm-cc-reopen";
    btn.textContent = t.reopen;
    btn.addEventListener("click", openModal);
    document.body.appendChild(btn);
  }

  var consent = readConsent();
  if (!consent) {
    openModal();
  } else {
    showReopenTrigger();
  }
})();
