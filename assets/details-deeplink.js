// Öffnet ein eingeklapptes <details>, wenn die Adresse darauf zeigt (z. B. /#weg), auch beim Klick auf einen Link auf derselben Seite.
(function () {
  "use strict";
  function open() {
    var id = decodeURIComponent((location.hash || "").slice(1));
    if (!id) return;
    var t = document.getElementById(id);
    var d = t && (t.tagName === "DETAILS" ? t : t.closest && t.closest("details"));
    if (d && !d.open) { d.open = true; t.scrollIntoView(); }
  }
  window.addEventListener("hashchange", open);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", open); else open();
})();
