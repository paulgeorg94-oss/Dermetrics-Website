/* Dermetrics ServiceCarousel — ohne Framework.
   Autoplay stoppt bei Hover, bei Tastaturfokus, per Pause-Knopf und komplett
   unter prefers-reduced-motion. Der Pause-Knopf ist nicht optional: WCAG 2.2.2
   verlangt bei Bewegung über 5 Sekunden eine echte Stopp-Möglichkeit. */
(function () {
  "use strict";

  function init(root) {
    var track = root.querySelector(".dm-carousel__track");
    var slides = Array.prototype.slice.call(track.children);
    var dots = Array.prototype.slice.call(root.querySelectorAll(".dm-carousel__dot"));
    var toggle = root.querySelector("[data-dm-toggle]");
    var pauseIcon = root.querySelector("[data-dm-pause-icon]");
    var playIcon = root.querySelector("[data-dm-play-icon]");
    var interval = parseInt(root.getAttribute("data-interval"), 10) || 5000;
    if (slides.length < 2) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var index = 0;
    var playing = !reduced;
    var held = false;
    var timer = null;
    var scrollTimer = null;

    function paint(i) {
      index = i;
      slides.forEach(function (slide, n) {
        var tile = slide.querySelector(".dm-tile");
        if (tile) tile.classList.toggle("dm-tile--active", n === i);
      });
      dots.forEach(function (dot, n) {
        dot.classList.toggle("dm-carousel__dot--current", n === i);
        if (n === i) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    function go(i) {
      i = (i + slides.length) % slides.length;
      paint(i);
      track.scrollTo({
        left: slides[i].offsetLeft - track.offsetLeft,
        behavior: reduced ? "auto" : "smooth"
      });
      schedule();
    }

    function schedule() {
      clearTimeout(timer);
      if (!playing || held || reduced) return;
      timer = setTimeout(function () { go(index + 1); }, interval);
    }

    /* `el.hidden` ist nur auf HTML-Elementen definiert — bei inline-SVG passiert nichts.
       Darum das Attribut direkt setzen. */
    function show(el, on) {
      if (!el) return;
      if (on) el.removeAttribute("hidden");
      else el.setAttribute("hidden", "");
    }

    function setPlaying(next) {
      playing = next;
      show(pauseIcon, next);
      show(playIcon, !next);
      toggle.setAttribute(
        "aria-label",
        next ? "Automatisches Weiterblättern pausieren" : "Automatisches Weiterblättern starten"
      );
      schedule();
    }

    dots.forEach(function (dot, n) {
      dot.addEventListener("click", function () { go(n); });
    });
    root.querySelector("[data-dm-prev]").addEventListener("click", function () { go(index - 1); });
    root.querySelector("[data-dm-next]").addEventListener("click", function () { go(index + 1); });
    if (toggle) toggle.addEventListener("click", function () { setPlaying(!playing); });

    root.addEventListener("mouseenter", function () { held = true; schedule(); });
    root.addEventListener("mouseleave", function () { held = false; schedule(); });
    root.addEventListener("focusin", function () { held = true; schedule(); });
    root.addEventListener("focusout", function () {
      if (!root.contains(document.activeElement)) { held = false; schedule(); }
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
    });

    /* Beim Wischen oder Scrollen die aktive Kachel nachziehen. */
    track.addEventListener("scroll", function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var left = track.scrollLeft + track.offsetLeft;
        var nearest = 0;
        var best = Infinity;
        slides.forEach(function (slide, n) {
          var d = Math.abs(slide.offsetLeft - left);
          if (d < best) { best = d; nearest = n; }
        });
        if (nearest !== index) paint(nearest);
      }, 120);
    }, { passive: true });

    if (reduced && toggle) toggle.setAttribute("hidden", "");
    paint(0);
    schedule();
  }

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-dm-carousel]"), init);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
