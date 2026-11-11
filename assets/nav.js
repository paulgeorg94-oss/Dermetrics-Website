// Dermetrics — Top-Navigation: Mobile-Menü-Toggle + Scroll-Verhalten.
// Header ist fixiert; verschwindet beim Scrollen nach unten (mehr Lesefläche),
// erscheint sofort wieder beim Zurückscrollen nach oben, und ist an der
// Seiten-Oberkante immer sichtbar.
(function () {
  var topnav = document.getElementById('topnav');
  if (!topnav) return;

  var navtoggle = document.getElementById('navtoggle');
  if (navtoggle) {
    navtoggle.addEventListener('click', function () {
      topnav.classList.toggle('open');
    });
  }

  // Dropdowns: Pfeil-Schaltfläche klappt das Untermenü auf (Touch, Tastatur, Mobile-Menü);
  // auf dem Desktop öffnen die Menüs zusätzlich beim Darüberfahren (CSS :hover).
  var drops = topnav.querySelectorAll('.navdrop');
  function closeAll(except) {
    for (var i = 0; i < drops.length; i++) {
      if (drops[i] === except) continue;
      drops[i].classList.remove('open');
      var b = drops[i].querySelector('.navdrop-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    }
  }
  for (var i = 0; i < drops.length; i++) {
    (function (d) {
      var btn = d.querySelector('.navdrop-btn');
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = !d.classList.contains('open');
        closeAll(d);
        d.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      d.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('.navdrop-menu a')) {
          closeAll(); topnav.classList.remove('open');
          if (document.activeElement) document.activeElement.blur();
        }
      });
    })(drops[i]);
  }
  document.addEventListener('click', function (e) { if (!topnav.contains(e.target)) closeAll(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  var lastY = Math.max(0, window.scrollY);
  var ticking = false;
  var TOP_THRESHOLD = 12;
  var DELTA_THRESHOLD = 6; // ignoriert Mini-Bewegungen (iOS-Bounce/Jitter)

  function onScroll() {
    // iOS-Safari/Chrome kann während des elastischen "Bounce" am Rand
    // negative oder sprunghafte scrollY-Werte liefern — abklemmen.
    var currentY = Math.max(0, window.scrollY);
    var delta = currentY - lastY;

    if (currentY <= TOP_THRESHOLD) {
      topnav.classList.remove('nav-hidden');
    } else if (delta > DELTA_THRESHOLD) {
      topnav.classList.add('nav-hidden');
      topnav.classList.remove('open');
      closeAll();
      lastY = currentY;
    } else if (delta < -DELTA_THRESHOLD) {
      topnav.classList.remove('nav-hidden');
      lastY = currentY;
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
})();
