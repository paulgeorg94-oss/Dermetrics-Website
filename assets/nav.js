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
