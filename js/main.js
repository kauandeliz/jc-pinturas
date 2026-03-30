var WA_NUMBER = '5549988674130';

/* ── MENU MOBILE ── */
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(function(a) {
  a.addEventListener('click', function() {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  });
});

/* ── NAV SCROLL ── */
var nav = document.getElementById('mainNav');
window.addEventListener('scroll', function() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── READ PROGRESS ── */
window.addEventListener('scroll', function() {
  var doc = document.documentElement;
  var p = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
  var bar = document.getElementById('readProgress');
  if (bar) bar.style.width = Math.min(p * 100, 100) + '%';
}, { passive: true });

/* ── NAV ACTIVE ── */
var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) navLinks.forEach(function(a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' }).observe && sections.forEach(function(s) {
  new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) navLinks.forEach(function(a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(s);
});

/* ── REVEAL ── */
new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 }).observe && (function() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
})();

/* ── WHATSAPP QUOTE ── */
function waQuote(btn, event) {
  event.preventDefault();
  var card = btn.closest('[data-wa]');
  var msg = card ? card.dataset.wa : 'Olá! Gostaria de solicitar um orçamento.';
  window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
}

/* ── CHIPS ── */
document.querySelectorAll('#serviceChips .chip').forEach(function(chip) {
  chip.addEventListener('click', function() {
    document.querySelectorAll('#serviceChips .chip').forEach(function(c) { c.classList.remove('active'); });
    chip.classList.add('active');
    document.getElementById('servicoInput').value = chip.dataset.value;
  });
});

/* ── DATE MIN ── */
var dateInput = document.getElementById('data');
if (dateInput) dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);

/* ── FORM SUBMIT ── */
var bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', function() {
    setTimeout(function() {
      bookingForm.style.display = 'none';
      var s = document.getElementById('formSuccess');
      if (s) { s.style.display = 'block'; s.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }, 400);
  });
}

/* ── GALLERY ── */
var galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
var filterBtns = document.querySelectorAll('.filter-btn');
var currentFilter = 'all';
var visibleItems = [];

function updateGallery() {
  visibleItems = [];
  galleryItems.forEach(function(item) {
    var show = currentFilter === 'all' || item.dataset.category === currentFilter;
    item.classList.toggle('hidden', !show);
    if (show) visibleItems.push(item);
  });
  var vc = document.getElementById('visibleCount');
  if (vc) vc.textContent = visibleItems.length;
}

filterBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    filterBtns.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    updateGallery();
  });
});

galleryItems.forEach(function(item) {
  item.addEventListener('click', function() {
    var vi = visibleItems.indexOf(item);
    openLightbox(vi >= 0 ? vi : 0);
  });
});

/* ── LIGHTBOX ── */
var lightbox = document.getElementById('lightbox');
var lightboxIndex = 0;

function openLightbox(index) {
  lightboxIndex = index;
  renderLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function lightboxNav(dir) {
  lightboxIndex = (lightboxIndex + dir + visibleItems.length) % visibleItems.length;
  renderLightbox();
}
function renderLightbox() {
  var item = visibleItems[lightboxIndex];
  if (!item) return;
  var img = item.querySelector('img');
  document.getElementById('lightboxImg').src = img ? img.src : '';
  document.getElementById('lightboxImg').alt = img ? img.alt : '';
  document.getElementById('lightboxTitle').textContent = item.dataset.title || '';
  document.getElementById('lightboxDesc').textContent = item.dataset.desc || '';
  var dots = document.getElementById('lightboxDots');
  dots.innerHTML = '';
  visibleItems.forEach(function(_, i) {
    var dot = document.createElement('span');
    if (i === lightboxIndex) dot.classList.add('active');
    dot.addEventListener('click', function() { lightboxIndex = i; renderLightbox(); });
    dots.appendChild(dot);
  });
}
document.addEventListener('keydown', function(e) {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'ArrowLeft') lightboxNav(-1);
});
lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
updateGallery();

