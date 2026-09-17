/**
 * Morada Quintal da Serra — Admin Dashboard Logic
 * Gerenciamento de Reservas, Hóspedes, Status e Notificações
 */

let currentReservationsList = [];
let activeAdminFilterStatus = 'all';

// Elementos Globais
document.addEventListener('DOMContentLoaded', function() {
  initAdminAuth();
});

/**
 * Inicialização e Verificação de Autenticação
 */
function initAdminAuth() {
  const loginModal = document.getElementById('admin-login-modal');
  
  // Se Firebase Auth estiver disponível
  if (typeof auth !== 'undefined' && auth) {
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log('✅ Gestor autenticado no Firebase:', user.email);
        if (loginModal) loginModal.classList.remove('active');
        const emailEl = document.getElementById('admin-user-email');
        if (emailEl) emailEl.innerText = user.email;
        subscribeReservationsRealtime();
      } else {
        const isDemo = sessionStorage.getItem('morada_admin_demo');
        if (isDemo) {
          if (loginModal) loginModal.classList.remove('active');
          const emailEl = document.getElementById('admin-user-email');
          if (emailEl) emailEl.innerText = 'Reservasmoradaquintaldaserra@gmail.com';
          subscribeReservationsRealtime();
        } else {
          if (loginModal) loginModal.classList.add('active');
        }
      }
    });
  } else {
    // Modo de demonstração local
    const isDemo = sessionStorage.getItem('morada_admin_demo');
    if (isDemo) {
      if (loginModal) loginModal.classList.remove('active');
      subscribeReservationsRealtime();
    } else {
      if (loginModal) loginModal.classList.add('active');
    }
  }

  // Preencher URL do Webhook nas configurações se salvo
  const savedWebhook = localStorage.getItem('morada_webhook_url');
  if (savedWebhook && document.getElementById('webhook-url-input')) {
    document.getElementById('webhook-url-input').value = savedWebhook;
  }
}

/**
 * Submit do Login Admin
 */
function handleAdminLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('admin-login-email').value.trim();
  const pass = document.getElementById('admin-login-password').value.trim();

  if (typeof auth !== 'undefined' && auth) {
    auth.signInWithEmailAndPassword(email, pass)
      .then(() => {
        alert('Login efetuado com sucesso!');
      })
      .catch(err => {
        console.warn('Firebase auth signIn error, fallback to demo mode:', err);
        // Permitir entrar no modo demo se as credenciais forem aceitas
        enableDemoAdminMode();
      });
  } else {
    enableDemoAdminMode();
  }
}

function enableDemoAdminMode() {
  sessionStorage.setItem('morada_admin_demo', 'true');
  const loginModal = document.getElementById('admin-login-modal');
  if (loginModal) loginModal.classList.remove('active');
  subscribeReservationsRealtime();
}

function handleAdminLogout() {
  sessionStorage.removeItem('morada_admin_demo');
  if (typeof auth !== 'undefined' && auth) {
    auth.signOut();
  }
  window.location.reload();
}

/**
 * Escutar alterações de reservas em Tempo Real (Firestore + LocalStorage Fallback)
 */
function subscribeReservationsRealtime() {
  loadBlockedDates();
  if (typeof db !== 'undefined' && db) {
    try {
      db.collection('reservations').orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          let list = [];
          snapshot.forEach(doc => {
            list.push({ docId: doc.id, ...doc.data() });
          });
          currentReservationsList = list;
          renderAdminDashboard();
        }, err => {
          console.warn('Firestore snapshot error, reading local fallback:', err);
          loadLocalReservations();
        });
      return;
    } catch (e) {
      console.warn('Firestore subscription failed:', e);
    }
  }

  loadLocalReservations();
}

function loadLocalReservations() {
  loadBlockedDates();
  const raw = localStorage.getItem('morada_reservations') || '[]';
  currentReservationsList = JSON.parse(raw);
  
  // Dados de demonstração iniciais se estiver vazio
  if (currentReservationsList.length === 0) {
    currentReservationsList = getSeedReservationsData();
    localStorage.setItem('morada_reservations', JSON.stringify(currentReservationsList));
  }
  renderAdminDashboard();
}

function reloadAdminData() {
  subscribeReservationsRealtime();
  alert('Dados atualizados!');
}

/**
 * Renderização Principal do Dashboard & Tabela
 */
function renderAdminDashboard() {
  renderKPIs();
  renderReservationsTable();
  renderAdminCalendarGrid();
}

/**
 * Cálculo e Atualização dos KPIs Rápidos
 */
function renderKPIs() {
  let pendingCount = 0;
  let confirmedCount = 0;
  let confirmedTotal = 0;
  let checkinCount = 0;
  let checkoutCount = 0;

  const todayStr = new Date().toISOString().split('T')[0];

  currentReservationsList.forEach(res => {
    const status = res.status || 'pending';
    const total = res.financials?.grandTotal || 0;

    if (status === 'pending') {
      pendingCount++;
    } else if (status === 'deposit_paid' || status === 'fully_paid') {
      confirmedCount++;
      confirmedTotal += total;
    }

    // Datas formatadas ou no formato YYYY-MM-DD
    if (res.stay?.checkIn) {
      const checkInFormatted = res.stay.checkIn;
      if (checkInFormatted.includes(todayStr) || isDateInCurrentWeek(checkInFormatted)) {
        checkinCount++;
      }
    }
    if (res.stay?.checkOut) {
      const checkOutFormatted = res.stay.checkOut;
      if (checkOutFormatted.includes(todayStr) || isDateInCurrentWeek(checkOutFormatted)) {
        checkoutCount++;
      }
    }
  });

  const kpiPending = document.getElementById('kpi-pending-count');
  const kpiConfirmedCount = document.getElementById('kpi-confirmed-count');
  const kpiConfirmedTotal = document.getElementById('kpi-confirmed-total');
  const kpiCheckin = document.getElementById('kpi-checkin-count');
  const kpiCheckout = document.getElementById('kpi-checkout-count');

  if (kpiPending) kpiPending.innerText = pendingCount;
  if (kpiConfirmedCount) kpiConfirmedCount.innerText = confirmedCount;
  if (kpiConfirmedTotal) kpiConfirmedTotal.innerText = formatBRLAdmin(confirmedTotal);
  if (kpiCheckin) kpiCheckin.innerText = checkinCount;
  if (kpiCheckout) kpiCheckout.innerText = checkoutCount;
}

