/**
 * Morada Quintal da Serra - Interactive Application Logic & Real Property Package Galleries
 * Rancho Queimado - SC
 */

// Global Application State
const appState = {
  serviceType: 'pernoite', // 'pernoite' | 'dayuse'
  checkIn: '',
  checkOut: '',
  numNights: 2,
  guestsCount: 2,
  baseRatePerNight: 754.00,
  singleNightRate: 1100.00,
  dayUseRate: 650.00,
  selectedPackages: [],
  selectedAddons: [],
  activePackageId: 'namora-romance',
  cart: {
    stayItem: null,
    packages: [],
    addons: [],
    subtotal: 0,
    discount: 0,
    total: 0
  }
};

// Full Romantic Packages Data Using ONLY 100% REAL Property Photography from /Imagens
const ROMANTIC_PACKAGES = {
  namorar: [
    {
      id: 'namora-encanto',
      category: 'Namora comigo?',
      name: 'Pacote Encanto',
      price: 321.00,
      slogan: 'Para uma surpresa delicada e apaixonante.',
      description: 'Decoração romântica acolhedora no chalé, pensada nos mínimos detalhes para surpreender quem você ama.',
      cover: 'assets/images/P1071283.jpeg',
      pdf: 'Base/Pacotes/Pacote Namora comigo .pdf',
      gallery: [
        'assets/images/P1071283.jpeg',
        'assets/images/P1071287.jpeg',
        'assets/images/P1071293.jpeg',
        'assets/images/P1071294.jpeg',
        'assets/images/P1071309.jpeg'
      ],
      items: [
        'Decoração romântica no chalé',
        'Pétalas decorativas',
        'Velas de LED criando atmosfera mágica',
        'Balões em formato de coração',
        'Plaquinha especial "Quer namorar comigo?"',
        'Caixa de chocolates selecionados'
      ],
      tag: 'Surpresa Delicada',
      highlighted: false
    },
    {
      id: 'namora-romance',
      category: 'Namora comigo?',
      name: 'Pacote Romance',
      price: 490.00,
      slogan: 'Para transformar o pedido em uma experiência ainda mais especial.',
      description: 'Produção romântica completa com caminho de pétalas, espumante premium, buquê de flores e tábua especial de frios.',
      cover: 'assets/images/P1071316.jpeg',
      pdf: 'Base/Pacotes/Pacote Namora comigo .pdf',
      gallery: [
        'assets/images/P1071316.jpeg',
        'assets/images/P1071317.jpeg',
        'assets/images/P1071321.jpeg',
        'assets/images/P1071323.jpeg',
        'assets/images/P1071325.jpeg',
        'assets/images/P1071329.jpeg'
      ],
      items: [
        'Decoração romântica completa no chalé',
        'Caminho de pétalas de rosas e velas de LED',
        'Balões em formato de coração',
        'Plaquinha "Quer namorar comigo?"',
        'Buquê de flores naturais',
        '1 Garrafa de Espumante Premium',
        'Tábua especial de frios para o casal',
        'Chocolates finos',
        'Cartinha personalizada com a mensagem do cliente'
      ],
      tag: 'Mais Vendido ⭐',
      highlighted: true
    },
    {
      id: 'namora-momento',
      category: 'Namora comigo?',
      name: 'Momento Inesquecível',
      price: 690.00,
      slogan: 'Para quem quer preparar uma surpresa daquelas que ficam para sempre na memória.',
      description: 'Experiência VIP completa com registro em fotos e pequenos vídeos do ambiente preparado antes da chegada.',
      cover: 'assets/images/P1071337.jpeg',
      pdf: 'Base/Pacotes/Pacote Namora comigo .pdf',
      gallery: [
        'assets/images/P1071337.jpeg',
        'assets/images/P1071343.jpeg',
        'assets/images/P1071344.jpeg',
        'assets/images/P1071346.jpeg',
        'assets/images/P1071349.jpeg',
        'assets/images/P1071351.jpeg'
      ],
      items: [
        'Decoração romântica premium e exclusiva no chalé',
        'Caminho especial de pétalas e velas de LED',
        'Balões e decoração temática "Quer namorar comigo?"',
        'Buquê especial de flores selecionadas',
        '1 Garrafa de Espumante Premium',
        'Tábua especial de frios gourmet',
        'Chocolates finos artesanais',
        'Cartinha personalizada com a mensagem do cliente',
        'Mimo especial para o casal',
        'Registro em fotos e pequenos vídeos do ambiente preparado antes da chegada'
      ],
      tag: 'Experiência VIP',
      highlighted: false
    }
  ],
  casar: [
    {
      id: 'casa-osim',
      category: 'Casa comigo?',
      name: 'Pacote "O Sim"',
      price: 321.00,
      slogan: 'Cenário perfeito para eternizar o tão esperado SIM! 💍',
      description: 'Decoração intimista e romântica para dar início a um novo capítulo na história de amor do casal.',
      cover: 'assets/images/P1071513.jpeg',
      pdf: 'Base/Pacotes/Pacote “Casa comigo”.pdf',
      gallery: [
        'assets/images/P1071513.jpeg',
        'assets/images/P1071514.jpeg',
        'assets/images/P1071515.jpeg',
        'assets/images/P1071516.jpeg',
        'assets/images/P1071519.jpeg'
      ],
      items: [
        'Decoração romântica no chalé',
        'Pétalas de rosas',
        'Velas decorativas e pontos de luz',
        'Balões em formato de coração',
        'Plaquinha "Casa Comigo?"',
        '1 Garrafa de Espumante',
        'Chocolates finos para a celebração'
      ],
      note: '* Hospedagem contratada separadamente.',
      tag: 'Pedido Intimista',
      highlighted: false
    },
    {
      id: 'casa-nosso-momento',
      category: 'Casa comigo?',
      name: 'Pacote "Nosso Momento"',
      price: 475.00,
      slogan: 'Onde histórias de amor ganham novos capítulos.',
      description: 'Arranjo de flores naturais, caminho iluminado de pétalas e tábua gourmet especial para o pedido.',
      cover: 'assets/images/P1071557.jpeg',
      pdf: 'Base/Pacotes/Pacote “Casa comigo”.pdf',
      gallery: [
        'assets/images/P1071557.jpeg',
        'assets/images/P1071561.jpeg',
        'assets/images/P1071568.jpeg',
        'assets/images/P1071579.jpeg',
        'assets/images/P1071586.jpeg'
      ],
      items: [
        'Toda a decoração romântica do Pacote Essencial',
        'Arranjo com flores naturais nobres',
        'Pétalas e velas criando o caminho até a surpresa',
        'Letras ou decoração especial "Casa Comigo?"',
        '1 Garrafa de Espumante',
        'Tábua especial de frios para o casal',
        'Chocolates artesanais'
      ],
      note: '* Hospedagem contratada separadamente.',
      tag: 'Mais Recomendado 💍',
      highlighted: true
    },
    {
      id: 'casa-para-sempre',
      category: 'Casa comigo?',
      name: 'Pacote "Para Sempre"',
      price: 637.00,
      slogan: 'Uma experiência completa para um dos momentos mais importantes da vida de vocês.',
      description: 'Filmagem no momento do pedido, flores nobres, iluminação cênica e preparação do ambiente para fotos pós-SIM.',
      cover: 'assets/images/P1071640.jpeg',
      pdf: 'Base/Pacotes/Pacote “Casa comigo”.pdf',
      gallery: [
        'assets/images/P1071640.jpeg',
        'assets/images/P1071424.jpeg',
        'assets/images/P1071430.jpeg',
        'assets/images/P1071443.jpeg',
        'assets/images/P1071449.jpeg',
        'assets/images/DJI_20260505153651_0104_D.jpeg'
      ],
      items: [
        'Decoração premium e totalmente personalizada',
        'Arranjos com flores naturais nobres',
        'Caminho romântico com pétalas e iluminação cênica',
        'Velas e pontos de luz pelo ambiente',
        'Decoração especial "Casa Comigo?"',
        '1 Espumante ou Vinho escolhido pelo casal',
        'Tábua de frios especial gourmet',
        'Chocolates finos artesanais',
        'Buquê especial de flores',
        'Filmagem no momento do pedido',
        'Preparação especial do ambiente para fotos após o "SIM"'
      ],
      note: '* Hospedagem contratada separadamente.',
      tag: 'Experiência Completa',
      highlighted: false
    }
  ]
};

