// Dermetrics — QR-Code & Share-Button für Patienteninformationsseiten.
// Erzeugt den QR-Code clientseitig aus der aktuellen Seiten-URL (window.location.href),
// damit kein Hosting-Domain fest im Code verankert werden muss. Ein Klick auf den
// QR-Code öffnet ihn zusätzlich deutlich vergrössert als Pop-out (z. B. zum Abfotografieren
// von einem Bildschirm aus grösserer Distanz).
(function () {
  var isEn = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var t = isEn
    ? {
        copyPrompt: 'Copy link:',
        copied: 'Link copied',
        enlarge: 'Enlarge QR code',
        close: 'Close',
        scanHint: 'Scan with your phone’s camera.'
      }
    : {
        copyPrompt: 'Link kopieren:',
        copied: 'Link kopiert',
        enlarge: 'QR-Code vergrössern',
        close: 'Schliessen',
        scanHint: 'Mit der Kamera des Smartphones scannen.'
      };

  function copyLinkFallback(url, feedback) {
    window.prompt(t.copyPrompt, url);
  }

  // ---------- QR-Lightbox ----------
  var lightboxStyle = document.createElement('style');
  lightboxStyle.textContent =
    '.dm-qr-overlay{position:fixed;inset:0;z-index:70;background:rgba(37,16,61,0.6);display:flex;align-items:center;justify-content:center;padding:24px;font-family:Avenir,"Avenir Next","Nunito Sans",-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;}' +
    '.dm-qr-modal{background:#fff;width:100%;max-width:360px;border-radius:6px;padding:30px 28px 26px;position:relative;box-shadow:0 20px 60px rgba(37,16,61,0.2);text-align:center;}' +
    '.dm-qr-close{position:absolute;top:14px;right:14px;background:none;border:0;cursor:pointer;color:#655273;font-size:20px;line-height:1;padding:6px;}' +
    '.dm-qr-close:hover{color:#25103D;}' +
    '.dm-qr-box{width:min(70vw,280px);height:min(70vw,280px);margin:4px auto 18px;background:#fff;border:1px solid #D9D0E3;border-radius:4px;padding:16px;box-sizing:border-box;}' +
    '.dm-qr-box svg{width:100%;height:100%;display:block;}' +
    '.dm-qr-hint{font-size:13px;color:#655273;margin:0;line-height:1.5;}';
  document.head.appendChild(lightboxStyle);

  var overlayEl = null;

  function closeLightbox() {
    if (overlayEl) {
      overlayEl.remove();
      overlayEl = null;
      document.removeEventListener('keydown', onKeydown);
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  function openLightbox(svgMarkup) {
    if (overlayEl) return;

    overlayEl = document.createElement('div');
    overlayEl.className = 'dm-qr-overlay';
    overlayEl.setAttribute('role', 'dialog');
    overlayEl.setAttribute('aria-modal', 'true');
    overlayEl.setAttribute('aria-label', t.enlarge);

    var modal = document.createElement('div');
    modal.className = 'dm-qr-modal';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'dm-qr-close';
    closeBtn.setAttribute('aria-label', t.close);
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', closeLightbox);
    modal.appendChild(closeBtn);

    var box = document.createElement('div');
    box.className = 'dm-qr-box';
    box.innerHTML = svgMarkup;
    modal.appendChild(box);

    var hint = document.createElement('p');
    hint.className = 'dm-qr-hint';
    hint.textContent = t.scanHint;
    modal.appendChild(hint);

    overlayEl.appendChild(modal);
    overlayEl.addEventListener('click', function (e) {
      if (e.target === overlayEl) closeLightbox();
    });
    document.addEventListener('keydown', onKeydown);

    document.body.appendChild(overlayEl);
    closeBtn.focus();
  }

  function init() {
    var svgMarkup = null;
    try {
      var target = document.getElementById('qrcode');
      if (target && typeof qrcode === 'function') {
        var qr = qrcode(0, 'M');
        qr.addData(window.location.href);
        qr.make();
        svgMarkup = qr.createSvgTag({ cellSize: 4, margin: 4 });
        target.innerHTML = svgMarkup;

        var trigger = target.parentElement; // .qrshare-code
        if (trigger) {
          trigger.style.cursor = 'pointer';
          trigger.setAttribute('role', 'button');
          trigger.setAttribute('tabindex', '0');
          trigger.setAttribute('aria-label', t.enlarge);
          trigger.addEventListener('click', function () { openLightbox(svgMarkup); });
          trigger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openLightbox(svgMarkup);
            }
          });
        }
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
            feedback.textContent = t.copied;
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
