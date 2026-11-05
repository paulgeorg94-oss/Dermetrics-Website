// Pre-Check — vollständiger 13-Fragen-Risiko-Score mit Auswertung
// Klinisch validiertes Regelwerk (Basis: QSkin/MP16), unverändert übernommen.
(function () {
  var root = document.getElementById('pcQPhase');
  if (!root) return;

  var THRESHOLD = 7;

  var QUESTIONS = [
    { block: 'Block A · Vorgeschichte',
      q: 'Wurde bei Ihnen persönlich jemals Hautkrebs diagnostiziert?',
      hint: 'Melanom oder weisser Hautkrebs',
      opts: [{ l: 'Ja', flag: true }, { l: 'Nein', pts: 0 }] },
    { block: 'Block A · Vorgeschichte',
      q: 'Haben Sie eine akute Veränderung an einem Muttermal bemerkt?',
      hint: 'z. B. Jucken, Bluten, Farbveränderung oder rasches Neuwachstum',
      opts: [{ l: 'Ja', flag: true }, { l: 'Nein', pts: 0 }] },
    { block: 'Block A · Vorgeschichte',
      q: 'Liegt bei Ihnen eine Immunsuppression oder ein genetisches Risiko-Syndrom vor?',
      hint: 'z. B. nach Organtransplantation, HIV, hämatologische Erkrankung, Xeroderma pigmentosum, Gorlin-Syndrom',
      opts: [{ l: 'Ja', flag: true }, { l: 'Nein', pts: 0 }] },
    { block: 'Block A · Vorgeschichte',
      q: 'Wurden bei Ihnen bereits aktinische Keratosen oder Hautkrebs-Vorstufen behandelt?',
      hint: 'Chronische Sonnenschäden, raue Hautstellen',
      opts: [{ l: 'Ja', pts: 3 }, { l: 'Nein', pts: 0 }] },
    { block: 'Block A · Vorgeschichte',
      q: 'Wurde bei Verwandten 1. Grades Hautkrebs diagnostiziert?',
      hint: 'Eltern, Geschwister oder eigene Kinder',
      opts: [{ l: 'Ja', pts: 4 }, { l: 'Nein', pts: 0 }] },
    { block: 'Block B · Körperliche Merkmale',
      q: 'Welche Darstellung entspricht am ehesten Ihrer Muttermaldichte am gesamten Körper?',
      opts: [
        { l: 'Hohe Dichte', s: 'Mehr als 50 Muttermale, unregelmässige oder auffällige Formen', pts: 5 },
        { l: 'Moderate Dichte', s: '16–50 normale Muttermale', pts: 2 },
        { l: 'Geringe Dichte', s: 'Weniger als 15 normale Muttermale', pts: 0 }] },
    { block: 'Block B · Körperliche Merkmale',
      q: 'Wie reagiert Ihre ungeschützte Haut auf die erste intensive Sommersonne?',
      opts: [
        { l: 'Typ I', s: 'Immer sofort Sonnenbrand, bräunt nie – sehr helle Haut, oft Sommersprossen', pts: 3 },
        { l: 'Typ II', s: 'Meistens Sonnenbrand, bräunt nur sehr schwer', pts: 2 },
        { l: 'Typ III', s: 'Seltener Sonnenbrand, bräunt gut und gleichmässig', pts: 1 },
        { l: 'Typ IV–VI', s: 'Kaum oder nie Sonnenbrand, von Natur aus dunklere Haut', pts: 0 }] },
    { block: 'Block B · Körperliche Merkmale',
      q: 'Welches ist Ihre natürliche Haarfarbe (im Alter von ca. 20 Jahren)?',
      opts: [{ l: 'Rot / Hellblond', pts: 2 }, { l: 'Braun / Schwarz', pts: 0 }] },
    { block: 'Block C · UV-Exposition',
      q: 'Hatten Sie im Laufe Ihres Lebens schwere, schmerzhafte oder blasenbildende Sonnenbrände?',
      opts: [
        { l: 'Ja, mehr als 3-mal', pts: 3 },
        { l: 'Ja, 1–2-mal', pts: 1 },
        { l: 'Nein, keine', pts: 0 }] },
    { block: 'Block C · UV-Exposition',
      q: 'Traten schwere Sonnenbrände bereits in der Kindheit oder Jugend auf (unter 13 Jahren)?',
      opts: [{ l: 'Ja', pts: 1 }, { l: 'Nein / Nicht zutreffend', pts: 0 }] },
    { block: 'Block C · UV-Exposition',
      q: 'Wie viele Stunden verbringen Sie durchschnittlich pro Tag im Freien?',
      hint: 'Beruflich oder bei intensiven Freizeitaktivitäten',
      opts: [
        { l: 'Täglich mehr als 4 Stunden', pts: 2 },
        { l: 'Gelegentlich, 1–4 Stunden am Tag', pts: 1 },
        { l: 'Überwiegend in Innenräumen', pts: 0 }] },
    { block: 'Block C · UV-Exposition',
      q: 'Nutzen oder nutzten Sie jemals ein Solarium?',
      opts: [
        { l: 'Ja, regelmässig', s: 'Erstnutzung vor dem 35. Lebensjahr', pts: 3 },
        { l: 'Ja, gelegentlich / selten', pts: 1 },
        { l: 'Nein, nie', pts: 0 }] },
    { block: 'Block D · Demographie',
      q: 'Was trifft auf Sie zu?',
      opts: [
        { l: 'Älter als 50 Jahre und männlich', pts: 2 },
        { l: 'Älter als 50 Jahre oder männlich', pts: 1 },
        { l: 'Keines von beidem', pts: 0 }] }
  ];

  var MAX_PTS = QUESTIONS.reduce(function (s, q) {
    return s + Math.max.apply(null, q.opts.map(function (o) { return o.pts || 0; }));
  }, 0);

  var RESULT = {
    3: { head: 'Stark erhöhte Raten in Studien',
         text: 'Mindestens ein medizinisches Warnsignal (Red Flag) liegt vor. In epidemiologischen Studien weisen Personengruppen mit vergleichbaren Merkmalen stark erhöhte Raten von schwarzem Hautkrebs (Melanom) auf. Eine zeitnahe dermatologische Abklärung ist ratsam; der 3D-Ganzkörperscan wäre in diesem Fall eine Leistung der Grundversicherung (KVG).' },
    2: { head: 'Erhöhte Raten in Studien',
         text: 'Ihr Score liegt über dem Schwellenwert. In epidemiologischen Studien zeigen Personengruppen mit einem vergleichbaren Score erhöhte Raten von schwarzem Hautkrebs (Melanom). Eine regelmässige, standardisierte 3D-Hautkontrolle ist naheliegend und wird der Grundversicherung (KVG) zugewiesen.' },
    1: { head: 'Niedrige Raten in Studien',
         text: 'Keine Warnsignale, Ihr Score liegt unter dem Schwellenwert. In epidemiologischen Studien weisen Personengruppen mit einem vergleichbaren Profil niedrige Raten von schwarzem Hautkrebs (Melanom) auf. Konsequenter Sonnenschutz und regelmässige Selbstkontrollen bleiben dennoch wichtig.' }
  };

  var TIERS = ['Niedrige Raten', 'Erhöhte Raten', 'Stark erhöhte Raten'];
  var TIER_WIDTHS = ['34%', '64%', '100%'];
  var YOUR_RESULT_LABEL = 'Ihr Ergebnis';

  var idx = 0;
  var answers = new Array(QUESTIONS.length).fill(null);
  var phase = 'question';
  var busy = false;

  function $(id) { return document.getElementById(id); }
  function pad(n) { return String(n).padStart(2, '0'); }

  function evaluate() {
    var flagged = QUESTIONS.some(function (q, i) {
      return answers[i] !== null && !!q.opts[answers[i]].flag;
    });
    var score = QUESTIONS.reduce(function (s, q, i) {
      return s + (answers[i] !== null ? (q.opts[answers[i]].pts || 0) : 0);
    }, 0);
    if (flagged) { return { tier: 3, score: score, cta: true }; }
    if (score > THRESHOLD) { return { tier: 2, score: score, cta: true }; }
    return { tier: 1, score: score, cta: false };
  }

  function renderQuestion() {
    var q = QUESTIONS[idx];
    var progress = (idx / QUESTIONS.length) * 100;

    $('pcBlock').textContent = q.block;
    $('pcStep').textContent = 'Frage ' + pad(idx + 1) + ' / ' + pad(QUESTIONS.length);
    $('pcBar').style.width = progress + '%';
    $('pcQuestion').textContent = q.q;

    $('pcHint').textContent = q.hint || '';
    $('pcHint').hidden = !q.hint;

    var box = $('pcOptions');
    box.innerHTML = '';
    q.opts.forEach(function (o, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pc-option';
      var strong = document.createElement('b');
      strong.textContent = o.l;
      b.appendChild(strong);
      if (o.s) {
        var small = document.createElement('small');
        small.textContent = o.s;
        b.appendChild(small);
      }
      b.addEventListener('click', function () { select(i); });
      box.appendChild(b);
    });

    $('pcBack').disabled = idx === 0;
  }

  function renderResult() {
    var r = evaluate();
    var txt = RESULT[r.tier];

    var scale = $('pcScale');
    scale.innerHTML = '';

    TIERS.forEach(function (label, i) {
      var row = document.createElement('div');
      row.className = 'pc-scalerow' + (r.tier === i + 1 ? ' on' : '');

      var num = document.createElement('span');
      num.className = 'pc-scalenum';
      num.textContent = pad(i + 1);

      var track = document.createElement('span');
      track.className = 'pc-track';
      var fill = document.createElement('i');
      track.appendChild(fill);

      var tag = document.createElement('span');
      tag.className = 'pc-tag';
      tag.appendChild(document.createTextNode(label));
      if (r.tier === i + 1) {
        var m = document.createElement('span');
        m.className = 'pc-marker';
        m.textContent = YOUR_RESULT_LABEL;
        tag.appendChild(m);
      }

      row.appendChild(num);
      row.appendChild(track);
      row.appendChild(tag);
      scale.appendChild(row);

      window.setTimeout(function () { fill.style.width = TIER_WIDTHS[i]; }, 80 + i * 100);
    });

    $('pcResultHead').textContent = txt.head;
    $('pcResultText').textContent = txt.text;
    $('pcScoreValue').textContent = r.score + ' / ' + MAX_PTS;
    $('pcCta').hidden = !r.cta;

    pdfPrinted = false;
    $('pcEmail').value = '';
    $('pcPdfStatus').hidden = true;
    $('pcPdfMail').disabled = true;
  }

  // PDF-Export des Ergebnisses über den nativen Druckdialog des Browsers
  // ("Als PDF speichern") — anonym, vollständig lokal auf dem Gerät, ohne
  // Drittanbieter-Bibliothek und ohne deren Zeichenkodierungs-Probleme.
  // Optionaler Versand per mailto: über das eigene E-Mail-Programm.
  var pdfPrinted = false;

  function populatePrintArea() {
    var r = evaluate();
    var txt = RESULT[r.tier];
    $('pcPrintDate').textContent = 'Erstellt am ' + new Date().toLocaleDateString('de-CH') + ' · anonym, ohne personenbezogene Angaben';
    $('pcPrintResultHead').textContent = txt.head;
    $('pcPrintResultText').textContent = txt.text;
    $('pcPrintScore').textContent = 'Risiko-Score: ' + r.score + ' / ' + MAX_PTS + ' Punkte';

    var list = $('pcPrintAnswers');
    list.innerHTML = '';
    QUESTIONS.forEach(function (q, i) {
      var chosen = answers[i] !== null ? q.opts[answers[i]].l : '—';
      var li = document.createElement('li');
      var strong = document.createElement('strong');
      strong.textContent = q.q;
      li.appendChild(strong);
      var ansLine = document.createElement('div');
      ansLine.textContent = 'Antwort: ' + chosen;
      li.appendChild(ansLine);
      list.appendChild(li);
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function updateMailButtonState() {
    $('pcPdfMail').disabled = !(pdfPrinted && isValidEmail($('pcEmail').value.trim()));
  }

  $('pcEmail').addEventListener('input', updateMailButtonState);

  $('pcPdfDownload').addEventListener('click', function () {
    populatePrintArea();
    window.print();
  });

  window.addEventListener('afterprint', function () {
    if ($('pcRPhase').hidden) { return; }
    pdfPrinted = true;
    var status = $('pcPdfStatus');
    status.hidden = false;
    status.textContent = 'Druckdialog geschlossen — falls Sie „Als PDF speichern" gewählt haben, finden Sie die Datei in Ihrem Download-Ordner.';
    updateMailButtonState();
  });

  $('pcPdfMail').addEventListener('click', function () {
    var email = $('pcEmail').value.trim();
    if (!isValidEmail(email)) { return; }
    var r = evaluate();
    var subject = 'Mein Dermetrics Pre-Check-Ergebnis';
    var body = 'Ergebnis: ' + RESULT[r.tier].head + ' (Score ' + r.score + ' / ' + MAX_PTS + ' Punkte)\n\n' +
      'Bitte hängen Sie das soeben als PDF gespeicherte Dokument an diese E-Mail an, bevor Sie sie senden.\n\n' +
      'Bitte bringen Sie die Unterlagen Ihrer bisherigen Arztbesuche beim Dermatologen und die Ergebnisse dieses Fragebogens mit zu Ihrem Termin.\n\n' +
      'Hinweis: Diese E-Mail wird unverschlüsselt über Ihr eigenes E-Mail-Programm versendet — wie bei gewöhnlicher E-Mail-Kommunikation.';
    window.location.href = 'mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  function render() {
    $('pcQPhase').hidden = phase !== 'question';
    $('pcRPhase').hidden = phase !== 'result';
    if (phase === 'question') { renderQuestion(); } else { renderResult(); }
  }

  function select(optIndex) {
    if (busy) { return; }
    answers[idx] = optIndex;
    busy = true;
    $('pcQPhase').classList.add('fade');
    window.setTimeout(function () {
      if (idx < QUESTIONS.length - 1) { idx += 1; } else { phase = 'result'; }
      busy = false;
      $('pcQPhase').classList.remove('fade');
      render();
    }, 240);
  }

  $('pcBack').addEventListener('click', function () {
    if (idx > 0 && !busy) { idx -= 1; render(); }
  });

  $('pcRestart').addEventListener('click', function () {
    answers = new Array(QUESTIONS.length).fill(null);
    idx = 0;
    phase = 'question';
    render();
  });

  render();
})();
