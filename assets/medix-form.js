// Dermetrics — Anmeldung Zuweisung Clinic Selnau für Patientinnen und Patienten der MediX Praxis Altstetten
// (medix-anmeldung.html). Beim Absenden öffnet sich eine vorbereitete E-Mail an clinicselnau@hin.ch
// im E-Mail-Programm der Patientin oder des Patienten. Es werden keine Daten an einen Server gesendet.
(function () {
  "use strict";

  var TO = "clinicselnau@hin.ch";
  var FIRST_DAY = new Date(2026, 11, 7); // 7. Dezember 2026, erster Sprechstundentag (Montag)
  var MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  var WEEKS = 26; // angebotene Montage

  var f = document.getElementById("medix-form");
  var msg = document.getElementById("medix-msg");
  var dateSel = document.getElementById("mx-datum");
  var timeSel = document.getElementById("mx-zeit");
  if (!f || !dateSel || !timeSel) return;

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function label(d) { return "Montag, " + d.getDate() + ". " + MONTHS[d.getMonth()] + " " + d.getFullYear(); }

  // Nächste Montage ab heute bzw. ab dem ersten Sprechstundentag
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var start = today > FIRST_DAY ? new Date(today) : new Date(FIRST_DAY);
  while (start.getDay() !== 1) start.setDate(start.getDate() + 1);
  for (var i = 0; i < WEEKS; i++) {
    var d = new Date(start); d.setDate(start.getDate() + 7 * i);
    var o = document.createElement("option");
    o.value = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    o.textContent = label(d);
    dateSel.appendChild(o);
  }

  // Uhrzeiten 10:00 bis 17:30 (Sprechstunde 10:00–18:00 Uhr)
  for (var h = 10; h < 18; h++) {
    ["00", "30"].forEach(function (mm) {
      var t = pad(h) + ":" + mm;
      var o = document.createElement("option");
      o.value = t; o.textContent = t + " Uhr";
      timeSel.appendChild(o);
    });
  }

  f.addEventListener("submit", function (e) {
    e.preventDefault();
    msg.className = "form-note";
    msg.textContent = "";
    if (!f.checkValidity()) {
      msg.className = "form-error";
      msg.textContent = "Bitte füllen Sie alle Pflichtfelder aus und bestätigen Sie die Einwilligung.";
      f.reportValidity && f.reportValidity();
      return;
    }
    var name = f.nachname.value.trim(), vorname = f.vorname.value.trim();
    var dateText = dateSel.options[dateSel.selectedIndex].textContent;
    var body =
      "Zuweisung Clinic Selnau (MediX Praxis Altstetten)\n\n" +
      "Name: " + name + "\n" +
      "Vorname: " + vorname + "\n" +
      "E-Mail: " + f.email.value.trim() + "\n" +
      "Rückrufnummer: " + f.telefon.value.trim() + "\n" +
      "Grund der Zuweisung: " + f.grund.value + "\n" +
      "Wunschdatum: " + dateText + "\n" +
      "Wunschzeit: " + timeSel.value + " Uhr\n";
    var href = "mailto:" + TO +
      "?subject=" + encodeURIComponent("Zuweisung Clinic Selnau (MediX) – " + name + " " + vorname) +
      "&body=" + encodeURIComponent(body);

    msg.className = "form-success";
    msg.textContent = "Ihr E-Mail-Programm öffnet eine vorbereitete E-Mail an " + TO + ". Bitte senden Sie die E-Mail ab. ";
    var a = document.createElement("a");
    a.href = href;
    a.textContent = "E-Mail hat sich nicht geöffnet? Hier klicken";
    msg.appendChild(document.createElement("br"));
    msg.appendChild(a);
    window.location.href = href;
  });
})();
