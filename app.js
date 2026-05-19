/* ============================================================
   TRONCOSO DESIGNS — Catálogo Simple
   ============================================================ */
(function () {
  'use strict';

  const CAT_LABELS = {
    tumbler:'Tumbler', mug:'Taza', shirt:'Ropa',
    sticker:'Sticker', keychain:'Llavero', bottle:'Botella',
    props:'Accesorio'
  };

  const grid       = document.getElementById('js-grid');
  const countEl    = document.getElementById('js-count');
  const modal      = document.getElementById('js-modal');
  const modalClose = document.getElementById('js-modal-close');
  const contactBtn   = document.getElementById('js-contact-btn');
  const contactModal = document.getElementById('js-modal-contact');
  const contactClose = document.getElementById('js-modal-contact-close');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let currentCat   = 'all';

  /* ---- Aplicar config ---- */
  document.title = CONFIG.brandName + ' — Catálogo';
  document.getElementById('js-footer').textContent = CONFIG.footerText;
  if (CONFIG.accentColor)
    document.documentElement.style.setProperty('--accent', CONFIG.accentColor);

  /* ---- Render productos ---- */
  function renderGrid() {
    grid.innerHTML = '';
    PRODUCTS.forEach(p => grid.appendChild(createCard(p)));
    applyFilter('all');
  }

  function createCard(p) {
    const card = document.createElement('div');
    card.className   = 'product-card';
    card.dataset.cat = (p.category || '').toLowerCase();

    const catLabel  = CAT_LABELS[card.dataset.cat] || p.category || '';
    const badge     = p.badge ? `<span class="badge">${p.badge}</span>` : '';
    const priceHTML = (CONFIG.showPrices && p.price)
      ? `<span class="card-price">${p.price}</span>`
      : `<span class="card-tag">${p.tag || ''}</span>`;

    card.innerHTML = `
      <div class="card-img-wrap">
        ${badge}
        <img class="card-img" src="${p.image||''}" alt="${p.name||''}" loading="lazy"
          onerror="this.style.background='#1a1a1a';this.style.minHeight='200px';" />
      </div>
      <div class="card-body">
        <div class="card-category">${catLabel}</div>
        <div class="card-name">${p.name||''}</div>
        <div class="card-desc">${p.description||''}</div>
        <div class="card-footer">${priceHTML}<span class="card-cta">Ver más →</span></div>
      </div>`;

    card.addEventListener('click', () => openModal(p));
    return card;
  }

  function applyFilter(cat) {
    currentCat = cat;
    document.querySelectorAll('.product-card').forEach(c =>
      c.classList.toggle('hidden', cat !== 'all' && c.dataset.cat !== cat)
    );
    const n = cat === 'all'
      ? PRODUCTS.length
      : PRODUCTS.filter(p => (p.category||'').toLowerCase() === cat).length;
    countEl.textContent = n + ' artículo' + (n !== 1 ? 's' : '');
  }

  /* ---- Modal ---- */
  function openModal(p) {
    const catLabel = CAT_LABELS[(p.category||'').toLowerCase()] || p.category || '';
    document.getElementById('modal-img').src          = p.image || '';
    document.getElementById('modal-img').alt          = p.name  || '';
    document.getElementById('modal-cat').textContent  = catLabel;
    document.getElementById('modal-name').textContent = p.name  || '';
    document.getElementById('modal-desc').textContent = p.description || '';
    document.getElementById('modal-price').textContent =
      (CONFIG.showPrices && p.price) ? p.price : '';
    const msg   = p.whatsapp || CONFIG.whatsappDefaultMsg + p.name;
    const phone = CONFIG.whatsappNumber.replace(/\D/g,'');
    document.getElementById('modal-wa-btn').href =
      'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  function openContact() {
    contactModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeContact() {
    contactModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ---- Eventos ---- */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.cat);
    });
  });
  modalClose.addEventListener('click', closeModal);
  contactBtn.addEventListener('click', openContact);
  contactClose.addEventListener('click', closeContact);

  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  contactModal.addEventListener('click', e => { if (e.target === contactModal) closeContact(); });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeContact(); } });

  /* ---- Init ---- */
  renderGrid();
})();
