/* Google-Karte erst nach Klick laden (keine Verbindung zu Google vor dem Klick). */
(function () {
  var btn = document.getElementById('load-map');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var box = btn.closest('.mapbox');
    var f = document.createElement('iframe');
    f.src = box.getAttribute('data-src');
    f.title = box.getAttribute('data-title');
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.setAttribute('allowfullscreen', '');
    box.innerHTML = '';
    box.appendChild(f);
    box.classList.add('is-loaded');
  });
})();
