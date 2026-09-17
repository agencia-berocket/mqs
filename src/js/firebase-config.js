/**
 * Morada Quintal da Serra — Firebase Config & Services
 * Firebase Auth & Cloud Firestore Integration
 * 
 * INSTRUÇÕES DE CONEXÃO COM O PROJETO FIREBASE DO CLIENTE:
 * 1. Acesse https://console.firebase.google.com/ com a conta Google do cliente.
 * 2. Crie um novo projeto "Morada Quintal da Serra".
 * 3. Ative o "Firebase Authentication" (E-mail e Senha).
 * 4. Ative o "Cloud Firestore Database" em modo produção.
 * 5. Adicione um App Web no Firebase Console e copie as chaves abaixo para substituir o firebaseConfig:
 */

// Firebase Configuration Object (Oficial Morada Quintal da Serra)
const firebaseConfig = {
  apiKey: "AIzaSyCbA97iPDTbQwiZJswujt_glF0R4XCn594",
  authDomain: "morada-quintal-da-serra.firebaseapp.com",
  projectId: "morada-quintal-da-serra",
  storageBucket: "morada-quintal-da-serra.firebasestorage.app",
  messagingSenderId: "923638147613",
  appId: "1:923638147613:web:cbc4c9408a57cacb5f34f4",
  measurementId: "G-5R20BW80PB"
};

// Global Firebase Initialization (Fallback Graceful System)
let db = null;
let auth = null;
let isFirebaseReady = false;

function initFirebaseApp() {
  if (typeof firebase !== 'undefined') {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      db = firebase.firestore();
      auth = firebase.auth();
      isFirebaseReady = true;
      console.log('🔥 Firebase inicializado com sucesso.');
    } catch (err) {
      console.warn('⚠️ Firebase initialization skipped or using local mode:', err);
    }
  } else {
    console.warn('ℹ️ Firebase SDK não carregado nesta página.');
  }
}

// Inicializar na carga do script
initFirebaseApp();

/**
 * Salva uma nova reserva no Firestore
 * Fallback para localStorage se offline ou Firebase não configurado
 */
async function saveReservationToFirestore(reservationData) {
  // Garantir id único e timestamps
  const resId = 'RES-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
  const dataToSave = {
    ...reservationData,
    id: resId,
    status: reservationData.status || 'pending', // 'pending', 'deposit_paid', 'fully_paid', 'completed', 'cancelled'
    paymentStatus: reservationData.paymentStatus || 'unpaid',
    createdAt: firebase?.firestore?.FieldValue?.serverTimestamp() || new Date().toISOString(),
    updatedAt: firebase?.firestore?.FieldValue?.serverTimestamp() || new Date().toISOString()
  };

  // Se Firebase Firestore estiver ativo, salva no banco
  if (isFirebaseReady && db) {
    try {
      await db.collection('reservations').doc(resId).set(dataToSave);
      console.log('✅ Reserva salva no Cloud Firestore com ID:', resId);
    } catch (err) {
      console.error('❌ Erro ao salvar no Firestore:', err);
    }
  }

  // Backup sempre no localStorage local
  try {
    let localReservations = JSON.parse(localStorage.getItem('morada_reservations') || '[]');
    localReservations.unshift({
      ...dataToSave,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    localStorage.setItem('morada_reservations', JSON.stringify(localReservations));
    console.log('💾 Reserva salva no backup local (localStorage).');
  } catch (e) {
    console.warn('FALHA localStorage:', e);
  }

  return resId;
}

// URL Padrão do Webhook do Google Apps Script (salva permanentemente)
const DEFAULT_WEBHOOK_URL = ""; 

/**
 * Disparo de Webhook para Google Apps Script (E-mails & Google Agenda)
 */
async function sendReservationWebhook(reservationData, webhookUrl = null) {
  // Busca da URL personalizada, do localStorage ou da constante fixa no código
  const targetUrl = webhookUrl || localStorage.getItem('morada_webhook_url') || DEFAULT_WEBHOOK_URL;
  if (!targetUrl) {
    console.log('ℹ️ Nenhuma URL de Webhook de E-mail/Agenda configurada ainda.');
    return false;
  }

  try {
    const resp = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationData),
      mode: 'no-cors'
    });
    console.log('📧 Webhook de reserva disparado para Google Apps Script.');
    return true;
  } catch (err) {
    console.warn('⚠️ Falha ao disparar webhook:', err);
    return false;
  }
}

