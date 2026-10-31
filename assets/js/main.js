(function () {
  'use strict';

  // ---- Configuração -------------------------------------------------------
  // Para enviar leads a um CRM/serviço (Formspree, Make, Zapier, HubSpot,
  // endpoint próprio etc.), informe a URL abaixo. O formulário envia um POST
  // JSON. Se ficar vazio, o lead é enviado pelo WhatsApp da RideWave.
  var FORM_ENDPOINT = '';
  var WHATSAPP = '5511960884885';

  // ---- Menu mobile --------------------------------------------------------
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- Pré-seleciona o interesse ao clicar numa oferta --------------------
  var interesse = document.getElementById('interesse');
  document.querySelectorAll('[data-interesse]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (interesse) interesse.value = el.getAttribute('data-interesse');
    });
  });

  // ---- Formulário de leads ------------------------------------------------
  var form = document.getElementById('lead-form');
  var status = document.getElementById('form-status');
  if (!form) return;

  function setStatus(msg, cls) {
    status.textContent = msg;
    status.className = 'form-status ' + (cls || '');
  }

  function validate() {
    var ok = true;
    ['nome', 'empresa', 'email'].forEach(function (id) {
      var el = form.elements[id];
      var valid = el.value.trim() !== '' &&
        (id !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      el.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (!valid) ok = false;
    });
    if (!form.elements.lgpd.checked) ok = false;
    return ok;
  }

  function buildText(d) {
    return [
      'Olá! Quero saber mais sobre o MDM Cloud4Mobile.',
      'Nome: ' + d.nome,
      'Empresa: ' + d.empresa,
      'E-mail: ' + d.email,
      d.telefone && 'Telefone: ' + d.telefone,
      d.dispositivos && 'Dispositivos: ' + d.dispositivos,
      'Interesse: ' + d.interesse,
      d.mensagem && 'Mensagem: ' + d.mensagem
    ].filter(Boolean).join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.elements.website.value) return; // honeypot anti-spam
    if (!validate()) {
      setStatus('Preencha nome, empresa, e-mail válido e aceite o consentimento.', 'err');
      return;
    }

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
    delete data.website;
    data.origem = location.href;
    data.data = new Date().toISOString();

    if (!FORM_ENDPOINT) {
      var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(buildText(data));
      window.open(url, '_blank', 'noopener');
      setStatus('Abrimos o WhatsApp com a sua mensagem. É só enviar!', 'ok');
      return;
    }

    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    setStatus('Enviando...', '');
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      form.reset();
      setStatus('Solicitação enviada! Um especialista responde em até 1 dia útil.', 'ok');
    }).catch(function () {
      setStatus('Não foi possível enviar agora. Fale conosco em contato@ridewave.tech.', 'err');
    }).finally(function () { btn.disabled = false; });
  });
})();
