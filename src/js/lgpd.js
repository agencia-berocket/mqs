/**
 * MORADA QUINTAL DA SERRA — GESTÃO DE COOKIES & LGPD (Lei 13.709/2018)
 * Script simples, prático e em conformidade para coleta e gestão de consentimento.
 */

document.addEventListener('DOMContentLoaded', function() {
  initLGPDBanner();
});

/**
 * Inicializar o Banner de Consentimento de Cookies caso ainda não respondido
 */
function initLGPDBanner() {
  const consent = localStorage.getItem('morada_lgpd_consent');
  if (!consent) {
    injectLGPDBannerHTML();
  }
}

/**
 * Injetar HTML do Banner Flutuante no Rodapé da Página
 */
function injectLGPDBannerHTML() {
  if (document.getElementById('morada-lgpd-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'morada-lgpd-banner';
  banner.className = 'fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50 p-5 rounded-2xl bg-[var(--color-araucaria-dark)] text-white border border-[var(--color-champagne)]/40 shadow-2xl backdrop-blur-md space-y-4 animate-fade-in';
  
  banner.innerHTML = `
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="text-lg">🍪</span>
        <h4 class="font-serif font-bold text-sm text-[var(--color-champagne)] uppercase tracking-wider">Privacidade & Cookies</h4>
      </div>
      <button onclick="closeLGPDBanner()" class="text-xs text-gray-400 hover:text-white font-bold p-1">✕</button>
    </div>

    <p class="text-xs text-gray-200 font-light leading-relaxed">
      Utilizamos cookies essenciais para o funcionamento do site e cálculo de reservas, além de ferramentas de análise para aprimorar sua experiência, em conformidade com a <strong>LGPD (Lei 13.709/2018)</strong>.
    </p>

    <div class="flex flex-col sm:flex-row items-center gap-2 pt-1">
      <button onclick="acceptAllCookies()" class="w-full sm:w-auto flex-1 btn-araucaria !bg-[var(--color-champagne)] !text-[var(--color-araucaria-dark)] hover:!bg-white py-2.5 text-[11px] font-bold uppercase tracking-wider shadow-sm">
        Aceitar Todos
      </button>
      <button onclick="acceptEssentialCookies()" class="w-full sm:w-auto py-2.5 px-3 rounded-xl border border-[var(--color-champagne)]/50 text-[11px] font-bold text-[var(--color-champagne-light)] hover:bg-white/10 transition-colors uppercase tracking-wider">
        Apenas Essenciais
      </button>
    </div>

    <div class="pt-2 border-t border-[rgba(203,185,139,0.2)] flex justify-between items-center text-[10px] text-gray-400 font-light">
      <a href="politica-privacidade.html" class="underline hover:text-[var(--color-champagne)]">Leia nossa Política de Privacidade</a>
      <span>Morada LGPD</span>
    </div>
  `;

  document.body.appendChild(banner);
}

/**
 * Aceitar Todos os Cookies
 */
function acceptAllCookies() {
  const consentData = {
    essential: true,
    analytics: true,
    marketing: true,
    acceptedAt: new Date().toISOString()
  };
  localStorage.setItem('morada_lgpd_consent', JSON.stringify(consentData));
  closeLGPDBanner();
}

/**
 * Aceitar Apenas Cookies Essenciais
 */
function acceptEssentialCookies() {
  const consentData = {
    essential: true,
    analytics: false,
    marketing: false,
    acceptedAt: new Date().toISOString()
  };
  localStorage.setItem('morada_lgpd_consent', JSON.stringify(consentData));
  closeLGPDBanner();
}

/**
 * Fechar/Remover Banner da Tela
 */
function closeLGPDBanner() {
  const banner = document.getElementById('morada-lgpd-banner');
  if (banner) {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(20px)';
    banner.style.transition = 'all 0.3s ease';
    setTimeout(() => banner.remove(), 300);
  }
}

/**
 * Abrir Preferências de Cookies (Disparado pelo Rodapé)
 */
function openCookiePreferences() {
  localStorage.removeItem('morada_lgpd_consent');
  injectLGPDBannerHTML();
}
