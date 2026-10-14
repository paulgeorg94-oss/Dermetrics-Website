/* Dermetrics — Ankündigungs-Pop-up "Praxiseröffnung Dezember 2026".
   Erscheint bei jedem Aufruf der Landing Page neu (keine dauerhafte
   Ausblendung über localStorage) und liegt über dem Cookie-Consent-Dialog
   (höherer z-index), damit beide Overlays nicht gleichzeitig sichtbar sind.
   Zweisprachig (DE/EN) über document.documentElement.lang. */
(function () {
  "use strict";

  var isEn = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
  var depth = location.pathname.split("/").filter(Boolean).length - 1;
  var toRoot = depth > 0 ? new Array(depth + 1).join("../") : "";

  var WHATSAPP_HREF = "https://wa.me/41782618288";
  var EMAIL = "info@clinicselnau.ch";
  var EMAIL_SUBJECT = isEn
    ? "Appointment request – Clinic Selnau opening December 2026"
    : "Terminanfrage – Praxiseröffnung Dezember 2026";
  var MAILTO_HREF = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(EMAIL_SUBJECT);

  var t = isEn
    ? {
        eyebrow: "Clinic Selnau",
        title: "Practice opening December 2026",
        subtitle: "Book your appointment now!",
        whatsapp: "Message us on WhatsApp",
        email: "Arrange an appointment by email",
        closeLabel: "Close",
        portraitAlt: "Dr. med. Paul Georg",
        logoAlt: "Clinic Selnau"
      }
    : {
        eyebrow: "Clinic Selnau",
        title: "Praxiseröffnung Dezember 2026",
        subtitle: "Jetzt Termin abmachen!",
        whatsapp: "Per WhatsApp schreiben",
        email: "Termin per E-Mail vereinbaren",
        closeLabel: "Schliessen",
        portraitAlt: "Dr. med. Paul Georg",
        logoAlt: "Clinic Selnau"
      };

  // ---------- Styles ----------
  var style = document.createElement("style");
  style.textContent =
    ".dm-promo-overlay{position:fixed;inset:0;z-index:60;background:rgba(36,28,46,0.82);display:flex;align-items:flex-end;justify-content:center;padding:0;font-family:'Inter',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;}" +
    "@media (min-width:640px){.dm-promo-overlay{align-items:center;padding:24px;}}" +
    ".dm-promo-modal{background:#fff;width:100%;max-width:440px;max-height:92vh;overflow-y:auto;border-radius:20px 20px 0 0;position:relative;box-shadow:0 -8px 40px rgba(36,28,46,0.18);}" +
    "@media (min-width:640px){.dm-promo-modal{border-radius:20px;box-shadow:0 20px 60px rgba(36,28,46,0.25);}}" +
    ".dm-promo-close{position:absolute;top:14px;right:14px;z-index:1;background:rgba(255,255,255,0.9);border:0;cursor:pointer;color:#756B82;font-size:18px;line-height:1;padding:6px;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;}" +
    ".dm-promo-close:hover{color:#241C2E;}" +
    ".dm-promo-media{position:relative;width:100%;aspect-ratio:16/10;background:linear-gradient(135deg,rgba(196,178,235,0.55),rgba(245,190,150,0.35)),#FBF6F1;border-radius:20px 20px 0 0;overflow:hidden;}" +
    "@media (min-width:640px){.dm-promo-media{border-radius:20px 20px 0 0;}}" +
    ".dm-promo-media img.dm-promo-portrait{position:absolute;bottom:0;right:6%;height:112%;width:auto;max-width:72%;object-fit:contain;object-position:bottom;}" +
    ".dm-promo-logo{position:absolute;top:18px;left:20px;height:22px;width:auto;}" +
    ".dm-promo-body{padding:22px 24px 26px;}" +
    ".dm-promo-eyebrow{font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#4B2C86;font-weight:500;margin:0 0 8px;}" +
    ".dm-promo-title{font-size:22px;font-weight:300;color:#241C2E;line-height:1.25;margin:0 0 6px;}" +
    ".dm-promo-subtitle{font-size:15px;color:#756B82;margin:0 0 20px;}" +
    ".dm-promo-actions{display:flex;flex-direction:column;gap:10px;}" +
    ".dm-promo-actions a{font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;border-radius:999px;padding:13px 20px;width:100%;text-align:center;text-decoration:none;box-sizing:border-box;display:block;}" +
    ".dm-promo-btn-primary{background:#300C61;border:1px solid #300C61;color:#fff;}" +
    ".dm-promo-btn-primary:hover{opacity:0.88;}" +
    ".dm-promo-btn-secondary{background:transparent;border:1px solid #300C61;color:#300C61;}" +
    ".dm-promo-btn-secondary:hover{background:#F5F1FA;}";
  document.head.appendChild(style);

  // ---------- Markup ----------
  function buildModal() {
    var overlay = document.createElement("div");
    overlay.className = "dm-promo-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", t.title);

    var modal = document.createElement("div");
    modal.className = "dm-promo-modal";

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "dm-promo-close";
    closeBtn.setAttribute("aria-label", t.closeLabel);
    closeBtn.textContent = "✕";
    modal.appendChild(closeBtn);

    var media = document.createElement("div");
    media.className = "dm-promo-media";

    var logo = document.createElement("img");
    logo.className = "dm-promo-logo";
    logo.src = toRoot + "assets/clinic-selnau-logo.webp";
    logo.alt = t.logoAlt;
    media.appendChild(logo);

    var portrait = document.createElement("img");
    portrait.className = "dm-promo-portrait";
    portrait.src = toRoot + "assets/dr-georg-portrait.png";
    portrait.alt = t.portraitAlt;
    media.appendChild(portrait);

    modal.appendChild(media);

    var body = document.createElement("div");
    body.className = "dm-promo-body";

    var eyebrow = document.createElement("p");
    eyebrow.className = "dm-promo-eyebrow";
    eyebrow.textContent = t.eyebrow;
    body.appendChild(eyebrow);

    var title = document.createElement("h2");
    title.className = "dm-promo-title";
    title.textContent = t.title;
    body.appendChild(title);

    var subtitle = document.createElement("p");
    subtitle.className = "dm-promo-subtitle";
    subtitle.textContent = t.subtitle;
    body.appendChild(subtitle);

    var actions = document.createElement("div");
    actions.className = "dm-promo-actions";

    var btnWhatsapp = document.createElement("a");
    btnWhatsapp.className = "dm-promo-btn-primary";
    btnWhatsapp.href = WHATSAPP_HREF;
    btnWhatsapp.target = "_blank";
    btnWhatsapp.rel = "noopener";
    btnWhatsapp.textContent = t.whatsapp;

    var btnEmail = document.createElement("a");
    btnEmail.className = "dm-promo-btn-secondary";
    btnEmail.href = MAILTO_HREF;
    btnEmail.textContent = t.email;

    actions.appendChild(btnWhatsapp);
    actions.appendChild(btnEmail);
    body.appendChild(actions);

    modal.appendChild(body);
    overlay.appendChild(modal);

    function close() {
      overlay.remove();
    }

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    return overlay;
  }

  document.body.appendChild(buildModal());
})();