/* ── CHAT ── */
(function() {
  var box = document.getElementById('chatBox');
  var trigger = document.getElementById('chatTrigger');
  var msgs = document.getElementById('chatMessages');
  var input = document.getElementById('chatInput');
  var badge = document.getElementById('chatBadge');
  var quickEl = document.getElementById('chatQuick');
  var isOpen = false;
  var welcomed = false;

  function now() { return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); }

  function addMsg(text, type) {
    var div = document.createElement('div');
    div.className = 'chat-msg ' + type;
    div.innerHTML = text + '<span class="chat-msg-time">' + now() + '</span>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function botReply(text, delay) {
    delay = delay || 800;
    setTimeout(function() {
      var typing = document.createElement('div');
      typing.className = 'chat-typing show';
      typing.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(typing);
      msgs.scrollTop = msgs.scrollHeight;
      setTimeout(function() { typing.remove(); addMsg(text, 'bot'); }, delay);
    }, 300);
  }

  var replies = [
    { keys: ['serviço','serviços','servico','fazem','oferecem'], reply: 'Oferecemos Pintura Residencial, Comercial, Industrial, Fachadas, Texturas e Impermeabilização! 🖌️ Qual desses você precisa?' },
    { keys: ['orçamento','orcamento','preço','preco','valor','quanto'], reply: 'Para um orçamento preciso, preciso de alguns detalhes. Vou te redirecionar ao WhatsApp do Jair! 💬' },
    { keys: ['agendar','agenda','visita','marcar'], reply: 'Ótimo! Me passa seu nome e o melhor horário — ou use o formulário aqui no site. 📅' },
    { keys: ['endereço','endereco','localização','localizacao','onde','atende'], reply: 'Atendemos Lages e toda a região de Santa Catarina! Para mais detalhes, fale com o Jair pelo WhatsApp. 📍' },
    { keys: ['horário','horario','funciona','aberto'], reply: 'Horário: Seg–Sex das 07:00 às 18:00 e Sábado das 07:00 às 12:00. ⏰' },
    { keys: ['whatsapp','zap','fone','telefone','ligar'], reply: 'WhatsApp: (49) 8867-4130 – Jair Camargo. Clique no botão verde da tela! 📱' },
    { keys: ['obrigado','obrigada','valeu','grato'], reply: 'Por nada! 😊 Se precisar de mais alguma coisa, é só chamar!' },
    { keys: ['oi','olá','ola','bom dia','boa tarde','boa noite'], reply: 'Olá! 👋 Bem-vindo à JC Pinturas! Sou o assistente do Jair Camargo. Em que posso ajudar?' },
  ];

  function findReply(text) {
    var t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (var r of replies) { if (r.keys.some(function(k) { return t.includes(k); })) return r.reply; }
    return null;
  }

  function sendChatMsg() {
    var text = (input.value || '').trim();
    if (!text) return;
    input.value = '';
    addMsg(text, 'user');
    if (quickEl) quickEl.style.display = 'none';
    var reply = findReply(text);
    if (reply) { botReply(reply, 800); }
    else {
      botReply('Entendido! Vou te redirecionar ao Jair pelo WhatsApp. Um momento... 💬', 700);
      setTimeout(function() { window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent('Vim pelo site: ' + text), '_blank'); }, 2200);
    }
  }

  function quickReply(btn) {
    input.value = btn.textContent.replace(/^[^\w]+/, '').trim();
    sendChatMsg();
  }

  function toggleChat() {
    isOpen = !isOpen;
    box.classList.toggle('open', isOpen);
    trigger.classList.toggle('open', isOpen);
    badge.classList.add('hidden');
    if (isOpen) input.focus();
  }

  setTimeout(function() {
    if (!welcomed) {
      welcomed = true;
      addMsg('Olá! 👋 Bem-vindo à JC Pinturas! Como posso te ajudar?', 'bot');
      if (!isOpen) badge.classList.remove('hidden');
    }
  }, 3000);

  window.toggleChat = toggleChat;
  window.sendChatMsg = sendChatMsg;
  window.quickReply = quickReply;
})();

/* ── STICKY BAR ── */
(function() {
  var bar = document.getElementById('stickyBar');
  var close = document.getElementById('stickyClose');
  if (!bar) return;
  if (sessionStorage.getItem('stickyClosed')) return;
  var dismissed = false;

  function update() {
    if (dismissed) return;
    var sy = window.scrollY, dh = document.documentElement.scrollHeight, wh = window.innerHeight;
    var p = sy / (dh - wh);
    bar.classList.toggle('visible', p > 0.4 && p < 0.9);
  }
  close.addEventListener('click', function() {
    dismissed = true;
    bar.classList.remove('visible');
    sessionStorage.setItem('stickyClosed', '1');
  });
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

