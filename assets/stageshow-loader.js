// Dermetrics — lädt die App-Illustration (assets/stageshow/) erst, wenn ihr
// Bereich in die Nähe des Bildschirms kommt. So belastet das React-Bundle den
// ersten Seitenaufbau nicht. Ohne IntersectionObserver wird sofort geladen.
(function () {
  "use strict";
  var mount = document.querySelector("[data-stageshow]");
  var me = document.currentScript;
  if (!mount || !me) return;
  var base = new URL("stageshow/", me.src).href;
  var loaded = false;

  function load() {
    if (loaded) return;
    loaded = true;
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = base + "stageshow.css";
    document.head.appendChild(css);
    var js = document.createElement("script");
    js.type = "module";
    js.src = base + "stageshow.js";
    document.body.appendChild(js);
  }

  if (!("IntersectionObserver" in window)) return load();
  var io = new IntersectionObserver(function (entries) {
    if (entries.some(function (e) { return e.isIntersecting; })) {
      io.disconnect();
      load();
    }
  }, { rootMargin: "800px 0px" });
  io.observe(mount);
})();