// Available Addons Data
const EXTRA_ADDONS = [
  { id: 'add-cafe', name: 'Cesta de Café da Manhã Artesanal', price: 140.00, desc: 'Pães frescos, queijos coloniais de Rancho Queimado, geleias e frutas.' },
  { id: 'add-lareira', name: 'Kit Lareira & Vinho Fino da Serra', price: 190.00, desc: 'Lenha ecológica selecionada, acendedores e 1 garrafa de vinho reservado.' },
  { id: 'add-pet', name: 'Taxa Pet Amigo (Por Estadia)', price: 95.00, desc: 'Comedouros, mimos para seu pet e higienização especial pós-check-out.' }
];

// Initialize DOM Events
document.addEventListener('DOMContentLoaded', () => {
  initDateDefaults();
  updateCalculation();
  renderPackages('namorar');
  initScrollReveal();
  initHeaderScrollAnimation();
  initCurtainGalleryParallax();
  initHeroRandomSlider();
  initStructureRandomSlider();
  initCustomCursor();
  initBannerCurtainReveals();
});

// Parallax Curtain Reveal for Section 2 (Galeria de Fotos da Hospedagem)
function initCurtainGalleryParallax() {
  const hero = document.getElementById('hero');
  const galleryContainer = document.getElementById('galeria-reveal-container');
  const gallery = document.getElementById('galeria');

  if (!hero || !galleryContainer || !gallery) return;

  const updateParallax = () => {
    // A galeria já fica fixa atrás da Hero Section via CSS (margin-top: -100vh e sticky top-0)
    // Precisamos apenas aplicar o Zoom na galeria durante a rolagem sticky.
    const containerRect = galleryContainer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const galleryGrid = document.querySelector('.gallery-grid-edge');

    if (!galleryGrid) return;

    // Se a galeria está expandida, não aplicamos zoom
    if (!galleryContainer.classList.contains('h-[400vh]')) {
      galleryGrid.style.transform = 'scale(1)';
      return;
    }

    if (containerRect.top <= 0 && containerRect.bottom >= viewportHeight) {
      const currentScroll = Math.abs(containerRect.top);
      
      // Fase 1: Scroll de 0 a 100vh (Hero sendo revelada). Zoom = 1.1 (grande)
      if (currentScroll <= viewportHeight) {
        galleryGrid.style.transform = 'scale(1.1)';
      } else {
        // Fase 2: Scroll de 100vh a 300vh (Galeria fixa e dando zoom out).
        const zoomScroll = currentScroll - viewportHeight;
        const maxZoomScroll = galleryContainer.offsetHeight - (2 * viewportHeight); // 400vh - 200vh = 200vh
        const scrollRatio = Math.min(Math.max(zoomScroll / maxZoomScroll, 0), 1);
        
        // Zoom vai de 1.1 até 1 (Zoom Out)
        const scale = 1.1 - (scrollRatio * 0.1);
        galleryGrid.style.transform = `scale(${scale})`;
      }
    } else {
      galleryGrid.style.transform = 'scale(1)';
    }
  };

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateParallax);
  }, { passive: true });

  updateParallax();
}

// Expand Gallery Section when "+ Carregar Mais Fotos" is clicked
function expandGallerySection() {
  const gallery = document.getElementById('galeria');
  const loadMoreBar = document.getElementById('gallery-load-more-bar');
  const loadLessBar = document.getElementById('gallery-load-less-bar');
  const revealContainer = document.getElementById('galeria-reveal-container');
  const stickyWrapper = document.getElementById('galeria-sticky-wrapper');
  const galleryGrid = document.querySelector('.gallery-grid-edge');
  const hero = document.getElementById('hero');

  if (gallery) {
    gallery.classList.remove('gallery-collapsed');
    gallery.classList.add('gallery-expanded');
  }
  
  if (galleryGrid) {
    galleryGrid.style.transform = 'scale(1)';
  }

  // Remove fixed sticky behavior so user can scroll down normally
  if (revealContainer) {
    revealContainer.classList.remove('h-[400vh]', '-mt-[100vh]');
    revealContainer.classList.add('h-auto');
    revealContainer.style.marginTop = '0'; // Remover a sobreposição
  }
  if (stickyWrapper) {
    stickyWrapper.classList.remove('sticky', 'h-screen');
    stickyWrapper.classList.add('relative', 'h-auto');
  }

  // Fix scroll position instantly to prevent jumping, keeping visual top at viewport top
  if (hero) {
    window.scrollTo({ top: hero.offsetHeight, behavior: 'instant' });
  }

  if (loadMoreBar) {
    loadMoreBar.style.opacity = '0';
    setTimeout(() => {
      loadMoreBar.style.display = 'none';
      if (loadLessBar) {
        loadLessBar.classList.remove('hidden');
        setTimeout(() => {
          loadLessBar.style.opacity = '1';
        }, 50);
      }
    }, 400);
  }
}

// Collapse Gallery Section when "- Carregar Menos" is clicked
function collapseGallerySection() {
  const gallery = document.getElementById('galeria');
  const loadMoreBar = document.getElementById('gallery-load-more-bar');
  const loadLessBar = document.getElementById('gallery-load-less-bar');
  const revealContainer = document.getElementById('galeria-reveal-container');
  const stickyWrapper = document.getElementById('galeria-sticky-wrapper');
  const bookingWidget = document.getElementById('simulador-reserva');

  // Funciona como uma âncora: rola suavemente para o card de booking primeiro
  if (bookingWidget) {
    bookingWidget.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Ocultar o botão "Carregar Menos" imediatamente
  if (loadLessBar) {
    loadLessBar.style.opacity = '0';
  }

  // Aguardar o término do scroll suave (aprox 800ms)
  setTimeout(() => {
    // Calculamos o offset exato do widget de booking no momento para manter a posição travada
    const bookingOffset = bookingWidget ? bookingWidget.getBoundingClientRect().top : 0;

    // Encolhemos a galeria instantaneamente (já que ela está fora da tela agora)
    if (gallery) {
      gallery.style.transition = 'none'; // Desativa a transição para fechar rápido
      gallery.classList.add('gallery-collapsed');
      gallery.classList.remove('gallery-expanded');
      void gallery.offsetWidth; // Força o reflow do DOM
      gallery.style.transition = ''; // Restaura a transição
    }
    
    if (revealContainer) {
      revealContainer.classList.add('h-[400vh]', '-mt-[100vh]');
      revealContainer.classList.remove('h-auto');
      revealContainer.style.marginTop = '';
    }
    if (stickyWrapper) {
      stickyWrapper.classList.add('sticky', 'h-screen');
      stickyWrapper.classList.remove('relative', 'h-auto');
    }

    // Ajustamos instantaneamente o scroll da página para compensar a altura perdida pela galeria
    // Garantindo 100% que o usuário não sinta um "pulo" visual
    if (bookingWidget) {
      const newBookingOffset = bookingWidget.getBoundingClientRect().top;
      window.scrollBy({ top: newBookingOffset - bookingOffset, behavior: 'instant' });
    }

    if (loadLessBar) {
      loadLessBar.classList.add('hidden');
    }
    
    // Mostrar o botão "Carregar Mais" novamente na galeria (para caso ele role para cima)
    if (loadMoreBar) {
      loadMoreBar.style.display = 'flex';
      setTimeout(() => {
        loadMoreBar.style.opacity = '1';
      }, 50);
    }
  }, 800); 
}

function initDateDefaults() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const afterTomorrow = new Date(today);
  afterTomorrow.setDate(afterTomorrow.getDate() + 3);

  const formatInputDate = (d) => d.toISOString().split('T')[0];
  
  const inInput = document.getElementById('input-checkin');
  const outInput = document.getElementById('input-checkout');
  
  if (inInput && outInput) {
    inInput.value = formatInputDate(tomorrow);
    outInput.value = formatInputDate(afterTomorrow);
    
    appState.checkIn = inInput.value;
    appState.checkOut = outInput.value;
    
    inInput.addEventListener('change', handleDateChange);
    outInput.addEventListener('change', handleDateChange);
  }
}

function handleDateChange() {
  const inInput = document.getElementById('input-checkin');
  const outInput = document.getElementById('input-checkout');
  
  if (inInput.value && outInput.value) {
    const d1 = new Date(inInput.value);
    const d2 = new Date(outInput.value);
    const diffTime = d2 - d1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      appState.numNights = diffDays;
      appState.checkIn = inInput.value;
      appState.checkOut = outInput.value;
    } else {
      alert('A data de check-out deve ser posterior à data de check-in.');
      outInput.value = inInput.value;
      appState.numNights = 1;
    }
  }
  updateCalculation();
}

