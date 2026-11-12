// Dermetrics — einheitlicher Termin-CTA «Termin buchen» / «Book appointment».
// Jeder Link mit data-cta="termin" öffnet dieses Fenster mit drei Wegen: Telefon, WhatsApp,
// Anfrageformular. Ohne JavaScript führt derselbe Link auf das Termin-Panel #termin der Startseite.
// Der Datenblock zwischen DATA-START und DATA-END wird von tools/build-cta.py aus data/praxis.json erzeugt.
(function () {
  "use strict";
  /* DATA-START */
  var D = {"de": {"label": "Termin buchen", "title": "Termin buchen", "intro": "Wählen Sie, wie Sie uns erreichen möchten.", "place": "Clinic Selnau, Brandschenkestrasse 45, 8002 Zürich", "hours": "Sprechstunde: Montag 10:00–18:00 Uhr", "phone_label": "Telefon", "wa_label": "WhatsApp", "form_label": "Anfrageformular", "form_text": "Anfrage senden", "form_href": "/#contact-form", "close": "Schliessen", "fallback": "/#termin"}, "en": {"label": "Book appointment", "title": "Book appointment", "intro": "Choose how you would like to reach us.", "place": "Clinic Selnau, Brandschenkestrasse 45, 8002 Zürich", "hours": "Consultations: Monday 10:00–18:00", "phone_label": "Phone", "wa_label": "WhatsApp", "form_label": "Enquiry form", "form_text": "Send enquiry", "form_href": "/en/index.html#contact-form", "close": "Close", "fallback": "/en/index.html#termin"}, "phone": "+41 43 234 55 55", "phone_href": "tel:+41432345555", "wa": "+41 43 234 55 55", "wa_href": "https://wa.me/41432345555"};
  /* DATA-END */

  var en = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
  var T = en ? D.en : D.de;

  // ---------- Styles (eigene, damit auch Seiten ohne css/style.css gleich aussehen) ----------
  var css =
    ".dm-termin{border:0;padding:0;border-radius:20px;max-width:440px;width:calc(100% - 32px);box-shadow:0 20px 60px rgba(36,28,46,.25);color:#241C2E;font-family:'Inter',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;}" +
    ".dm-termin::backdrop{background:rgba(36,28,46,.55);}" +
    ".dm-termin-in{padding:28px 26px 24px;position:relative;}" +
    ".dm-termin h2{font-size:22px;font-weight:400;margin:0 0 6px;line-height:1.3;}" +
    ".dm-termin p{font-size:14px;line-height:1.55;color:#756B82;margin:0 0 4px;}" +
    ".dm-termin-ways{display:grid;gap:10px;margin:18px 0 0;}" +
    ".dm-termin-way{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:52px;padding:12px 16px;border:1px solid #E4DEE8;border-radius:14px;text-decoration:none;color:#241C2E;background:#fff;}" +
    ".dm-termin-way:hover,.dm-termin-way:focus-visible{border-color:#4B2C86;outline:none;}" +
    ".dm-termin-way span{font-size:13px;color:#756B82;}" +
    ".dm-termin-way strong{font-size:14.5px;font-weight:500;color:#300C61;}" +
    ".dm-termin-close{position:absolute;top:12px;right:12px;width:40px;height:40px;border:0;border-radius:999px;background:none;cursor:pointer;font-size:22px;line-height:1;color:#756B82;}" +
    ".dm-termin-close:focus-visible{outline:2px solid #4B2C86;}" +
    ".wa-btn.cta-termin{border-color:#300C61;background:#300C61;color:#fff;}" +
    ".wa-btn.cta-termin:hover{background:#4B2C86;border-color:#4B2C86;}" +
    ".cta-sticky{position:fixed;right:16px;bottom:16px;z-index:40;display:none;align-items:center;min-height:48px;padding:0 22px;border-radius:999px;background:#300C61;color:#fff;font:500 14.5px/1 'Inter',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;text-decoration:none;box-shadow:0 8px 24px rgba(36,28,46,.22);}" +
    ".cta-sticky:focus-visible{outline:2px solid #4B2C86;outline-offset:3px;}" +
    "@media (max-width:860px){.cta-sticky{display:inline-flex;}}" +
    "html.dm-no-topnav .cta-sticky{display:inline-flex;}" +
    "@media print{.cta-sticky,.dm-termin{display:none!important;}}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    if (text) e.textContent = text;
    return e;
  }
  function way(href, label, value, ext) {
    var a = el("a", { "class": "dm-termin-way", href: href });
    if (ext) { a.target = "_blank"; a.rel = "noopener"; }
    a.appendChild(el("span", {}, label));
    a.appendChild(el("strong", {}, value));
    return a;
  }

  // ---------- Fenster ----------
  var dlg = el("dialog", { "class": "dm-termin", id: "termin-dialog", "aria-labelledby": "dm-termin-h" });
  if (typeof dlg.showModal !== "function") return; // alter Browser: Links führen auf #termin
  var inner = el("div", { "class": "dm-termin-in" });
  var close = el("button", { type: "button", "class": "dm-termin-close", "aria-label": T.close }, "×");
  inner.appendChild(close);
  inner.appendChild(el("h2", { id: "dm-termin-h" }, T.title));
  inner.appendChild(el("p", {}, T.intro));
  inner.appendChild(el("p", {}, T.place + " · " + T.hours));
  var ways = el("div", { "class": "dm-termin-ways" });
  ways.appendChild(way(D.phone_href, T.phone_label, D.phone));
  ways.appendChild(way(D.wa_href, T.wa_label, D.wa, true));
  var form = way(T.form_href, T.form_label, T.form_text);
  ways.appendChild(form);
  inner.appendChild(ways);
  dlg.appendChild(inner);
  document.body.appendChild(dlg);

  close.addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  form.addEventListener("click", function () { dlg.close(); });

  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest('[data-cta="termin"]') : null;
    if (!a) return;
    e.preventDefault();
    dlg.showModal();
  });

  // ---------- Sticky-Button: Mobile immer, Desktop nur auf Seiten ohne Kopfnavigation ----------
  if (!document.querySelector(".topnav")) document.documentElement.classList.add("dm-no-topnav");
  var sticky = el("a", { "class": "cta-termin cta-sticky", href: T.fallback, "data-cta": "termin" }, T.label);
  document.body.appendChild(sticky);
})();
