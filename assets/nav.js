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

  // Scrollen im Menü: Solange Maus oder Finger im Menübereich sind, bleibt das Menü offen.
  // Am Ende der Liste (oder wenn die Liste nicht scrollen muss) wird das Weiterscrollen
  // der Seite verhindert, damit sich das Menü nicht durch das Ausblenden des Headers schliesst.
  // Erst wenn ausserhalb des Menüs gescrollt wird, greift das normale Verhalten.
  var inMenu = false;
  function canScroll(el, down) {
    return down ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0;
  }
  function guard(el, onlyWhen) {
    if (!el) return;
    var on = function () { return !onlyWhen || onlyWhen(); };
    el.addEventListener('mouseenter', function () { if (on()) inMenu = true; });
    el.addEventListener('mouseleave', function () { inMenu = false; });
    el.addEventListener('wheel', function (e) {
      if (on() && !canScroll(el, e.deltaY > 0)) e.preventDefault();
    }, { passive: false });
    var startY = 0;
    el.addEventListener('touchstart', function (e) { if (on()) inMenu = true; startY = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchmove', function (e) {
      var down = startY - e.touches[0].clientY > 0;
      if (on() && !canScroll(el, down) && e.cancelable) e.preventDefault();
    }, { passive: false });
  }
  // Desktop-Dropdowns (im aufgeklappten Mobile-Menü scrollt das ganze Menü, siehe unten)
  for (var k = 0; k < drops.length; k++) guard(drops[k].querySelector('.navdrop-menu'), function () { return !topnav.classList.contains('open'); });
  guard(topnav.querySelector('nav.navlinks'), function () { return topnav.classList.contains('open'); }); // Mobile-Menü (aufgeklappt)
  document.addEventListener('touchstart', function (e) {
    if (!(e.target.closest && (e.target.closest('.navdrop-menu') || e.target.closest('nav.navlinks')))) inMenu = false;
  }, { passive: true });
  function menuActive() {
    if (!inMenu) return false;
    if (topnav.classList.contains('open')) return true;
    for (var i = 0; i < drops.length; i++) {
      var m = drops[i].querySelector('.navdrop-menu');
      if (m && getComputedStyle(m).display !== 'none') return true;
    }
    return false;
  }
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

    if (menuActive()) { lastY = currentY; ticking = false; return; }

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
