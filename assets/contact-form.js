// Kontaktformular.
// Zielarchitektur: serverseitige, TLS-gesicherte Zustellung über einen
// Formular-Dienst (z. B. Formspree) — die Zieladresse der Praxis liegt dann
// ausschliesslich in dessen Konto-Konfiguration, nicht im Quellcode dieser
// Website. Dazu unten die FORMSPREE_FORM_ID eintragen (Formspree-Konto
// anlegen → Formular erstellen → Form-ID aus der erhaltenen Endpoint-URL
// https://formspree.io/f/XXXXXXXX übernehmen).
//
// Solange keine Form-ID hinterlegt ist, nutzt das Formular ersatzweise einen
// vorausgefüllten mailto:-Entwurf; dafür wird die Zieladresse hier bewusst
// nicht als zusammenhängender Text im Quellcode hinterlegt (kein Klartext-
// Scraping), sondern zur Laufzeit aus zwei Teilen zusammengesetzt.
var FORMSPREE_FORM_ID = ''; // z. B. 'xzbqrsty' — sobald gesetzt, läuft der Versand serverseitig über Formspree statt mailto:

(function () {
  var CONTACT_LOCAL = 'clinicselnau';
  var CONTACT_DOMAIN = 'hin.ch';
  var CONTACT_EMAIL = CONTACT_LOCAL + '@' + CONTACT_DOMAIN;

  var form = document.getElementById('contact-form');
  var noteEl = document.getElementById('cfNote');
  var successEl = document.getElementById('cfSuccess');
  var errorEl = document.getElementById('cfError');

  function showSuccess() {
    noteEl.hidden = true;
    errorEl.hidden = true;
    successEl.hidden = false;
  }

  function showError() {
    errorEl.hidden = false;
  }

  function sendViaFormspree(formData) {
    errorEl.hidden = true;
    fetch('https://formspree.io/f/' + FORMSPREE_FORM_ID, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    }).then(function (response) {
      if (response.ok) {
        showSuccess();
        form.reset();
      } else {
        showError();
      }
    }).catch(function () {
      showError();
    });
  }

  function sendViaMailto() {
    var name = document.getElementById('cf-name').value.trim();
    var email = document.getElementById('cf-email').value.trim();
    var phone = document.getElementById('cf-phone').value.trim();
    var message = document.getElementById('cf-message').value.trim();

    var subject = 'Kontaktanfrage über dermetrics.ch — ' + name;
    var body =
      'Name: ' + name + '\n' +
      'E-Mail: ' + email + '\n' +
      (phone ? 'Telefon: ' + phone + '\n' : '') +
      '\nAnliegen:\n' + message +
      '\n\n— Gesendet über das Kontaktformular auf dermetrics.ch';

    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (FORMSPREE_FORM_ID) {
      sendViaFormspree(new FormData(form));
    } else {
      sendViaMailto();
    }
  });
})();