function setServiceType(type) {
  appState.serviceType = type;
  
  const btnPernoite = document.getElementById('btn-type-pernoite');
  const btnDayUse = document.getElementById('btn-type-dayuse');
  const nightContainer = document.getElementById('nights-selector-container');
  const checkoutFieldContainer = document.getElementById('field-checkout-container');

  if (type === 'pernoite') {
    if (btnPernoite) btnPernoite.className = 'btn-araucaria text-xs !py-2.5 !px-5';
    if (btnDayUse) btnDayUse.className = 'btn-outline-champagne text-xs !py-2.5 !px-5 !text-white';
    if (nightContainer) nightContainer.style.display = 'block';
    if (checkoutFieldContainer) checkoutFieldContainer.style.display = 'block';
  } else {
    if (btnDayUse) btnDayUse.className = 'btn-araucaria text-xs !py-2.5 !px-5';
    if (btnPernoite) btnPernoite.className = 'btn-outline-champagne text-xs !py-2.5 !px-5 !text-white';
    if (nightContainer) nightContainer.style.display = 'none';
    if (checkoutFieldContainer) checkoutFieldContainer.style.display = 'none';
  }
  
  updateCalculation();
}

function setNights(val) {
  appState.numNights = parseInt(val, 10);
  const slider = document.getElementById('slider-nights');
  if (slider) slider.value = appState.numNights;
  updateCalculation();
}

function updateCalculation() {
  let stayBaseTotal = 0;
  let rateNote = '';

  if (appState.serviceType === 'pernoite') {
    if (appState.numNights === 1) {
      stayBaseTotal = appState.singleNightRate;
      rateNote = 'Diária Única (R$ 1.100,00 / casal)';
    } else {
      stayBaseTotal = appState.numNights * appState.baseRatePerNight;
      rateNote = `${appState.numNights} Noites x R$ 754,00 / noite (Tarifa Promocional)`;
    }
  } else {
    stayBaseTotal = appState.dayUseRate;
    rateNote = 'Day Use Exclusivo (Das 09h às 18h)';
  }

  const packagesTotal = appState.selectedPackages.reduce((acc, p) => acc + p.price, 0);
  const addonsTotal = appState.selectedAddons.reduce((acc, a) => acc + a.price, 0);
  const subtotal = stayBaseTotal + packagesTotal + addonsTotal;
  
  const nightsLabel = document.getElementById('label-nights-display');
  if (nightsLabel) {
    nightsLabel.innerText = appState.serviceType === 'pernoite' ? `${appState.numNights} ${appState.numNights === 1 ? 'noite' : 'noites'}` : '1 dia (Day Use)';
  }

  const subtotalDisplay = document.getElementById('calc-subtotal-display');
  if (subtotalDisplay) subtotalDisplay.innerText = formatBRL(subtotal);

  const rateNoteDisplay = document.getElementById('calc-rate-note');
  if (rateNoteDisplay) rateNoteDisplay.innerText = rateNote;

  appState.cart.stayItem = {
    title: appState.serviceType === 'pernoite' ? `Hospedagem Chalé (${appState.numNights} ${appState.numNights === 1 ? 'diária' : 'diárias'})` : 'Experiência Day Use (09h às 18h)',
    price: stayBaseTotal,
    details: rateNote
  };
  appState.cart.packages = [...appState.selectedPackages];
  appState.cart.addons = [...appState.selectedAddons];
  appState.cart.subtotal = subtotal;
  appState.cart.total = subtotal;

  updateCartBadge();
}

function formatBRL(val) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function updateCartBadge() {
  const totalItems = (appState.cart.stayItem ? 1 : 0) + appState.cart.packages.length + appState.cart.addons.length;
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.innerText = totalItems;
    badge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
  }
}

// Render Main Packages Cards dynamically
function switchPackageCategory(catKey) {
  const tabNamora = document.getElementById('tab-pkg-namora');
  const tabCasa = document.getElementById('tab-pkg-casa');

  if (catKey === 'namorar') {
    if (tabNamora) tabNamora.className = 'btn-araucaria text-xs !py-2.5 !px-6';
    if (tabCasa) tabCasa.className = 'btn-outline-champagne text-xs !py-2.5 !px-6';
  } else {
    if (tabCasa) tabCasa.className = 'btn-araucaria text-xs !py-2.5 !px-6';
    if (tabNamora) tabNamora.className = 'btn-outline-champagne text-xs !py-2.5 !px-6';
  }

  renderPackages(catKey);
}

