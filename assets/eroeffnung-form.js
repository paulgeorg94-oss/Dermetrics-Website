// Dermetrics — Anmeldeformular Eröffnungsapéro (eroeffnung.html / en/eroeffnung.html).
// Ist data-endpoint am <form> leer, öffnet das Formular eine vorbereitete E-Mail an
// paul.georg@hin.ch. Ist ein Formular-Backend hinterlegt, wird JSON per POST gesendet.
(function () {
  "use strict";

  var isEn = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;

  var t = isEn
    ? {
        validation: "Please provide your first name, last name and your relationship to Clinic Selnau.",
        sendError: "The registration could not be sent. Please register by email at paul.georg@hin.ch.",
        thanksPrefix: "Thank you, ",
        thanksSuffix: ". Your registration has been received.",
        mailtoNotice: "Your email program will open a prepared registration to paul.georg@hin.ch. Please send the email.",
        mailtoFallbackLink: "Email didn't open? Click here",
        subjectLine: "Registration opening reception 14.12.2026 – ",
        eventLabel: "Opening reception Clinic Selnau, Monday, 14.12.2026, 6:00–8:30 pm",
        bodyIntro: "Registration opening reception Clinic Selnau, Monday, 14.12.2026, 6:00–8:30 pm",
        bodyFirstName: "First name: ",
        bodyLastName: "Last name: ",
        bodyRole: "Relationship to Clinic Selnau: "
      }
    : {
        validation: "Bitte Vorname, Nachname und Ihr Verhältnis zur Clinic Selnau angeben.",
        sendError: "Die Anmeldung konnte nicht gesendet werden. Bitte melden Sie sich per E-Mail an paul.georg@hin.ch an.",
        thanksPrefix: "Vielen Dank, ",
        thanksSuffix: ". Ihre Anmeldung ist eingegangen.",
        mailtoNotice: "Ihr E-Mail-Programm öffnet eine vorbereitete Anmeldung an paul.georg@hin.ch. Bitte senden Sie die E-Mail ab.",
        mailtoFallbackLink: "E-Mail hat sich nicht geöffnet? Hier klicken",
        subjectLine: "Anmeldung Eröffnungsapéro 14.12.2026 – ",
        eventLabel: "Eröffnungsapéro Clinic Selnau, Montag, 14.12.2026, 18:00–20:30 Uhr",
        bodyIntro: "Anmeldung Eröffnungsapéro Clinic Selnau, Montag, 14.12.2026, 18:00–20:30 Uhr",
        bodyFirstName: "Vorname: ",
        bodyLastName: "Nachname: ",
        bodyRole: "Verhältnis zur Clinic Selnau: "
      };

  var f = document.getElementById("dm-apero-form");
  var m = document.getElementById("dm-apero-msg");
  if (!f) return;

  f.addEventListener("submit", function (e) {
    e.preventDefault();
    m.className = "dm-msg";

    if (!f.checkValidity()) {
      m.className = "dm-msg dm-err";
      m.textContent = t.validation;
      return;
    }

    var d = {
      vorname: f.vorname.value.trim(),
      nachname: f.nachname.value.trim(),
      rolle: f.rolle.value,
      anlass: t.eventLabel
    };
    var ep = (f.getAttribute("data-endpoint") || "").trim();

    if (ep) {
      var btn = f.querySelector("button");
      btn.disabled = true;
      fetch(ep, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d)
      })
        .then(function (r) {
          if (!r.ok) throw new Error(String(r.status));
          f.reset();
          m.textContent = t.thanksPrefix + d.vorname + t.thanksSuffix;
        })
        .catch(function () {
          m.className = "dm-msg dm-err";
          m.textContent = t.sendError;
        })
        .then(function () {
          btn.disabled = false;
        });
      return;
    }

    var body =
      t.bodyIntro + "\n\n" +
      t.bodyFirstName + d.vorname + "\n" +
      t.bodyLastName + d.nachname + "\n" +
      t.bodyRole + d.rolle + "\n";
    var href =
      "mailto:paul.georg@hin.ch?subject=" +
      encodeURIComponent(t.subjectLine + d.vorname + " " + d.nachname) +
      "&body=" + encodeURIComponent(body);

    m.textContent = t.mailtoNotice + " ";
    var a = document.createElement("a");
    a.className = "dm-mail";
    a.href = href;
    a.textContent = t.mailtoFallbackLink;
    m.appendChild(document.createElement("br"));
    m.appendChild(a);
    window.location.href = href;
  });
})();
