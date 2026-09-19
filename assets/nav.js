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

  var lastY = window.scrollY;
  var ticking = false;
  var TOP_THRESHOLD = 12;

  function onScroll() {
    var currentY = window.scrollY;
    if (currentY <= TOP_THRESHOLD) {
      topnav.classList.remove('nav-hidden');
    } else if (currentY > lastY) {
      topnav.classList.add('nav-hidden');
      topnav.classList.remove('open');
    } else if (currentY < lastY) {
      topnav.classList.remove('nav-hidden');
    }
    lastY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
})();
