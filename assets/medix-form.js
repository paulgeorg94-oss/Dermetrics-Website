// Dermetrics — Anmeldung Zuweisung Clinic Selnau für Patientinnen und Patienten der MediX Praxis Altstetten
// (medix-anmeldung.html). Beim Absenden öffnet sich eine vorbereitete E-Mail an clinicselnau@hin.ch
// im E-Mail-Programm der Patientin oder des Patienten. Es werden keine Daten an einen Server gesendet.
// Zweisprachig: Englisch, wenn <html lang="en"> (en/medix-anmeldung.html).
(function () {
  "use strict";

  var TO = "clinicselnau@hin.ch";
  var FIRST_DAY = new Date(2026, 11, 7); // 7. Dezember 2026, erster Sprechstundentag (Montag)
  var EN = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
  var MONTHS = EN
    ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    : ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  var L = EN ? {
    uhr: "", required: "Please fill in all required fields and confirm your consent.",
    head: "Referral Clinic Selnau (MediX Praxis Altstetten)", subj: "Referral Clinic Selnau (MediX) – ",
    name: "Surname", vorname: "First name", email: "Email", tel: "Call-back number", grund: "Reason for referral",
    datum: "Preferred date", zeit: "Preferred time",
    sent: "Your email program will open a prepared email to " + TO + ". Please send the email. ",
    fallback: "Email did not open? Click here"
  } : {
    uhr: " Uhr", required: "Bitte füllen Sie alle Pflichtfelder aus und bestätigen Sie die Einwilligung.",
    head: "Zuweisung Clinic Selnau (MediX Praxis Altstetten)", subj: "Zuweisung Clinic Selnau (MediX) – ",
    name: "Name", vorname: "Vorname", email: "E-Mail", tel: "Rückrufnummer", grund: "Grund der Zuweisung",
    datum: "Wunschdatum", zeit: "Wunschzeit",
    sent: "Ihr E-Mail-Programm öffnet eine vorbereitete E-Mail an " + TO + ". Bitte senden Sie die E-Mail ab. ",
    fallback: "E-Mail hat sich nicht geöffnet? Hier klicken"
  };
  var WEEKS = 26; // angebotene Montage

  var f = document.getElementById("medix-form");
  var msg = document.getElementById("medix-msg");
  var dateSel = document.getElementById("mx-datum");
  var timeSel = document.getElementById("mx-zeit");
  if (!f || !dateSel || !timeSel) return;

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function label(d) {
    return EN ? "Monday, " + d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear()
              : "Montag, " + d.getDate() + ". " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  }

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
      o.value = t; o.textContent = t + L.uhr;
      timeSel.appendChild(o);
    });
  }

  f.addEventListener("submit", function (e) {
    e.preventDefault();
    msg.className = "form-note";
    msg.textContent = "";
    if (!f.checkValidity()) {
      msg.className = "form-error";
      msg.textContent = L.required;
      f.reportValidity && f.reportValidity();
      return;
    }
    var name = f.nachname.value.trim(), vorname = f.vorname.value.trim();
    var dateText = dateSel.options[dateSel.selectedIndex].textContent;
    var body =
      L.head + "\n\n" +
      L.name + ": " + name + "\n" +
      L.vorname + ": " + vorname + "\n" +
      L.email + ": " + f.email.value.trim() + "\n" +
      L.tel + ": " + f.telefon.value.trim() + "\n" +
      L.grund + ": " + f.grund.value + "\n" +
      L.datum + ": " + dateText + "\n" +
      L.zeit + ": " + timeSel.value + L.uhr + "\n";
    var href = "mailto:" + TO +
      "?subject=" + encodeURIComponent(L.subj + name + " " + vorname) +
      "&body=" + encodeURIComponent(body);

    msg.className = "form-success";
    msg.textContent = L.sent;
    var a = document.createElement("a");
    a.href = href;
    a.textContent = L.fallback;
    msg.appendChild(document.createElement("br"));
    msg.appendChild(a);
    window.location.href = href;
  });
})();