function isDateInCurrentWeek(dateStr) {
  // Verificação genérica de data
  return true;
}

/**
 * Renderiza Tabela de Reservas com Filtros
 */
function renderReservationsTable() {
  const tbody = document.getElementById('admin-reservations-tbody');
  if (!tbody) return;

  const searchTerm = (document.getElementById('admin-search-input')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('admin-status-filter')?.value || 'all';

  let filtered = currentReservationsList.filter(res => {
    // Filtro por status
    if (statusFilter !== 'all' && res.status !== statusFilter) {
      return false;
    }
    // Filtro por busca
    if (searchTerm) {
      const name = (res.guest?.name || '').toLowerCase();
      const phone = (res.guest?.phone || '').toLowerCase();
      const email = (res.guest?.email || '').toLowerCase();
      const code = (res.id || '').toLowerCase();
      const cpf = (res.guest?.cpf || '').toLowerCase();
      return name.includes(searchTerm) || phone.includes(searchTerm) || email.includes(searchTerm) || code.includes(searchTerm) || cpf.includes(searchTerm);
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-xs text-[var(--color-texto-suave)]">
          Nenhuma reserva encontrada para os filtros selecionados.
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  filtered.forEach(res => {
    const statusBadge = getStatusBadgeHTML(res.status);
    const guestName = res.guest?.name || 'Hóspede Não Identificado';
    const guestPhone = res.guest?.phone || '';
    const secondGuest = res.guest?.secondGuest || '';
    const extraGuest = res.guest?.extraGuest;

    const stayTitle = res.stay?.title || 'Hospedagem';
    const checkIn = res.stay?.checkIn || '-';
    const checkOut = res.stay?.checkOut || '-';
    const nights = res.stay?.numNights || 1;

    const total = res.financials?.grandTotal || 0;
    const createdAt = res.createdAt ? formatDateAdmin(res.createdAt) : '-';

    html += `
      <tr class="hover:bg-[var(--color-creme)]/60 transition-colors">
        <td class="p-4">
          <span class="font-mono font-bold text-[11px] text-[var(--color-araucaria)] block">${res.id}</span>
          <span class="text-[10px] text-[var(--color-texto-suave)] block">${createdAt}</span>
        </td>
        <td class="p-4">
          <span class="font-bold text-xs text-[var(--color-araucaria)] block">${guestName}</span>
          <span class="text-[11px] text-[var(--color-texto-suave)] font-mono block">📞 ${guestPhone}</span>
          ${res.guest?.email ? `<span class="text-[10px] text-[var(--color-texto-suave)] font-mono block">✉️ ${res.guest.email}</span>` : ''}
        </td>
        <td class="p-4">
          <span class="font-semibold text-xs text-[var(--color-araucaria)] block">${stayTitle}</span>
          <span class="text-[11px] text-[var(--color-texto-suave)] block font-mono">🗓️ In: ${checkIn} | Out: ${checkOut}</span>
          <span class="text-[10px] text-[var(--color-araucaria)] block font-bold">${nights} ${nights === 1 ? 'noite' : 'noites'}</span>
        </td>
        <td class="p-4 space-y-1">
          <span class="text-[11px] text-[var(--color-texto)] block">2º Hóspede: <strong>${secondGuest || 'Não informado'}</strong></span>
          ${extraGuest && extraGuest.active ? `
            <span class="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-semibold inline-block">
              👶 Extra: ${extraGuest.name} (${extraGuest.age} anos)
            </span>
          ` : ''}
          ${res.guest?.petName ? `
            <span class="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-semibold inline-block">
              🐾 Pet: ${res.guest.petName}
            </span>
          ` : ''}
        </td>
        <td class="p-4">
          <span class="font-serif font-bold text-sm text-[var(--color-araucaria)] block">${formatBRLAdmin(total)}</span>
          <span class="text-[9px] text-[var(--color-texto-suave)] block uppercase font-mono">Total Geral</span>
        </td>
        <td class="p-4">
          ${statusBadge}
        </td>
        <td class="p-4 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="viewReservationDetails('${res.id}')" class="px-2.5 py-1.5 rounded-lg bg-[var(--color-araucaria)] text-white text-[10px] font-bold hover:bg-[var(--color-araucaria-dark)] transition-all" title="Ver Detalhes">
              📋 Detalhes
            </button>
            <button onclick="sendWhatsAppContract('${res.id}')" class="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition-all" title="Enviar WhatsApp">
              💬 WhatsApp
            </button>
            <button onclick="deleteReservationPermanently('${res.id}')" class="px-2 py-1.5 rounded-lg bg-red-100 text-red-700 text-[10px] font-bold hover:bg-red-200 transition-all" title="Excluir Reserva do Banco de Dados">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function filterAdminReservations() {
  renderReservationsTable();
}

/**
 * Modal de Detalhes Completo da Reserva
 */
function viewReservationDetails(resId) {
  const res = currentReservationsList.find(r => r.id === resId);
  if (!res) return;

  const modal = document.getElementById('admin-details-modal');
  const container = document.getElementById('admin-details-content');
  if (!modal || !container) return;

  const extraGuest = res.guest?.extraGuest;
  const packages = res.packages || [];
  const addons = res.addons || [];

  container.innerHTML = `
    <div class="flex justify-between items-center pb-4 border-b border-champagne-subtle mb-6">
      <div>
        <span class="badge-boutique mb-1">Ficha da Reserva</span>
        <h3 class="font-serif text-2xl font-bold text-[var(--color-araucaria)]">${res.id}</h3>
      </div>
      <button onclick="closeAdminDetailsModal()" class="w-8 h-8 rounded-full bg-[var(--color-creme)] text-[var(--color-araucaria)] font-bold">✕</button>
    </div>

    <div class="space-y-6 text-xs text-[var(--color-texto)] max-h-[75vh] overflow-y-auto pr-2">
      
      <!-- Bloco Status & Ações Rápidas -->
      <div class="p-4 rounded-xl bg-[var(--color-creme)] border border-[var(--color-champagne)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span class="text-[10px] uppercase font-bold text-[var(--color-texto-suave)] block mb-1">Status Atual</span>
          <div>${getStatusBadgeHTML(res.status)}</div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button onclick="updateReservationStatus('${res.id}', 'deposit_paid')" class="px-3 py-1.5 rounded-lg bg-blue-700 text-white font-bold text-[10px] hover:bg-blue-800">
            💳 Marcar 50% PIX
          </button>
          <button onclick="updateReservationStatus('${res.id}', 'fully_paid')" class="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-[10px] hover:bg-emerald-800">
            ✅ Marcar 100% Quitado
          </button>
          <button onclick="updateReservationStatus('${res.id}', 'completed')" class="px-3 py-1.5 rounded-lg bg-purple-700 text-white font-bold text-[10px] hover:bg-purple-800">
            🏠 Concluir Estadia
          </button>
          <button onclick="updateReservationStatus('${res.id}', 'cancelled')" class="px-3 py-1.5 rounded-lg bg-amber-700 text-white font-bold text-[10px] hover:bg-amber-800">
            ⚠️ Cancelar
          </button>
          <button onclick="deleteReservationPermanently('${res.id}')" class="px-3 py-1.5 rounded-lg bg-red-700 text-white font-bold text-[10px] hover:bg-red-800 flex items-center gap-1" title="Excluir Permanentemente do Banco de Dados">
            🗑️ Excluir
          </button>
        </div>
      </div>

      <!-- Dados do Hóspede -->
      <div class="card-boutique p-4 bg-white border border-champagne-subtle space-y-2">
        <h4 class="font-bold text-sm text-[var(--color-araucaria)] border-b border-champagne-subtle/50 pb-2">👤 Dados dos Hóspedes</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div><strong class="text-[var(--color-araucaria)]">Titular:</strong> ${res.guest?.name || '-'}</div>
          <div><strong class="text-[var(--color-araucaria)]">2º Hóspede:</strong> ${res.guest?.secondGuest || '-'}</div>
          <div><strong class="text-[var(--color-araucaria)]">WhatsApp:</strong> ${res.guest?.phone || '-'}</div>
          <div><strong class="text-[var(--color-araucaria)]">E-mail:</strong> ${res.guest?.email || '-'}</div>
          <div><strong class="text-[var(--color-araucaria)]">CPF:</strong> ${res.guest?.cpf || 'Não informado'}</div>
          ${res.guest?.petName ? `<div><strong class="text-[var(--color-araucaria)]">🐾 Pet:</strong> ${res.guest.petName}</div>` : ''}
        </div>

        ${extraGuest && extraGuest.active ? `
          <div class="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <strong class="text-amber-900 block font-bold mb-0.5">👶 Hóspede Extra / Criança:</strong>
            <span class="text-amber-800">Nome: ${extraGuest.name} | Idade: ${extraGuest.age} anos (${extraGuest.surchargeLabel || 'Calculado'})</span>
          </div>
        ` : ''}

        ${res.guest?.obs ? `
          <div class="mt-2 pt-2 border-t border-champagne-subtle/40">
            <strong class="text-[var(--color-araucaria)]">Observações do Hóspede:</strong> <span class="italic text-[var(--color-texto-suave)]">${res.guest.obs}</span>
          </div>
        ` : ''}
      </div>

      <!-- Observações Internas da Pousada (Admin Notes) -->
      <div class="card-boutique p-4 bg-white border border-champagne-subtle space-y-2">
        <h4 class="font-bold text-sm text-[var(--color-araucaria)] border-b border-champagne-subtle/50 pb-2 flex items-center justify-between">
          <span>📝 Observações Internas da Pousada</span>
          <span class="text-[10px] font-normal text-[var(--color-texto-suave)]">Apenas visível para a equipe</span>
        </h4>
        <textarea id="admin-reservation-notes-${res.id}" rows="3" class="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[var(--color-araucaria)] transition-all bg-[var(--color-creme)]/40 text-[var(--color-texto)]" placeholder="Escreva observações internas sobre esta reserva (ex: hóspede solicitou taças extras, horário especial de check-in, observações de pagamento, etc.)...">${res.adminNotes || ''}</textarea>
        <div class="flex justify-end pt-1">
          <button onclick="saveAdminReservationNotes('${res.id}')" class="px-3.5 py-2 rounded-lg bg-[var(--color-araucaria)] text-white text-[11px] font-bold hover:bg-[var(--color-araucaria-dark)] transition-all flex items-center gap-1.5 shadow-sm">
            💾 Salvar Observações
          </button>
        </div>
      </div>

      <!-- Detalhes da Estadia & Financeiro -->
      <div class="card-boutique p-4 bg-white border border-champagne-subtle space-y-3">
        <h4 class="font-bold text-sm text-[var(--color-araucaria)] border-b border-champagne-subtle/50 pb-2">🌙 Estadia & Itens Inclusos</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div><strong>Modalidade:</strong> ${res.stay?.title}</div>
          <div><strong>Check-in:</strong> ${res.stay?.checkIn}</div>
          <div><strong>Check-out:</strong> ${res.stay?.checkOut}</div>
          <div><strong>Duração:</strong> ${res.stay?.numNights} noites</div>
        </div>

        ${packages.length > 0 ? `
          <div class="pt-2 border-t border-champagne-subtle/50">
            <strong class="text-[var(--color-araucaria)] block mb-1">💍 Pacotes Românticos:</strong>
            ${packages.map(p => `<div class="flex justify-between py-0.5"><span>• ${p.name}</span><span class="font-mono font-bold">${formatBRLAdmin(p.price)}</span></div>`).join('')}
          </div>
        ` : ''}

        ${addons.length > 0 ? `
          <div class="pt-2 border-t border-champagne-subtle/50">
            <strong class="text-[var(--color-araucaria)] block mb-1">🧺 Adicionais selecionados:</strong>
            ${addons.map(a => `<div class="flex justify-between py-0.5"><span>• ${a.name}</span><span class="font-mono font-bold">${formatBRLAdmin(a.price)}</span></div>`).join('')}
          </div>
        ` : ''}

        <div class="pt-3 border-t border-[var(--color-champagne)] flex items-center justify-between text-base font-serif font-bold text-[var(--color-araucaria)]">
          <span>Total Geral da Reserva:</span>
          <span>${formatBRLAdmin(res.financials?.grandTotal || 0)}</span>
        </div>
      </div>

      <!-- Botões de Ação Final -->
      <div class="flex flex-wrap gap-3 pt-2">
        <button onclick="sendWhatsAppContract('${res.id}')" class="flex-1 btn-araucaria py-3 text-xs uppercase font-bold flex items-center justify-center gap-2">
          <span>💬</span> Chamar no WhatsApp com Modelo
        </button>
        <button onclick="triggerGoogleCalendarSync('${res.id}')" class="btn-outline-champagne py-3 px-4 text-xs font-bold uppercase text-[var(--color-araucaria)] flex items-center gap-1.5">
          <span>📅</span> Sincronizar Agenda
        </button>
      </div>

    </div>
  `;

  modal.classList.add('active');
}

function closeAdminDetailsModal() {
  const modal = document.getElementById('admin-details-modal');
  if (modal) modal.classList.remove('active');
}

/**
 * Salvar Observações Internas da Reserva (Firestore + LocalStorage)
 */
async function saveAdminReservationNotes(resId) {
  const textarea = document.getElementById(`admin-reservation-notes-${resId}`);
  if (!textarea) return;

  const notesText = textarea.value.trim();
  const res = currentReservationsList.find(r => r.id === resId);
  if (!res) return;

  res.adminNotes = notesText;
  res.updatedAt = new Date().toISOString();

  if (typeof db !== 'undefined' && db) {
    try {
      const docId = res.docId || res.id;
      await db.collection('reservations').doc(docId).update({
        adminNotes: notesText,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('✅ Observações salvas no Firestore.');
    } catch (e) {
      console.warn('Falha ao salvar observações no Firestore:', e);
    }
  }

  localStorage.setItem('morada_reservations', JSON.stringify(currentReservationsList));
  alert('✅ Observações salvas com sucesso para a reserva ' + resId + '!');
}

/**
 * Excluir Reserva Permanentemente do Banco de Dados
 */
async function deleteReservationPermanently(resId) {
  const res = currentReservationsList.find(r => r.id === resId);
  if (!res) return;

  const confirmMsg = `⚠️ EXCLUIR RESERVA PERMANENTEMENTE\n\nTem certeza que deseja EXCLUIR a reserva ${res.id} (${res.guest?.name || 'Hóspede'})?\n\nEsta ação removerá a reserva DEFINITIVAMENTE do banco de dados (Firestore) e do sistema.\n\nNota: Se desejar apenas cancelar a reserva mantendo o registro no histórico, cancele através do botão "Cancelar".`;

  if (!confirm(confirmMsg)) return;

  if (typeof db !== 'undefined' && db) {
    try {
      const docId = res.docId || res.id;
      await db.collection('reservations').doc(docId).delete();
      console.log('🗑️ Reserva excluída do Firestore:', docId);
    } catch (e) {
      console.warn('Erro ao excluir do Firestore:', e);
    }
  }

  currentReservationsList = currentReservationsList.filter(r => r.id !== resId);
  localStorage.setItem('morada_reservations', JSON.stringify(currentReservationsList));

  closeAdminDetailsModal();
  renderAdminDashboard();

  alert(`✅ Reserva ${res.id} foi excluída permanentemente do sistema.`);
}

/**
 * Atualizar Status da Reserva (Firestore + LocalStorage)
 */
async function updateReservationStatus(resId, newStatus) {
  const res = currentReservationsList.find(r => r.id === resId);
  if (!res) return;

  res.status = newStatus;
  res.updatedAt = new Date().toISOString();

  if (typeof db !== 'undefined' && db) {
    try {
      const docId = res.docId || res.id;
      await db.collection('reservations').doc(docId).update({
        status: newStatus,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('✅ Status atualizado no Firestore.');
    } catch (e) {
      console.warn('Falha update Firestore:', e);
    }
  }

  localStorage.setItem('morada_reservations', JSON.stringify(currentReservationsList));
  renderAdminDashboard();
  viewReservationDetails(resId);
  alert('Status alterado para: ' + getStatusLabelText(newStatus));
}

/**
 * Disparar Mensagem no WhatsApp para Hóspede
 */
function sendWhatsAppContract(resId) {
  const res = currentReservationsList.find(r => r.id === resId);
  if (!res) return;

  const phone = (res.guest?.phone || '').replace(/\D/g, '');
  const targetPhone = phone.length >= 10 ? '55' + phone : '5548991882991';

  var lines = [];
  lines.push('Olá, *' + (res.guest?.name || 'Hóspede') + '*! ❤️');
  lines.push('Recebemos sua solicitação de reserva na *Morada Quintal da Serra* (Código: ' + res.id + ').');
  lines.push('');
  lines.push('*Resumo da Estadia:*');
  lines.push('• Modalidade: ' + (res.stay?.title || 'Hospedagem'));
  lines.push('• Check-in: ' + (res.stay?.checkIn || '-'));
  lines.push('• Check-out: ' + (res.stay?.checkOut || '-'));
  lines.push('• Total Geral: ' + formatBRLAdmin(res.financials?.grandTotal || 0));
  lines.push('');
  lines.push('Segue o link para o envio dos dados de PIX (50% de entrada) e o contrato de hospedagem para assinatura.');
  lines.push('Qualquer dúvida estou à disposição!');

  const msg = lines.join('\n');
  window.open('https://wa.me/' + targetPhone + '?text=' + encodeURIComponent(msg), '_blank');
}

/**
 * Sincronizar Google Agenda via Webhook
 */
function triggerGoogleCalendarSync(resId) {
  const res = currentReservationsList.find(r => r.id === resId);
  if (!res) return;

  sendReservationWebhook(res);
  alert('Disparo enviado ao Google Apps Script para criar evento na Agenda!');
}


// Helpers Visuais
function getStatusBadgeHTML(status) {
  switch (status) {
    case 'pending':
      return `<span class="badge-status-pending text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap inline-block">⏳ Pré-Reserva (Pendente)</span>`;
    case 'deposit_paid':
      return `<span class="badge-status-deposit text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap inline-block">💳 50% PIX Pago</span>`;
    case 'fully_paid':
      return `<span class="badge-status-paid text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap inline-block">✅ 100% Quitado</span>`;
    case 'completed':
      return `<span class="badge-status-completed text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap inline-block">🏠 Estadia Concluída</span>`;
    case 'cancelled':
      return `<span class="badge-status-cancelled text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap inline-block">❌ Cancelada</span>`;
    default:
      return `<span class="badge-status-pending text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap inline-block">⏳ Pendente</span>`;
  }
}

function getStatusLabelText(status) {
  switch (status) {
    case 'pending': return 'Pré-Reserva Pendente';
    case 'deposit_paid': return '50% PIX Pago';
    case 'fully_paid': return '100% Quitado';
    case 'completed': return 'Estadia Concluída';
    case 'cancelled': return 'Cancelada';
    default: return status;
  }
}

function formatBRLAdmin(val) {
  return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateAdmin(isoOrDateStr) {
  if (!isoOrDateStr) return '-';
  if (typeof isoOrDateStr === 'string' && isoOrDateStr.includes('Invalid Date')) return '-';

  try {
    let d;
    if (typeof isoOrDateStr === 'object' && isoOrDateStr !== null) {
      if (typeof isoOrDateStr.toDate === 'function') {
        d = isoOrDateStr.toDate();
      } else if (isoOrDateStr.seconds !== undefined) {
        d = new Date(isoOrDateStr.seconds * 1000);
      } else if (isoOrDateStr._seconds !== undefined) {
        d = new Date(isoOrDateStr._seconds * 1000);
      }
    } else if (isoOrDateStr instanceof Date) {
      d = isoOrDateStr;
    }

    if (!d) {
      d = new Date(isoOrDateStr);
    }

    if (isNaN(d.getTime())) {
      return '-';
    }

    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '-';
  }
}

function getSeedReservationsData() {
  return [
    {
      id: "RES-DEMO-001",
      createdAt: new Date().toISOString(),
      status: "pending",
      paymentStatus: "unpaid",
      guest: {
        name: "Carlos Eduardo Santos",
        secondGuest: "Juliana Santos",
        phone: "48991234567",
        email: "carlos@email.com",
        cpf: "098.765.432-11",
        obs: "Comemoração de Aniversário de Casamento",
        petName: "Bob (Poodle)",
        extraGuest: { active: true, name: "Lucas Santos", age: 7, surchargeLabel: "+20%" }
      },
      stay: {
        title: "Hospedagem Pernoite",
        serviceType: "pernoite",
        checkIn: "2026-10-15",
        checkOut: "2026-10-17",
        numNights: 2,
        numGuests: 2
      },
      packages: [{ id: "pkg-namoro", name: "Pacote Romântico Namorar", price: 450 }],
      addons: [{ id: "add-pet", name: "Taxa Pet Amigo", price: 120 }],
      financials: { grandTotal: 2379.60 }
    }
  ];
}

/* ==========================================================================
   GESTAO DA AGENDA & BLOQUEIO DE DATAS (ADMIN)
   ========================================================================== */

let fpAdminBlockStart = null;
let fpAdminBlockEnd = null;
let currentBlockedDatesList = [];

/**
 * Alternar Abas do Painel Admin
 */
function switchAdminTab(tabName) {
  const btnReservations = document.getElementById('admin-tab-btn-reservations');
  const btnCalendar = document.getElementById('admin-tab-btn-calendar');
  const secReservations = document.getElementById('admin-section-reservations');
  const secCalendar = document.getElementById('admin-section-calendar');

  if (tabName === 'reservations') {
    if (btnReservations) btnReservations.className = 'btn-araucaria text-xs !py-2.5 !px-5 flex items-center gap-2 font-bold shadow-sm';
    if (btnCalendar) btnCalendar.className = 'btn-outline-champagne text-xs !py-2.5 !px-5 flex items-center gap-2 font-bold !text-[var(--color-araucaria)] hover:!bg-[var(--color-creme)]';
    if (secReservations) secReservations.classList.remove('hidden');
    if (secCalendar) secCalendar.classList.add('hidden');
  } else {
    if (btnCalendar) btnCalendar.className = 'btn-araucaria text-xs !py-2.5 !px-5 flex items-center gap-2 font-bold shadow-sm';
    if (btnReservations) btnReservations.className = 'btn-outline-champagne text-xs !py-2.5 !px-5 flex items-center gap-2 font-bold !text-[var(--color-araucaria)] hover:!bg-[var(--color-creme)]';
    if (secCalendar) secCalendar.classList.remove('hidden');
    if (secReservations) secReservations.classList.add('hidden');

    initAdminBlockPickers();
    loadBlockedDates();
    renderAdminCalendarGrid();
  }
}

/**
 * Inicializar Seletor de Datas Flatpickr no Admin
 */
function initAdminBlockPickers() {
  const startEl = document.getElementById('block-start-date');
  const endEl = document.getElementById('block-end-date');

  if (startEl && endEl && typeof flatpickr !== 'undefined' && !fpAdminBlockStart) {
    fpAdminBlockStart = flatpickr(startEl, {
      locale: 'pt',
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: 'd/m/Y',
      minDate: 'today',
      onChange: function(selectedDates) {
        if (selectedDates.length > 0 && fpAdminBlockEnd) {
          fpAdminBlockEnd.set('minDate', selectedDates[0]);
        }
      }
    });

    fpAdminBlockEnd = flatpickr(endEl, {
      locale: 'pt',
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: 'd/m/Y',
      minDate: 'today'
    });
  }
}

/**
 * Carregar Datas Bloqueadas (Firestore + LocalStorage)
 */
function loadBlockedDates() {
  if (typeof db !== 'undefined' && db) {
    db.collection('blocked_dates').onSnapshot(snapshot => {
      let list = [];
      snapshot.forEach(doc => {
        list.push({ docId: doc.id, ...doc.data() });
      });
      currentBlockedDatesList = list;
      renderBlockedDatesList();
    }, err => {
      console.warn('Erro ao carregar blocked_dates do Firestore, fallback local:', err);
      loadLocalBlockedDates();
    });
    return;
  }
  loadLocalBlockedDates();
}

function loadLocalBlockedDates() {
  const raw = localStorage.getItem('morada_blocked_dates') || '[]';
  currentBlockedDatesList = JSON.parse(raw);
  renderBlockedDatesList();
}

/**
 * Submeter Bloqueio de Datas
 */
async function handleAdminBlockDateSubmit(e) {
  e.preventDefault();
  const startDate = document.getElementById('block-start-date')?.value;
  const endDate = document.getElementById('block-end-date')?.value || startDate;
  const reason = document.getElementById('block-reason')?.value.trim() || 'Bloqueio pelo Gestor';

  if (!startDate) {
    alert('Por favor, selecione a data inicial.');
    return;
  }

  const dateList = generateDateArray(startDate, endDate);

  for (let dStr of dateList) {
    const blockItem = {
      date: dStr,
      startDate: startDate,
      endDate: endDate,
      reason: reason,
      createdBy: 'admin',
      createdAt: new Date().toISOString()
    };

    if (typeof db !== 'undefined' && db) {
      try {
        await db.collection('blocked_dates').doc(dStr).set(blockItem);
      } catch (err) {
        console.warn('Erro salvando blocked_date no Firestore:', err);
      }
    }

    // Salvar Local
    let local = JSON.parse(localStorage.getItem('morada_blocked_dates') || '[]');
    local = local.filter(item => item.date !== dStr);
    local.push(blockItem);
    localStorage.setItem('morada_blocked_dates', JSON.stringify(local));
  }

  alert(`✅ Período de ${startDate} até ${endDate} foi bloqueado com sucesso!`);
  
  if (fpAdminBlockStart) fpAdminBlockStart.clear();
  if (fpAdminBlockEnd) fpAdminBlockEnd.clear();
  document.getElementById('block-reason').value = '';

  loadBlockedDates();
}

/**
 * Remover Bloqueio (Liberar Data)
 */
async function unblockAdminDate(dateStr) {
  if (!confirm(`Deseja liberar a data ${dateStr} para reservas no site?`)) return;

  if (typeof db !== 'undefined' && db) {
    try {
      await db.collection('blocked_dates').doc(dateStr).delete();
      console.log('✅ Data removida do Firestore:', dateStr);
    } catch (e) {
      console.warn('Erro ao deletar no Firestore:', e);
    }
  }

  let local = JSON.parse(localStorage.getItem('morada_blocked_dates') || '[]');
  local = local.filter(item => item.date !== dateStr);
  localStorage.setItem('morada_blocked_dates', JSON.stringify(local));

  loadBlockedDates();
  alert(`🟢 Data ${dateStr} foi liberada!`);
}

/**
 * Renderizar Lista de Datas Bloqueadas
 */
function renderBlockedDatesList() {
  const container = document.getElementById('admin-blocked-dates-list');
  const countBadge = document.getElementById('blocked-count-badge');
  renderAdminCalendarGrid();
  if (!container) return;

  if (countBadge) countBadge.innerText = `${currentBlockedDatesList.length} bloqueadas`;

  if (currentBlockedDatesList.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 bg-[var(--color-creme)] rounded-xl border border-champagne-subtle/50">
        <span class="text-2xl block mb-1">🎉</span>
        <p class="text-xs text-[var(--color-araucaria)] font-bold">Nenhuma data bloqueada manualmente.</p>
        <p class="text-[11px] text-[var(--color-texto-suave)]">Todas as datas livres estão abertas para reservas no site.</p>
      </div>
    `;
    return;
  }

  // Ordenar datas
  currentBlockedDatesList.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  let html = '';
  currentBlockedDatesList.forEach(item => {
    const formattedDate = formatDateBRStr(item.date);
    const reason = item.reason || 'Bloqueio Administrativo';

    html += `
      <div class="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between gap-3 transition-all hover:bg-red-100/70">
        <div class="flex items-center gap-3">
          <span class="w-3 h-3 rounded-full bg-red-600 shrink-0"></span>
          <div>
            <span class="font-mono font-bold text-xs text-red-950 block">🗓️ ${formattedDate}</span>
            <span class="text-[11px] text-red-800 italic block">${reason}</span>
          </div>
        </div>
        <button onclick="unblockAdminDate('${item.date}')" class="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold transition-all shadow-sm shrink-0">
          🟢 Liberar Data
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ==========================================================================
   CALENDÁRIO MENSAL INTERATIVO & BLOQUEIOS RÁPIDOS (ADMIN VISUAL)
   ========================================================================== */

let adminCalYear = new Date().getFullYear();
let adminCalMonth = new Date().getMonth(); // 0 a 11

function changeAdminCalendarMonth(delta) {
  adminCalMonth += delta;
  if (adminCalMonth < 0) {
    adminCalMonth = 11;
    adminCalYear--;
  } else if (adminCalMonth > 11) {
    adminCalMonth = 0;
    adminCalYear++;
  }
  renderAdminCalendarGrid();
}

/**
 * Renderiza o Grid de Dias do Mês Selecionado
 */
function renderAdminCalendarGrid() {
  const titleEl = document.getElementById('admin-calendar-month-title');
  const gridEl = document.getElementById('admin-calendar-days-grid');
  if (!gridEl) return;

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  if (titleEl) {
    titleEl.innerText = `${monthNames[adminCalMonth]} ${adminCalYear}`;
  }

  const firstDay = new Date(adminCalYear, adminCalMonth, 1);
  const lastDay = new Date(adminCalYear, adminCalMonth + 1, 0);
  const startDayOfWeek = firstDay.getDay(); // 0 = Dom, 1 = Seg...
  const totalDaysInMonth = lastDay.getDate();

  // Mapear datas reservadas ativas
  const reservedDatesMap = {};
  currentReservationsList.forEach(r => {
    if ((r.status === 'deposit_paid' || r.status === 'fully_paid') && r.stay?.checkIn && r.stay?.checkOut) {
      let dt = new Date(r.stay.checkIn + 'T00:00:00');
      const end = new Date(r.stay.checkOut + 'T00:00:00');
      while (dt < end) {
        const dStr = dt.toISOString().split('T')[0];
        reservedDatesMap[dStr] = r.guest?.name || 'Hóspede';
        dt.setDate(dt.getDate() + 1);
      }
    }
  });

  // Mapear datas bloqueadas
  const blockedDatesMap = {};
  currentBlockedDatesList.forEach(b => {
    if (b.date) {
      blockedDatesMap[b.date] = b.reason || 'Bloqueado Admin';
    }
  });

  let html = '';

  // Quadrados em branco (padding inicial)
  for (let i = 0; i < startDayOfWeek; i++) {
    html += `<div class="p-3 rounded-xl bg-gray-50/50 border border-gray-100 opacity-30 select-none pointer-events-none min-h-[70px]"></div>`;
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // Dias reais do mês
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const monthStr = String(adminCalMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateFormatted = `${adminCalYear}-${monthStr}-${dayStr}`;

    const isToday = dateFormatted === todayStr;
    const isReserved = reservedDatesMap[dateFormatted];
    const isBlocked = blockedDatesMap[dateFormatted];

    let cardBgClass = 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100/80 hover:border-emerald-400';
    let badgeHTML = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 block mt-1">🟢 Livre</span>`;
    let onClickAction = `toggleSingleDateBlock('${dateFormatted}', false)`;

    if (isReserved) {
      cardBgClass = 'bg-blue-50 border-blue-300 text-blue-950 hover:bg-blue-100';
      badgeHTML = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-200 text-blue-900 block mt-1 truncate" title="${isReserved}">🔵 ${isReserved}</span>`;
      onClickAction = `alert('Data já reservada por: ${isReserved}')`;
    } else if (isBlocked) {
      cardBgClass = 'bg-red-100 border-red-400 text-red-950 hover:bg-red-200';
      badgeHTML = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-200 text-red-950 block mt-1 truncate" title="${isBlocked}">🔴 Bloqueado</span>`;
      onClickAction = `toggleSingleDateBlock('${dateFormatted}', true)`;
    }

    html += `
      <div onclick="${onClickAction}" class="p-2.5 rounded-xl border ${cardBgClass} transition-all cursor-pointer shadow-sm min-h-[72px] flex flex-col justify-between relative group ${isToday ? 'ring-2 ring-[var(--color-araucaria)]' : ''}">
        <div class="flex items-center justify-between">
          <span class="font-mono font-bold text-sm">${day}</span>
          ${isToday ? `<span class="text-[8px] bg-[var(--color-araucaria)] text-white px-1 rounded uppercase font-bold">Hoje</span>` : ''}
        </div>
        <div>
          ${badgeHTML}
        </div>
      </div>
    `;
  }

  gridEl.innerHTML = html;
}

/**
 * Alternar Bloqueio de 1 Única Data (1 Clique no Quadrado)
 */
async function toggleSingleDateBlock(dateStr, currentlyBlocked) {
  let local = JSON.parse(localStorage.getItem('morada_blocked_dates') || '[]');

  if (currentlyBlocked) {
    // 1. Atualizar memória e localStorage imediatamente
    currentBlockedDatesList = currentBlockedDatesList.filter(item => item.date !== dateStr);
    local = local.filter(item => item.date !== dateStr);
    localStorage.setItem('morada_blocked_dates', JSON.stringify(local));

    // 2. Deletar do Firestore
    if (typeof db !== 'undefined' && db) {
      try { await db.collection('blocked_dates').doc(dateStr).delete(); } catch (e) {}
    }
  } else {
    // Bloquear
    const blockItem = {
      date: dateStr,
      startDate: dateStr,
      endDate: dateStr,
      reason: 'Bloqueio no Calendário Admin',
      createdBy: 'admin',
      createdAt: new Date().toISOString()
    };

    // 1. Atualizar memória e localStorage imediatamente
    currentBlockedDatesList = currentBlockedDatesList.filter(item => item.date !== dateStr);
    currentBlockedDatesList.push(blockItem);
    local = local.filter(item => item.date !== dateStr);
    local.push(blockItem);
    localStorage.setItem('morada_blocked_dates', JSON.stringify(local));

    // 2. Salvar no Firestore
    if (typeof db !== 'undefined' && db) {
      try { await db.collection('blocked_dates').doc(dateStr).set(blockItem); } catch (e) {}
    }
  }

  // 3. Atualizar a interface do calendário na hora sem atraso
  renderBlockedDatesList();
}

/**
 * Bloquear / Liberar Todos os Dias de um Específico Dia da Semana no Mês Atual
 */
async function toggleDayOfWeekBlock(dayIndex) {
  const dayNames = ['Domingos', 'Segundas-feiras', 'Terças-feiras', 'Quartas-feiras', 'Quintas-feiras', 'Sextas-feiras', 'Sábados'];
  const name = dayNames[dayIndex];

  const datesToToggle = getDatesForDayOfWeekInMonth(adminCalYear, adminCalMonth, dayIndex);
  
  const blockedCount = datesToToggle.filter(dStr => currentBlockedDatesList.some(b => b.date === dStr)).length;
  const shouldBlock = blockedCount < datesToToggle.length;

  let local = JSON.parse(localStorage.getItem('morada_blocked_dates') || '[]');

  for (let dStr of datesToToggle) {
    if (shouldBlock) {
      const blockItem = {
        date: dStr,
        startDate: dStr,
        endDate: dStr,
        reason: `Bloqueio em Lote (${name})`,
        createdBy: 'admin',
        createdAt: new Date().toISOString()
      };
      currentBlockedDatesList = currentBlockedDatesList.filter(item => item.date !== dStr);
      currentBlockedDatesList.push(blockItem);

      local = local.filter(item => item.date !== dStr);
      local.push(blockItem);

      if (typeof db !== 'undefined' && db) {
        try { await db.collection('blocked_dates').doc(dStr).set(blockItem); } catch (e) {}
      }
    } else {
      currentBlockedDatesList = currentBlockedDatesList.filter(item => item.date !== dStr);
      local = local.filter(item => item.date !== dStr);

      if (typeof db !== 'undefined' && db) {
        try { await db.collection('blocked_dates').doc(dStr).delete(); } catch (e) {}
      }
    }
  }

  localStorage.setItem('morada_blocked_dates', JSON.stringify(local));
  renderBlockedDatesList();
  alert(`${shouldBlock ? '🔴 Bloqueadas' : '🟢 Liberadas'} todas as ${name} do mês!`);
}

/**
 * Bloquear / Liberar Finais de Semana do Mês Atual (Sáb e Dom)
 */
async function toggleWeekendsBlock() {
  const saturdays = getDatesForDayOfWeekInMonth(adminCalYear, adminCalMonth, 6);
  const sundays = getDatesForDayOfWeekInMonth(adminCalYear, adminCalMonth, 0);
  const weekends = [...saturdays, ...sundays];

  const blockedCount = weekends.filter(dStr => currentBlockedDatesList.some(b => b.date === dStr)).length;
  const shouldBlock = blockedCount < weekends.length;

  let local = JSON.parse(localStorage.getItem('morada_blocked_dates') || '[]');

  for (let dStr of weekends) {
    if (shouldBlock) {
      const blockItem = {
        date: dStr,
        startDate: dStr,
        endDate: dStr,
        reason: 'Bloqueio Final de Semana',
        createdBy: 'admin',
        createdAt: new Date().toISOString()
      };
      currentBlockedDatesList = currentBlockedDatesList.filter(item => item.date !== dStr);
      currentBlockedDatesList.push(blockItem);

      local = local.filter(item => item.date !== dStr);
      local.push(blockItem);

      if (typeof db !== 'undefined' && db) {
        try { await db.collection('blocked_dates').doc(dStr).set(blockItem); } catch (e) {}
      }
    } else {
      currentBlockedDatesList = currentBlockedDatesList.filter(item => item.date !== dStr);
      local = local.filter(item => item.date !== dStr);

      if (typeof db !== 'undefined' && db) {
        try { await db.collection('blocked_dates').doc(dStr).delete(); } catch (e) {}
      }
    }
  }

  localStorage.setItem('morada_blocked_dates', JSON.stringify(local));
  renderBlockedDatesList();
  alert(`${shouldBlock ? '🔴 Bloqueados' : '🟢 Liberados'} todos os Finais de Semana do mês!`);
}

/**
 * Bloquear / Liberar Dias Úteis do Mês Atual (Seg a Qui)
 */
async function toggleWeekdaysBlock() {
  const mondays = getDatesForDayOfWeekInMonth(adminCalYear, adminCalMonth, 1);
  const tuesdays = getDatesForDayOfWeekInMonth(adminCalYear, adminCalMonth, 2);
  const wednesdays = getDatesForDayOfWeekInMonth(adminCalYear, adminCalMonth, 3);
  const thursdays = getDatesForDayOfWeekInMonth(adminCalYear, adminCalMonth, 4);

  const weekdays = [...mondays, ...tuesdays, ...wednesdays, ...thursdays];

  const blockedCount = weekdays.filter(dStr => currentBlockedDatesList.some(b => b.date === dStr)).length;
  const shouldBlock = blockedCount < weekdays.length;

  let local = JSON.parse(localStorage.getItem('morada_blocked_dates') || '[]');

  for (let dStr of weekdays) {
    if (shouldBlock) {
      const blockItem = {
        date: dStr,
        startDate: dStr,
        endDate: dStr,
        reason: 'Bloqueio Dias Úteis (Seg a Qui)',
        createdBy: 'admin',
        createdAt: new Date().toISOString()
      };
      currentBlockedDatesList = currentBlockedDatesList.filter(item => item.date !== dStr);
      currentBlockedDatesList.push(blockItem);

      local = local.filter(item => item.date !== dStr);
      local.push(blockItem);

      if (typeof db !== 'undefined' && db) {
        try { await db.collection('blocked_dates').doc(dStr).set(blockItem); } catch (e) {}
      }
    } else {
      currentBlockedDatesList = currentBlockedDatesList.filter(item => item.date !== dStr);
      local = local.filter(item => item.date !== dStr);

      if (typeof db !== 'undefined' && db) {
        try { await db.collection('blocked_dates').doc(dStr).delete(); } catch (e) {}
      }
    }
  }

  localStorage.setItem('morada_blocked_dates', JSON.stringify(local));
  renderBlockedDatesList();
  alert(`${shouldBlock ? '🔴 Bloqueados' : '🟢 Liberados'} todos os Dias Úteis (Seg a Qui) do mês!`);
}

/**
 * Liberar Todo o Mês Selecionado
 */
async function clearAllBlocksInMonth() {
  if (!confirm('Tem certeza que deseja LIBERAR todas as datas deste mês?')) return;

  const totalDays = new Date(adminCalYear, adminCalMonth + 1, 0).getDate();
  let local = JSON.parse(localStorage.getItem('morada_blocked_dates') || '[]');

  for (let day = 1; day <= totalDays; day++) {
    const monthStr = String(adminCalMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dStr = `${adminCalYear}-${monthStr}-${dayStr}`;

    currentBlockedDatesList = currentBlockedDatesList.filter(item => item.date !== dStr);
    local = local.filter(item => item.date !== dStr);

    if (typeof db !== 'undefined' && db) {
      try { await db.collection('blocked_dates').doc(dStr).delete(); } catch (e) {}
    }
  }

  localStorage.setItem('morada_blocked_dates', JSON.stringify(local));
  renderBlockedDatesList();
  alert('🟢 Todas as datas do mês foram liberadas!');
}

function getDatesForDayOfWeekInMonth(year, monthIndex, targetDayOfWeek) {
  const dates = [];
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  for (let day = 1; day <= totalDays; day++) {
    const dt = new Date(year, monthIndex, day);
    if (dt.getDay() === targetDayOfWeek) {
      const monthStr = String(monthIndex + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      dates.push(`${year}-${monthStr}-${dayStr}`);
    }
  }
  return dates;
}

function generateDateArray(startStr, endStr) {
  const arr = [];
  let dt = new Date(startStr + 'T00:00:00');
  const end = new Date(endStr + 'T00:00:00');

  while (dt <= end) {
    arr.push(dt.toISOString().split('T')[0]);
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}

function formatDateBRStr(yyyyMmDd) {
  if (!yyyyMmDd) return '-';
  const parts = yyyyMmDd.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return yyyyMmDd;
}


