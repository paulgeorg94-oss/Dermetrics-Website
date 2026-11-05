// Öffnet ein eingeklapptes <details>, wenn die Adresse darauf zeigt (z. B. /#weg, /#qualifikation), auch beim Klick auf einen Link auf derselben Seite. Beim Drucken sind alle <details> offen.
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
  // Druckansicht: alle Akkordeons aufklappen, danach den vorherigen Zustand wiederherstellen.
  var closed = [];
  window.addEventListener("beforeprint", function () {
    closed = [].filter.call(document.querySelectorAll("details:not([open])"), function (d) { d.open = true; return true; });
  });
  window.addEventListener("afterprint", function () { closed.forEach(function (d) { d.open = false; }); closed = []; });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", open); else open();
})();
