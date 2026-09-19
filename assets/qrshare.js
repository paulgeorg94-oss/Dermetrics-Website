// Dermetrics — QR-Code & Share-Button für Patienteninformationsseiten.
// Erzeugt den QR-Code clientseitig aus der aktuellen Seiten-URL (window.location.href),
// damit kein Hosting-Domain fest im Code verankert werden muss.
(function () {
  function copyLinkFallback(url, feedback) {
    window.prompt('Link kopieren:', url);
  }

  function init() {
    try {
      var target = document.getElementById('qrcode');
      if (target && typeof qrcode === 'function') {
        var qr = qrcode(0, 'M');
        qr.addData(window.location.href);
        qr.make();
        target.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 4 });
      }
    } catch (e) { /* QR-Code konnte nicht erzeugt werden */ }

    var shareBtn = document.getElementById('share-btn');
    var feedback = document.getElementById('share-feedback');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', function () {
      var url = window.location.href;
      var shareData = { title: document.title, url: url };

      if (navigator.share) {
        navigator.share(shareData).catch(function () { /* vom Nutzer abgebrochen */ });
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          if (feedback) {
            feedback.textContent = 'Link kopiert';
            setTimeout(function () { feedback.textContent = ''; }, 2500);
          }
        }).catch(function () { copyLinkFallback(url, feedback); });
        return;
      }
      copyLinkFallback(url, feedback);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