function renderPackages(catKey) {
  const container = document.getElementById('packages-cards-container');
  if (!container) return;

  const pkgList = ROMANTIC_PACKAGES[catKey] || [];
  
  container.innerHTML = pkgList.map(pkg => {
    const isAdded = appState.selectedPackages.some(p => p.id === pkg.id);
    
    return `
      <div class="card-boutique p-8 flex flex-col justify-between relative ${pkg.highlighted ? 'border-2 border-[var(--color-champagne)] shadow-xl' : ''}">
        ${pkg.highlighted ? `<div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--color-araucaria)] text-[var(--color-champagne)] text-[10px] font-bold tracking-widest uppercase px-4 py-1 rounded-full border border-[var(--color-champagne)] shadow-sm">${pkg.tag}</div>` : ''}
        
        <div>
          <!-- Thumbnail Cover from REAL Photos -->
          <div class="h-48 rounded-xl overflow-hidden mb-6 relative group cursor-pointer" onclick="openPackageDetailsModal('${pkg.id}')">
            <img src="${pkg.cover}" alt="${pkg.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-[rgba(14,38,30,0.85)] via-transparent to-transparent flex items-end p-3">
              <span class="text-white text-[11px] font-bold flex items-center gap-1">
                Ver Galeria Real Morada (${pkg.gallery.length} fotos)
              </span>
            </div>
          </div>

          <div class="flex justify-between items-start mb-2">
            <h3 class="font-serif text-2xl font-bold text-[var(--color-araucaria)]">${pkg.name}</h3>
            ${pkg.tag && !pkg.highlighted ? `<span class="badge-boutique text-[10px]">${pkg.tag}</span>` : ''}
          </div>

          <p class="text-xs font-semibold italic text-[var(--color-champagne-hover)] mb-2">${pkg.slogan}</p>
          <p class="text-xs text-[var(--color-texto-suave)] mb-6 leading-relaxed font-light">${pkg.description}</p>
          
          <div class="divider-gold mb-6"></div>

          <span class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-araucaria)] block mb-3">Principais Itens Incluídos:</span>

          <ul class="space-y-2 mb-8">
            ${pkg.items.slice(0, 5).map(item => `
              <li class="flex items-start gap-2 text-xs text-[var(--color-texto)] font-medium">
                <span class="text-emerald-700 font-bold shrink-0 mt-0.5">✓</span>
                <span>${item}</span>
              </li>
            `).join('')}
            ${pkg.items.length > 5 ? `<li class="text-[11px] font-bold text-[var(--color-araucaria)] text-right cursor-pointer hover:underline" onclick="openPackageDetailsModal('${pkg.id}')">+ Ver todos os ${pkg.items.length} itens...</li>` : ''}
          </ul>
        </div>

        <div class="pt-4 border-t border-champagne-subtle flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold tracking-wider text-[var(--color-texto-suave)] block">Investimento</span>
              <span class="font-serif font-bold text-2xl text-[var(--color-araucaria)]">${formatBRL(pkg.price)}</span>
            </div>

            <button onclick="togglePackage('${pkg.id}')" class="${isAdded ? 'btn-champagne' : 'btn-araucaria'} text-xs !py-2.5 !px-4 shadow-sm">
              ${isAdded ? '✓ Adicionado' : '+ Incluir no Pedido'}
            </button>
          </div>

          <div class="flex items-center justify-between pt-1 border-t border-champagne-subtle text-[11px]">
            <button onclick="openPackageDetailsModal('${pkg.id}')" class="font-bold text-[var(--color-araucaria)] hover:underline flex items-center gap-1">
              📸 Galeria de Fotos Reais (${pkg.gallery.length})
            </button>
            <a href="${pkg.pdf}" target="_blank" class="font-bold text-[var(--color-texto-suave)] hover:underline">
              📄 PDF Oficial
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Open Dedicated Package Modal with Exclusive REAL Photo Gallery
function openPackageDetailsModal(pkgId) {
  let allPkgs = [...ROMANTIC_PACKAGES.namorar, ...ROMANTIC_PACKAGES.casar];
  let pkg = allPkgs.find(p => p.id === pkgId);
  if (!pkg) return;

  const modal = document.getElementById('package-details-modal');
  const body = document.getElementById('package-details-body');
  if (!modal || !body) return;

  const isAdded = appState.selectedPackages.some(p => p.id === pkg.id);

  body.innerHTML = `
    <div class="p-6 md:p-8 space-y-6">
      
      <!-- Modal Header -->
      <div class="flex justify-between items-start pb-4 border-b border-champagne-subtle">
        <div>
          <span class="badge-boutique mb-1">${pkg.category} • ${pkg.tag}</span>
          <h2 class="font-serif text-3xl font-bold text-[var(--color-araucaria)]">${pkg.name}</h2>
          <p class="text-xs italic font-semibold text-[var(--color-champagne-hover)] mt-1">${pkg.slogan}</p>
        </div>
        <button onclick="closePackageDetailsModal()" class="w-9 h-9 rounded-full bg-[var(--color-creme)] hover:bg-[var(--color-champagne-light)] flex items-center justify-center text-[var(--color-araucaria)] font-bold">
          ✕
        </button>
      </div>

      <!-- Specific REAL Photo Gallery for this Package -->
      <div class="space-y-3">
        <span class="text-xs font-bold uppercase tracking-wider text-[var(--color-araucaria)] block">
          📸 Galeria de Fotos Reais da Morada Quintal da Serra (${pkg.gallery.length} fotos):
        </span>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          ${pkg.gallery.map(imgSrc => `
            <div class="h-32 rounded-xl overflow-hidden shadow-sm cursor-pointer gallery-item" onclick="openLightbox('${imgSrc}', '${pkg.name} - Morada Quintal da Serra')">
              <img src="${imgSrc}" alt="${pkg.name}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Description & Items Grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
        <div class="md:col-span-7 space-y-4">
          <h3 class="font-bold text-sm uppercase tracking-wider text-[var(--color-araucaria)] border-b border-champagne-subtle pb-2">
            Descrição Completa da Surpresa
          </h3>
          <p class="text-xs text-[var(--color-texto-suave)] leading-relaxed font-light">${pkg.description}</p>
          
          <h4 class="font-bold text-xs uppercase tracking-wider text-[var(--color-araucaria)] pt-2">
            Checklist Completo dos Benefícios Incluídos:
          </h4>
          <ul class="space-y-2">
            ${pkg.items.map(item => `
              <li class="flex items-start gap-2.5 text-xs text-[var(--color-texto)] font-medium">
                <span class="text-emerald-700 font-bold shrink-0 mt-0.5">✓</span>
                <span>${item}</span>
              </li>
            `).join('')}
          </ul>

          ${pkg.note ? `<p class="text-[10px] italic text-[var(--color-texto-suave)] bg-[var(--color-creme)] p-3 rounded-xl border border-champagne-subtle">${pkg.note}</p>` : ''}
        </div>

        <div class="md:col-span-5 card-boutique p-6 bg-white space-y-6 flex flex-col justify-between">
          <div class="space-y-3">
            <span class="text-xs font-bold uppercase tracking-wider text-[var(--color-texto-suave)] block">Valor do Pacote</span>
            <span class="font-serif font-bold text-4xl text-[var(--color-araucaria)] block">${formatBRL(pkg.price)}</span>
            <span class="text-[11px] text-[var(--color-texto-suave)] block">Adicionando ao seu pedido, o valor é somado automaticamente no checkout.</span>
          </div>

          <div class="space-y-3 pt-4 border-t border-champagne-subtle">
            <button onclick="togglePackage('${pkg.id}'); closePackageDetailsModal(); openCartModal();" class="w-full btn-araucaria py-3 text-xs uppercase tracking-wider font-bold shadow-md">
              ${isAdded ? '✓ Pacote Incluído (Ir para Checkout)' : '✨ Incluir no Pedido & Reservar'}
            </button>
            <a href="${pkg.pdf}" target="_blank" class="block text-center text-xs font-bold text-[var(--color-araucaria)] hover:underline py-1">
              📄 Abrir Catálogo PDF Oficial
            </a>
          </div>
        </div>
      </div>

    </div>
  `;

  modal.classList.add('active');
}

function closePackageDetailsModal() {
  const modal = document.getElementById('package-details-modal');
  if (modal) modal.classList.remove('active');
}

function togglePackage(pkgId) {
  let allPkgs = [...ROMANTIC_PACKAGES.namorar, ...ROMANTIC_PACKAGES.casar];
  let target = allPkgs.find(p => p.id === pkgId);
  if (!target) return;

  const idx = appState.selectedPackages.findIndex(p => p.id === pkgId);
  if (idx >= 0) {
    appState.selectedPackages = [];
  } else {
    // Regra: Apenas 1 Pacote Romântico por reserva
    appState.selectedPackages = [target];
  }

  const activeTab = document.getElementById('tab-pkg-namora')?.classList.contains('btn-araucaria') ? 'namorar' : 'casar';
  renderPackages(activeTab);
  updateCalculation();
}

function toggleAddon(addonId) {
  const addon = EXTRA_ADDONS.find(a => a.id === addonId);
  if (!addon) return;

  const idx = appState.selectedAddons.findIndex(a => a.id === addonId);
  if (idx >= 0) {
    appState.selectedAddons.splice(idx, 1);
  } else {
    appState.selectedAddons.push(addon);
  }

  updateCalculation();
}

// Shopping Cart & Lateral Drawer
function formatDateBR(dateStr) {
  if (!dateStr) return 'A definir';
  const parts = dateStr.split('-');
  if (parts.length === 3) return parts[2] + '/' + parts[1] + '/' + parts[0];
  return dateStr;
}

function getStayDetailsString() {
  if (appState.serviceType === 'dayuse') {
    return '☀️ Data: ' + formatDateBR(appState.checkIn) + ' (09h às 18h)';
  }
  const checkInBR = formatDateBR(appState.checkIn);
  const checkOutBR = formatDateBR(appState.checkOut);
  const nightsStr = appState.numNights + ' ' + (appState.numNights === 1 ? 'diária' : 'diárias');
  return '📅 Check-in: ' + checkInBR + ' | Check-out: ' + checkOutBR + ' (' + nightsStr + ')';
}

function openCartModal() {
  updateCalculation();
  renderCartModalContent();
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('active');
}

function closeCartModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('active');
}

let cartActiveTab = 'resumo';

function setCartTab(tab) {
  cartActiveTab = tab;
  renderCartModalContent();
}

function setServiceTypeInCart(type) {
  setServiceType(type);
  renderCartModalContent();
}

function setCheckInInCart(dateVal) {
  if (!dateVal) return;
  appState.checkIn = dateVal;
  const inInput = document.getElementById('input-checkin');
  if (inInput) inInput.value = dateVal;

  if (appState.serviceType === 'pernoite') {
    const d1 = new Date(dateVal);
    d1.setDate(d1.getDate() + appState.numNights);
    const outStr = d1.toISOString().split('T')[0];
    appState.checkOut = outStr;
    const outInput = document.getElementById('input-checkout');
    if (outInput) outInput.value = outStr;
  }
  updateCalculation();
  renderCartModalContent();
}

function setCheckOutInCart(dateVal) {
  if (!dateVal) return;
  appState.checkOut = dateVal;
  const outInput = document.getElementById('input-checkout');
  if (outInput) outInput.value = dateVal;

  if (appState.checkIn) {
    const d1 = new Date(appState.checkIn);
    const d2 = new Date(dateVal);
    const diffTime = d2 - d1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      appState.numNights = diffDays;
      const slider = document.getElementById('slider-nights');
      if (slider) slider.value = diffDays;
    }
  }
  updateCalculation();
  renderCartModalContent();
}

function setNightsInCart(val) {
  setNights(val);
  if (appState.checkIn) {
    const d1 = new Date(appState.checkIn);
    d1.setDate(d1.getDate() + appState.numNights);
    const outStr = d1.toISOString().split('T')[0];
    appState.checkOut = outStr;
    const outInput = document.getElementById('input-checkout');
    if (outInput) outInput.value = outStr;
  }
  updateCalculation();
  renderCartModalContent();
}

function renderCartModalContent() {
  const body = document.getElementById('cart-modal-body');
  if (!body) return;

  updateCalculation();
  const { stayItem, packages, addons, total } = appState.cart;

  const packagesHTML = packages.map(function(p) {
    return '<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:10px 16px;gap:12px;border-bottom:1px solid var(--color-champagne)">' +
      '<div style="flex:1">' +
        '<span style="display:block;font-size:12px;font-weight:700;color:var(--color-araucaria)">' + p.name + '</span>' +
        '<span style="display:block;font-size:11px;color:var(--color-texto-suave);margin-top:2px">' + p.slogan + '</span>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0">' +
        '<span style="font-family:var(--font-serif);font-weight:700;font-size:13px;color:var(--color-araucaria)">' + formatBRL(p.price) + '</span>' +
        '<button onclick="togglePackage(\'' + p.id + '\'); renderCartModalContent();" title="Remover" style="width:22px;height:22px;border-radius:50%;border:1px solid #fca5a5;background:#fff5f5;color:#ef4444;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;line-height:1">×</button>' +
      '</div>' +
    '</div>';
  }).join('');

  const addonsHTML = addons.map(function(a) {
    return '<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:10px 16px;gap:12px;border-bottom:1px solid var(--color-champagne)">' +
      '<div style="flex:1">' +
        '<span style="display:block;font-size:12px;font-weight:700;color:var(--color-araucaria)">' + a.name + '</span>' +
        '<span style="display:block;font-size:11px;color:var(--color-texto-suave);margin-top:2px">' + a.desc + '</span>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0">' +
        '<span style="font-family:var(--font-serif);font-weight:700;font-size:13px;color:var(--color-araucaria)">' + formatBRL(a.price) + '</span>' +
        '<button onclick="toggleAddon(\'' + a.id + '\'); renderCartModalContent();" title="Remover" style="width:22px;height:22px;border-radius:50%;border:1px solid #fca5a5;background:#fff5f5;color:#ef4444;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;line-height:1">×</button>' +
      '</div>' +
    '</div>';
  }).join('');

  const allPkgs = [...ROMANTIC_PACKAGES.namorar, ...ROMANTIC_PACKAGES.casar];
  const selectedPkgIds = packages.map(function(p) { return p.id; });
  const selectedAddonIds = addons.map(function(a) { return a.id; });

  const editPkgsHTML = allPkgs.map(function(p) {
    const isSelected = selectedPkgIds.includes(p.id);
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;gap:12px;border-bottom:1px solid var(--color-champagne)">' +
      '<div style="flex:1">' +
        '<span style="display:block;font-size:12px;font-weight:700;color:var(--color-araucaria)">' + p.name + '</span>' +
        '<span style="display:block;font-size:10px;color:var(--color-texto-suave);margin-top:1px">' + p.slogan + '</span>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0">' +
        '<span style="font-family:var(--font-serif);font-size:12px;font-weight:700;color:var(--color-araucaria)">' + formatBRL(p.price) + '</span>' +
        '<button onclick="togglePackage(\'' + p.id + '\'); renderCartModalContent();" style="padding:5px 12px;border-radius:20px;font-size:10px;font-weight:700;cursor:pointer;border:1px solid;transition:all 0.2s;background:' + (isSelected ? 'var(--color-araucaria)' : '#fff') + ';color:' + (isSelected ? '#fff' : 'var(--color-araucaria)') + ';border-color:var(--color-araucaria)">' +
          (isSelected ? '✓ Selecionado' : '+ Selecionar') +
        '</button>' +
      '</div>' +
    '</div>';
  }).join('');

  const editAddonsHTML = EXTRA_ADDONS.map(function(a) {
    const isSelected = selectedAddonIds.includes(a.id);
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;gap:12px;border-bottom:1px solid var(--color-champagne)">' +
      '<div style="flex:1">' +
        '<span style="display:block;font-size:12px;font-weight:700;color:var(--color-araucaria)">' + a.name + '</span>' +
        '<span style="display:block;font-size:10px;color:var(--color-texto-suave);margin-top:1px">' + a.desc + '</span>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0">' +
        '<span style="font-family:var(--font-serif);font-size:12px;font-weight:700;color:var(--color-araucaria)">' + formatBRL(a.price) + '</span>' +
        '<button onclick="toggleAddon(\'' + a.id + '\'); renderCartModalContent();" style="padding:5px 12px;border-radius:20px;font-size:10px;font-weight:700;cursor:pointer;border:1px solid;transition:all 0.2s;background:' + (isSelected ? 'var(--color-araucaria)' : '#fff') + ';color:' + (isSelected ? '#fff' : 'var(--color-araucaria)') + ';border-color:var(--color-araucaria)">' +
          (isSelected ? '✓ Adicionado' : '+ Adicionar') +
        '</button>' +
      '</div>' +
    '</div>';
  }).join('');

  const totalItens = packages.length + addons.length;
  const tabResumo = cartActiveTab === 'resumo';

  body.innerHTML =
    '<div style="display:flex;flex-direction:column;height:100vh">' +

    // Header com logo
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px;background:var(--color-araucaria-dark);border-bottom:1px solid rgba(203,185,139,0.3);flex-shrink:0">' +
      '<div style="display:flex;align-items:center;gap:12px">' +
        '<img src="assets/logo-round.png" alt="Morada" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:1px solid rgba(203,185,139,0.5);flex-shrink:0" />' +
        '<div>' +
          '<span style="display:block;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:var(--color-champagne);font-weight:700;line-height:1;margin-bottom:3px">Sua Reserva</span>' +
          '<span style="display:block;font-family:var(--font-serif);font-size:13px;color:#fff;font-weight:600">Morada Quintal da Serra</span>' +
        '</div>' +
      '</div>' +
      '<button onclick="closeCartModal()" style="width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.1);border:none;color:#fff;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:background 0.2s;flex-shrink:0" onmouseover="this.style.background=\'rgba(255,255,255,0.2)\'" onmouseout="this.style.background=\'rgba(255,255,255,0.1)\'">✕</button>' +
    '</div>' +

    // Abas: Resumo / Editar Reserva
    '<div style="display:flex;border-bottom:1px solid var(--color-champagne);flex-shrink:0;background:#fff">' +
      '<button onclick="setCartTab(\'resumo\')" style="flex:1;padding:12px 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;cursor:pointer;border:none;border-bottom:2px solid ' + (tabResumo ? 'var(--color-araucaria)' : 'transparent') + ';background:transparent;color:' + (tabResumo ? 'var(--color-araucaria)' : 'var(--color-texto-suave)') + ';transition:all 0.2s;font-family:var(--font-sans)">Resumo</button>' +
      '<button onclick="setCartTab(\'editar\')" style="flex:1;padding:12px 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;cursor:pointer;border:none;border-bottom:2px solid ' + (!tabResumo ? 'var(--color-araucaria)' : 'transparent') + ';background:transparent;color:' + (!tabResumo ? 'var(--color-araucaria)' : 'var(--color-texto-suave)') + ';transition:all 0.2s;font-family:var(--font-sans)">✏️ Editar Reserva' + (totalItens > 0 ? ' <span style="background:var(--color-araucaria);color:#fff;border-radius:20px;padding:1px 7px;font-size:9px;margin-left:4px">' + totalItens + '</span>' : '') + '</button>' +
    '</div>' +

    // Área de scroll
    '<div style="flex:1;overflow-y:auto;-ms-overflow-style:none;scrollbar-width:none;" id="cart-scroll-area">' +

    (tabResumo ?
      // ===== ABA RESUMO =====
      '<div style="padding:24px;display:flex;flex-direction:column;gap:20px">' +

        // Bloco: Hospedagem
        '<div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
            '<p style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;color:var(--color-araucaria);margin:0">Sua Estadia</p>' +
            '<button onclick="setCartTab(\'editar\')" style="font-size:10px;font-weight:700;color:var(--color-araucaria);background:none;border:none;cursor:pointer;text-decoration:underline">Editar datas →</button>' +
          '</div>' +
          '<div style="border-radius:12px;border:1px solid var(--color-champagne);background:#fff;overflow:hidden">' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:12px 16px;gap:12px;border-bottom:1px solid var(--color-champagne)">' +
              '<div>' +
                '<span style="display:block;font-size:12px;font-weight:700;color:var(--color-araucaria)">' + stayItem.title + '</span>' +
                '<span style="display:block;font-size:11px;font-weight:600;color:var(--color-araucaria);margin-top:4px">' + getStayDetailsString() + '</span>' +
              '</div>' +
              '<span style="font-family:var(--font-serif);font-weight:700;font-size:14px;color:var(--color-araucaria);flex-shrink:0">' + formatBRL(stayItem.price) + '</span>' +
            '</div>' +
            packagesHTML +
            addonsHTML +
            (packages.length === 0 && addons.length === 0 ?
              '<div style="margin:0;padding:14px 16px;background:linear-gradient(135deg,rgba(22,58,47,0.04) 0%,rgba(203,185,139,0.12) 100%);border-top:1px solid var(--color-champagne)">' +
                '<div style="display:flex;align-items:center;gap:12px">' +
                  '<div style="width:36px;height:36px;border-radius:50%;background:var(--color-araucaria);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px">✨</div>' +
                  '<div style="flex:1">' +
                    '<p style="font-size:11px;font-weight:700;color:var(--color-araucaria);margin:0 0 2px 0">Personalize sua experiência</p>' +
                    '<p style="font-size:10px;color:var(--color-texto-suave);margin:0">Pacotes românticos, cesta artesanal, kit lareira e muito mais.</p>' +
                  '</div>' +
                  '<button onclick="setCartTab(\'editar\')" style="flex-shrink:0;padding:7px 14px;border-radius:20px;background:var(--color-araucaria);color:#fff;border:none;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;cursor:pointer;font-family:var(--font-sans);white-space:nowrap">Ver extras</button>' +
                '</div>' +
              '</div>'
              : '') +
            '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:var(--color-creme)">' +
              '<span style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;color:var(--color-texto-suave)">Total</span>' +
              '<span style="font-family:var(--font-serif);font-weight:700;font-size:18px;color:var(--color-araucaria)">' + formatBRL(total) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // Bloco: Dados do Hóspede
        '<div>' +
          '<p style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;color:var(--color-araucaria);margin-bottom:10px">Dados do Hóspede Titular</p>' +
          '<div style="display:flex;flex-direction:column;gap:10px">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
              '<div><label style="display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--color-texto-suave);margin-bottom:4px">Nome Completo *</label>' +
              '<input type="text" id="guest-name" placeholder="Maria Silva" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--color-champagne);background:#fff;font-size:12px;font-family:var(--font-sans);box-sizing:border-box;outline:none" /></div>' +
              '<div><label style="display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--color-texto-suave);margin-bottom:4px">CPF *</label>' +
              '<input type="text" id="guest-cpf" placeholder="000.000.000-00" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--color-champagne);background:#fff;font-size:12px;font-family:var(--font-sans);box-sizing:border-box;outline:none" /></div>' +
            '</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
              '<div><label style="display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--color-texto-suave);margin-bottom:4px">WhatsApp *</label>' +
              '<input type="tel" id="guest-phone" placeholder="(48) 9 0000-0000" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--color-champagne);background:#fff;font-size:12px;font-family:var(--font-sans);box-sizing:border-box;outline:none" /></div>' +
              '<div><label style="display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--color-texto-suave);margin-bottom:4px">E-mail *</label>' +
              '<input type="email" id="guest-email" placeholder="email@exemplo.com" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--color-champagne);background:#fff;font-size:12px;font-family:var(--font-sans);box-sizing:border-box;outline:none" /></div>' +
            '</div>' +
            '<div><label style="display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--color-texto-suave);margin-bottom:4px">Observações (Opcional)</label>' +
            '<textarea id="guest-obs" rows="2" placeholder="Ex: Aniversário de namoro, pedido de casamento..." style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--color-champagne);background:#fff;font-size:12px;font-family:var(--font-sans);resize:none;box-sizing:border-box;outline:none"></textarea></div>' +
          '</div>' +
        '</div>' +

        // Bloco: Pagamento
        '<div>' +
          '<p style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;color:var(--color-araucaria);margin-bottom:10px">Método de Pagamento</p>' +
          '<select id="payment-dropdown" onchange="handlePaymentDropdown(this.value)" style="width:100%;padding:12px 36px 12px 16px;border-radius:12px;border:1px solid var(--color-champagne);background:#fff;font-size:12px;font-weight:600;color:var(--color-araucaria);appearance:none;cursor:pointer;margin-bottom:12px;font-family:var(--font-sans);box-sizing:border-box;background-image:url(\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%23163A2F%22><path fill-rule=%22evenodd%22 d=%22M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%22 clip-rule=%22evenodd%22/></svg>\');background-repeat:no-repeat;background-position:right 12px center;background-size:16px">' +
            '<option value="">Selecione o método de pagamento...</option>' +
            '<option value="pix">Pix — 50% na reserva + 50% até 24h antes do Check-in</option>' +
            '<option value="credito">Cartão de Crédito — Mercado Pago, até 4x sem juros</option>' +
          '</select>' +
          '<div id="payment-detail-box"></div>' +
        '</div>' +

      '</div>'

    :
      // ===== ABA EDITAR =====
      '<div style="padding:24px">' +

        '<p style="font-size:12px;font-weight:600;color:var(--color-araucaria);margin-bottom:16px">Altere datas, modalidade, pacotes e adicionais da sua reserva.</p>' +

        // Bloco: Modalidade & Datas
        '<div style="margin-bottom:24px;background:var(--color-creme);padding:16px;border-radius:12px;border:1px solid var(--color-champagne)">' +
          '<p style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;color:var(--color-araucaria);margin-bottom:12px">Modalidade & Datas</p>' +
          
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">' +
            '<button onclick="setServiceTypeInCart(\'pernoite\')" style="padding:8px 12px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid;font-family:var(--font-sans);background:' + (appState.serviceType === 'pernoite' ? 'var(--color-araucaria)' : '#fff') + ';color:' + (appState.serviceType === 'pernoite' ? '#fff' : 'var(--color-araucaria)') + ';border-color:var(--color-araucaria)">🌙 Hospedagem</button>' +
            '<button onclick="setServiceTypeInCart(\'dayuse\')" style="padding:8px 12px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid;font-family:var(--font-sans);background:' + (appState.serviceType === 'dayuse' ? 'var(--color-araucaria)' : '#fff') + ';color:' + (appState.serviceType === 'dayuse' ? '#fff' : 'var(--color-araucaria)') + ';border-color:var(--color-araucaria)">☀️ Day Use</button>' +
          '</div>' +

          '<div style="display:grid;grid-template-columns:' + (appState.serviceType === 'pernoite' ? '1fr 1fr' : '1fr') + ';gap:10px">' +
            '<div>' +
              '<label style="display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--color-texto-suave);margin-bottom:4px">Check-in (Entrada)</label>' +
              '<input type="date" value="' + appState.checkIn + '" onchange="setCheckInInCart(this.value)" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--color-champagne);background:#fff;font-size:12px;font-family:var(--font-sans);box-sizing:border-box" />' +
            '</div>' +
            (appState.serviceType === 'pernoite' ?
            '<div>' +
              '<label style="display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--color-texto-suave);margin-bottom:4px">Check-out (Saída)</label>' +
              '<input type="date" value="' + appState.checkOut + '" onchange="setCheckOutInCart(this.value)" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--color-champagne);background:#fff;font-size:12px;font-family:var(--font-sans);box-sizing:border-box" />' +
            '</div>' : '') +
          '</div>' +

          (appState.serviceType === 'pernoite' ?
          '<div style="margin-top:12px">' +
            '<div style="display:flex;justify-content:space-between;font-size:10px;font-weight:700;text-transform:uppercase;color:var(--color-texto-suave);margin-bottom:4px">' +
              '<span>Duração</span>' +
              '<span style="color:var(--color-araucaria);font-weight:700">' + appState.numNights + ' ' + (appState.numNights === 1 ? 'noite' : 'noites') + '</span>' +
            '</div>' +
            '<input type="range" min="1" max="7" value="' + appState.numNights + '" oninput="setNightsInCart(this.value)" style="width:100%;accent-color:var(--color-araucaria);cursor:pointer" />' +
          '</div>' : '') +

        '</div>' +

        // Pacotes
        '<div style="margin-bottom:24px">' +
          '<p style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;color:var(--color-araucaria);margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid var(--color-champagne)">Pacotes Românticos <span style="font-size:9px;font-weight:400;text-transform:none;color:var(--color-texto-suave)">(1 por reserva)</span></p>' +
          editPkgsHTML +
        '</div>' +

        // Adicionais
        '<div>' +
          '<p style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;color:var(--color-araucaria);margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid var(--color-champagne)">Adicionais & Conforto <span style="font-size:9px;font-weight:400;text-transform:none;color:var(--color-texto-suave)">(Combine quantos desejar)</span></p>' +
          editAddonsHTML +
        '</div>' +

        // Botão voltar ao resumo
        '<button onclick="setCartTab(\'resumo\')" style="width:100%;margin-top:20px;padding:14px;border-radius:12px;border:2px solid var(--color-araucaria);background:transparent;color:var(--color-araucaria);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;font-family:var(--font-sans)">← Concluir & Ver Resumo</button>' +

      '</div>'
    ) +

    '</div>' + // fim scroll area

    // Rodapé fixo
    '<div style="flex-shrink:0;padding:20px 24px;border-top:1px solid var(--color-champagne);background:var(--color-branco-quente)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
        '<span style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;color:var(--color-texto-suave)">Total da Reserva</span>' +
        '<span style="font-family:var(--font-serif);font-weight:700;font-size:22px;color:var(--color-araucaria)">' + formatBRL(total) + '</span>' +
      '</div>' +
      '<button onclick="processCheckout()" style="width:100%;display:flex;align-items:center;justify-content:center;gap:8px;background:var(--color-araucaria);color:#fff;border:none;border-radius:12px;padding:16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;cursor:pointer;font-family:var(--font-sans);margin-bottom:10px" onmouseover="this.style.background=\'var(--color-araucaria-light)\'" onmouseout="this.style.background=\'var(--color-araucaria)\'">' +
        '<svg style="width:16px;height:16px;flex-shrink:0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
        'Enviar Reserva via WhatsApp' +
      '</button>' +
      '<p style="text-align:center;font-size:10px;color:var(--color-texto-suave)">Você será redirecionado para confirmar com a equipe.</p>' +
    '</div>' +

  '</div>';

  handlePaymentDropdown('');
}

function handlePaymentDropdown(value) {
  const box = document.getElementById('payment-detail-box');
  if (!box) return;
  const total = appState.cart.total;

  if (value === 'pix') {
    const metade = total / 2;
    box.innerHTML =
      '<div style="border-radius:12px;border:1px solid #a7f3d0;background:#ecfdf5;padding:16px">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">' +
          '<span style="font-size:16px">💚</span>' +
          '<span style="font-size:12px;font-weight:700;color:#065f46">Pix em 2 momentos</span>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">' +
          '<div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:#047857">1ª — na confirmação da reserva</span><span style="font-weight:700;font-family:var(--font-serif);color:#065f46">' + formatBRL(metade) + '</span></div>' +
          '<div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:#047857">2ª — até 24h antes do Check-in</span><span style="font-weight:700;font-family:var(--font-serif);color:#065f46">' + formatBRL(metade) + '</span></div>' +
        '</div>' +
        '<div style="padding-top:12px;border-top:1px solid #a7f3d0">' +
          '<p style="font-size:11px;color:#047857">Chave Pix: <span style="font-family:monospace;font-weight:700;user-select:all">48991882991</span></p>' +
          '<p style="font-size:10px;color:#059669;margin-top:2px">Morada Quintal da Serra</p>' +
        '</div>' +
      '</div>';
  } else if (value === 'credito') {
    box.innerHTML =
      '<div style="border-radius:12px;border:1px solid var(--color-champagne);background:var(--color-creme);padding:16px">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">' +
          '<span style="font-size:16px">💳</span>' +
          '<span style="font-size:12px;font-weight:700;color:var(--color-araucaria)">Mercado Pago — sem juros até 4x</span>' +
        '</div>' +
        '<div style="border-top:1px solid var(--color-champagne)">' +
          '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--color-champagne);font-size:12px"><span style="color:var(--color-texto-suave)">1x</span><span style="font-weight:700;font-family:var(--font-serif);color:var(--color-araucaria)">' + formatBRL(total) + '</span></div>' +
          '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--color-champagne);font-size:12px"><span style="color:var(--color-texto-suave)">2x sem juros</span><span style="font-weight:700;font-family:var(--font-serif);color:var(--color-araucaria)">2x ' + formatBRL(total/2) + '</span></div>' +
          '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--color-champagne);font-size:12px"><span style="color:var(--color-texto-suave)">3x sem juros</span><span style="font-weight:700;font-family:var(--font-serif);color:var(--color-araucaria)">3x ' + formatBRL(total/3) + '</span></div>' +
          '<div style="display:flex;justify-content:space-between;padding:8px 0;font-size:12px"><span style="color:var(--color-texto-suave)">4x sem juros</span><span style="font-weight:700;font-family:var(--font-serif);color:var(--color-araucaria)">4x ' + formatBRL(total/4) + '</span></div>' +
        '</div>' +
        '<p style="font-size:10px;color:var(--color-texto-suave);margin-top:10px">Link de pagamento enviado após confirmação no WhatsApp.</p>' +
      '</div>';
  } else {
    box.innerHTML = '';
  }
}

function processCheckout() {
  const name = document.getElementById('guest-name')?.value.trim();
  const phone = document.getElementById('guest-phone')?.value.trim();
  const cpf = document.getElementById('guest-cpf')?.value.trim();
  const email = document.getElementById('guest-email')?.value.trim();
  const obs = document.getElementById('guest-obs')?.value.trim();
  const payMethod = document.getElementById('payment-dropdown')?.value;

  if (!name || !phone) {
    alert('Por favor, preencha o Nome Completo e o WhatsApp para continuar.');
    return;
  }
  if (!payMethod) {
    alert('Por favor, selecione um método de pagamento.');
    return;
  }

  const payLabel = payMethod === 'pix'
    ? 'Pix (50% na reserva + 50% até 24h antes do Check-in)'
    : 'Cartão de Crédito — Mercado Pago, até 4x sem juros';

  const checkIn = formatDateBR(appState.checkIn);
  const checkOut = formatDateBR(appState.checkOut);
  const nights = appState.numNights;
  const guests = appState.guestsCount;

  var lines = [];
  lines.push('*NOVA RESERVA — MORADA QUINTAL DA SERRA*');
  lines.push('');
  lines.push('------------------------------------');
  lines.push('*DADOS DO HÓSPEDE*');
  lines.push('------------------------------------');
  lines.push('Nome: ' + name);
  lines.push('WhatsApp: ' + phone);
  if (cpf) lines.push('CPF: ' + cpf);
  if (email) lines.push('E-mail: ' + email);
  if (obs) lines.push('Obs: ' + obs);
  lines.push('');
  lines.push('------------------------------------');
  lines.push('*DETALHES DA ESTADIA*');
  lines.push('------------------------------------');
  lines.push('Modalidade: ' + appState.cart.stayItem.title);
  if (appState.serviceType === 'pernoite') {
    lines.push('Check-in: ' + checkIn);
    lines.push('Check-out: ' + checkOut);
    lines.push('Noites: ' + nights + ' | Hóspedes: ' + guests);
  } else {
    lines.push('Data: ' + checkIn + ' (09h às 18h)');
    lines.push('Hóspedes: ' + guests);
  }

  if (appState.cart.packages.length > 0) {
    lines.push('');
    lines.push('*PACOTES ESPECIAIS*');
    appState.cart.packages.forEach(function(p) {
      lines.push('  - ' + p.name + '  ' + formatBRL(p.price));
    });
  }

  if (appState.cart.addons.length > 0) {
    lines.push('');
    lines.push('*ADICIONAIS*');
    appState.cart.addons.forEach(function(a) {
      lines.push('  - ' + a.name + '  ' + formatBRL(a.price));
    });
  }

  lines.push('');
  lines.push('------------------------------------');
  lines.push('*PAGAMENTO*');
  lines.push('------------------------------------');
  lines.push('Total: *' + formatBRL(appState.cart.total) + '*');
  lines.push('Forma: ' + payLabel);
  lines.push('');
  lines.push('Aguardo confirmação!');

  var msg = lines.join('\n');

  window.open('https://wa.me/5548991882991?text=' + encodeURIComponent(msg), '_blank');
  closeCartModal();
}


// Lightbox Gallery State & Navigation System
let lightboxImagesList = [];
let currentLightboxIndex = 0;

function openLightbox(imgSrc, customImagesArray = null) {
  const modal = document.getElementById('gallery-modal');
  const imgEl = document.getElementById('lightbox-img');

  if (!modal || !imgEl) return;

  // Build gallery array from page if not provided
  if (customImagesArray && Array.isArray(customImagesArray)) {
    lightboxImagesList = customImagesArray;
  } else {
    // Gather all gallery & structure image sources on page
    const allGalleryImgs = Array.from(document.querySelectorAll('#galeria .gallery-item img, #estrutura-slider-container img'));
    const srcs = allGalleryImgs.map(img => img.src).filter(src => src && !src.includes('undefined') && src.length > 5);
    lightboxImagesList = Array.from(new Set(srcs));
  }

  // Find index of clicked image
  let foundIdx = lightboxImagesList.findIndex(src => src === imgSrc || (typeof imgSrc === 'string' && src.endsWith(imgSrc)));
  if (foundIdx === -1) {
    if (imgSrc) lightboxImagesList.unshift(imgSrc);
    foundIdx = 0;
  }
  
  currentLightboxIndex = foundIdx;
  imgEl.src = lightboxImagesList[currentLightboxIndex];
  imgEl.style.opacity = '1';
  modal.classList.add('active');

  // Listen for keyboard events (Left Arrow, Right Arrow, Escape)
  document.addEventListener('keydown', handleLightboxKeyboard);
}

function closeLightbox() {
  const modal = document.getElementById('gallery-modal');
  if (modal) modal.classList.remove('active');
  document.removeEventListener('keydown', handleLightboxKeyboard);
}

function prevLightboxImage(event) {
  if (event) event.stopPropagation();
  if (!lightboxImagesList.length) return;
  
  currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImagesList.length) % lightboxImagesList.length;
  updateLightboxImage();
}

function nextLightboxImage(event) {
  if (event) event.stopPropagation();
  if (!lightboxImagesList.length) return;

  currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImagesList.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const imgEl = document.getElementById('lightbox-img');
  if (imgEl && lightboxImagesList[currentLightboxIndex]) {
    imgEl.style.opacity = '0.4';
    setTimeout(() => {
      imgEl.src = lightboxImagesList[currentLightboxIndex];
      imgEl.style.opacity = '1';
    }, 60);
  }
}

function handleLightboxKeyboard(e) {
  const modal = document.getElementById('gallery-modal');
  if (!modal || !modal.classList.contains('active')) return;

  if (e.key === 'ArrowLeft') {
    prevLightboxImage(e);
  } else if (e.key === 'ArrowRight') {
    nextLightboxImage(e);
  } else if (e.key === 'Escape') {
    closeLightbox();
  }
}

function openGuestGuideModal() {
  const modal = document.getElementById('guest-guide-modal');
  if (modal) modal.classList.add('active');
}

function closeGuestGuideModal() {
  const modal = document.getElementById('guest-guide-modal');
  if (modal) modal.classList.remove('active');
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}

// Header Dynamic Transition: Transparent Top State vs GREEN Scrolled State + Auto-Hide on Scroll Down / Reappear on Scroll UP
function initHeaderScrollAnimation() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeaderState = () => {
    const currentScrollY = window.scrollY;

    // 1. Top of Page State (scrollY <= 50): Transparent BG & Pure White Text
    if (currentScrollY <= 50) {
      header.classList.add('header-transparent');
      header.classList.remove('header-scrolled');
      header.style.transform = 'translateY(0)';
    } 
    // 2. Scrolled Down (scrollY > 50): GREEN BG (Verde Araucária)
    else {
      header.classList.remove('header-transparent');
      header.classList.add('header-scrolled');

      // Hide header when scrolling DOWN (past 80px)
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        header.style.transform = 'translateY(-110%)';
      } 
      // Reappear smoothly with GREEN background when scrolling UP
      else if (currentScrollY < lastScrollY) {
        header.style.transform = 'translateY(0)';
      }
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  // Set initial state on page load
  updateHeaderState();

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  }, { passive: true });
}

// Toggle Full 42-Photo Gallery Visibility
function toggleFullGallery() {
  const hiddenItems = document.querySelectorAll('.hidden-gallery-item');
  const btn = document.getElementById('btn-toggle-gallery');
  
  if (!hiddenItems.length) return;

  let isExpanding = hiddenItems[0].classList.contains('hidden');

  hiddenItems.forEach(el => {
    if (isExpanding) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  if (btn) {
    btn.innerHTML = isExpanding ? '▲ Mostrar Menos Fotos' : '✨ Ver Todas as 42 Fotos da Galeria';
  }
}

// Randomized Auto-Rotating Background Slider for Hero (Changes every 3.5s)
function initHeroRandomSlider() {
  const HERO_HOME_IMAGES = [
    'assets/images/Escolhas/Home/C110E2FB-EAE4-47FE-A391-8D42EAD1D710.jpeg',
    'assets/images/Escolhas/Home/DJI_20260505153651_0104_D.jpeg',
    'assets/images/Escolhas/Home/IMG_3526.jpeg',
    'assets/images/Escolhas/Home/IMG_6442.jpeg',
    'assets/images/Escolhas/Home/P1071337.jpeg',
    'assets/images/Escolhas/Home/P1071343(1).jpeg',
    'assets/images/Escolhas/Home/P1071514.jpeg',
    'assets/images/Escolhas/Home/P1071579.jpeg'
  ];

  const img1 = document.getElementById('hero-bg-img-1');
  const img2 = document.getElementById('hero-bg-img-2');

  if (!img1 || !img2) return;

  // Shuffle images array randomly so the sequence is fresh on every visit
  let shuffled = [...HERO_HOME_IMAGES].sort(() => 0.5 - Math.random());
  let index = 0;
  let activeImg = 1;

  // Set initial random image
  img1.src = shuffled[index];
  img1.style.opacity = '1';
  img2.style.opacity = '0';

  // Preload all images in memory for instant smooth crossfades
  shuffled.forEach(src => {
    const pre = new Image();
    pre.src = src;
  });

  // Change image every 3.5 seconds (3500 ms)
  setInterval(() => {
    index = (index + 1) % shuffled.length;
    const nextSrc = shuffled[index];

    if (activeImg === 1) {
      img2.src = nextSrc;
      img2.style.opacity = '1';
      img1.style.opacity = '0';
      activeImg = 2;
    } else {
      img1.src = nextSrc;
      img1.style.opacity = '1';
      img2.style.opacity = '0';
      activeImg = 1;
    }
  }, 3000);
}

// Structure / Nature Section Random Slider & Lightbox Handler
let currentStructureSrc = 'assets/images/Escolhas/Estrutura/IMG_3530.jpeg';

function handleStructureClick() {
  openLightbox(currentStructureSrc);
}

function initStructureRandomSlider() {
  const ESTRUTURA_IMAGES = [
    'assets/images/Escolhas/Estrutura/IMG_3530.jpeg',
    'assets/images/Escolhas/Estrutura/IMG_3545.jpeg',
    'assets/images/Escolhas/Estrutura/IMG_3549.jpeg',
    'assets/images/Escolhas/Estrutura/IMG_3551.jpeg',
    'assets/images/Escolhas/Estrutura/IMG_3553.jpeg',
    'assets/images/Escolhas/Estrutura/IMG_4043.jpeg',
    'assets/images/Escolhas/Estrutura/P1071293.jpeg',
    'assets/images/Escolhas/Estrutura/P1071294.jpeg',
    'assets/images/Escolhas/Estrutura/P1071299.jpeg',
    'assets/images/Escolhas/Estrutura/P1071300.jpeg',
    'assets/images/Escolhas/Estrutura/P1071302.jpeg',
    'assets/images/Escolhas/Estrutura/P1071304.jpeg',
    'assets/images/Escolhas/Estrutura/P1071305.jpeg',
    'assets/images/Escolhas/Estrutura/P1071306.jpeg',
    'assets/images/Escolhas/Estrutura/P1071309.jpeg',
    'assets/images/Escolhas/Estrutura/P1071316.jpeg',
    'assets/images/Escolhas/Estrutura/P1071317.jpeg'
  ];

  const img1 = document.getElementById('estrutura-bg-img-1');
  const img2 = document.getElementById('estrutura-bg-img-2');

  if (!img1 || !img2) return;

  // Shuffle images array randomly
  let shuffled = [...ESTRUTURA_IMAGES].sort(() => 0.5 - Math.random());
  let index = 0;
  let activeImg = 1;

  // Set initial random image
  currentStructureSrc = shuffled[index];
  img1.src = currentStructureSrc;
  img1.style.opacity = '1';
  img2.style.opacity = '0';

  // Preload all 17 structure images for instant smooth crossfades
  shuffled.forEach(src => {
    const pre = new Image();
    pre.src = src;
  });

  // Change image every 3.5 seconds
  setInterval(() => {
    index = (index + 1) % shuffled.length;
    const nextSrc = shuffled[index];
    currentStructureSrc = nextSrc;

    if (activeImg === 1) {
      img2.src = nextSrc;
      img2.style.opacity = '1';
      img1.style.opacity = '0';
      activeImg = 2;
    } else {
      img1.src = nextSrc;
      img1.style.opacity = '1';
      img2.style.opacity = '0';
      activeImg = 1;
    }
  }, 3000);
}

// Custom Luxury Mouse Cursor (Tamanho Fixo e Elegante)
function initCustomCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  const render = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}

// Horizontal Dark Green Curtain Banner Reveal (Verde Escuro do Rodapé)
function initBannerCurtainReveals() {
  const banners = document.querySelectorAll('.section-banner-canyons');
  
  banners.forEach(banner => {
    banner.classList.add('banner-reveal-container');
    
    const greenCurtain = document.createElement('div');
    greenCurtain.className = 'banner-green-curtain';
    banner.appendChild(greenCurtain);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('banner-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  banners.forEach(b => observer.observe(b));
}

// Mobile Menu Navigation Drawer Controls
function toggleMobileMenu() {
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  if (!drawer || !backdrop) return;
  const isOpen = drawer.classList.contains('translate-x-0');
  if (isOpen) {
    closeMobileMenu();
  } else {
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100');
  }
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  if (drawer) {
    drawer.classList.remove('translate-x-0');
    drawer.classList.add('translate-x-full');
  }
  if (backdrop) {
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
  }
}

