# 📖 Guia Passo a Passo — Ativação Google Agenda, E-mails & Firebase

Este guia prático e didático foi preparado para você ativar em poucos minutos todas as integrações da **Morada Quintal da Serra** utilizando a conta oficial:
👉 **`Reservasmoradaquintaldaserra@gmail.com`**

---

## 📌 PARTE 1: Ativação do Google Apps Script (E-mails & Google Agenda)

Esta etapa ativa o envio automático de solicitações de reserva para o e-mail da empresa, e-mail do hóspede e a criação de eventos no **Google Agenda (Google Calendar)**.

### 1. Acesse o Google Apps Script
- Abra o navegador e acesse: 👉 [**script.google.com**](https://script.google.com/)
- **Importante:** Confira no canto superior direito se você está logado com a conta `Reservasmoradaquintaldaserra@gmail.com`.
- Clique no botão azul **"+ Novo projeto"** (canto superior esquerdo).

### 2. Cole o Código do Webhook
- Apague qualquer código de exemplo no editor (como `function myFunction() { ... }`).
- Copie todo o código abaixo e cole no editor:

```javascript
const EMAIL_EMPRESA = "Reservasmoradaquintaldaserra@gmail.com";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    sendEmailNotificationToCompany(data);
    if (data.guest && data.guest.email) {
      sendEmailConfirmationToGuest(data);
    }
    createGoogleCalendarEvent(data);
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendEmailNotificationToCompany(data) {
  const subject = "🚨 NOVA SOLICITAÇÃO DE RESERVA — " + (data.id || "Morada");
  const bodyHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #FAF8F2; padding: 20px; color: #163A2F;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #CBB98B; overflow: hidden;">
        <div style="background-color: #163A2F; color: #CBB98B; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">Morada Quintal da Serra</h1>
          <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Solicitação de Reserva Recebida</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="color: #163A2F; font-size: 18px; margin-top: 0;">Código: ${data.id}</h2>
          <h3 style="color: #CBB98B; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px;">👤 Dados dos Hóspedes</h3>
          <p><strong>Titular:</strong> ${data.guest ? data.guest.name : '-'}</p>
          <p><strong>Segundo Hóspede:</strong> ${data.guest ? data.guest.secondGuest : '-'}</p>
          <p><strong>WhatsApp:</strong> ${data.guest ? data.guest.phone : '-'}</p>
          <p><strong>E-mail:</strong> ${data.guest ? data.guest.email : '-'}</p>
          ${data.guest && data.guest.petName ? `<p><strong>🐾 Pet:</strong> ${data.guest.petName}</p>` : ''}
          ${data.guest && data.guest.extraGuest && data.guest.extraGuest.active ? `<p><strong>👶 Hóspede Extra:</strong> ${data.guest.extraGuest.name} (${data.guest.extraGuest.age} anos)</p>` : ''}
          <h3 style="color: #CBB98B; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">🌙 Detalhes da Estadia</h3>
          <p><strong>Modalidade:</strong> ${data.stay ? data.stay.title : '-'}</p>
          <p><strong>Check-in:</strong> ${data.stay ? data.stay.checkIn : '-'}</p>
          <p><strong>Check-out:</strong> ${data.stay ? data.stay.checkOut : '-'}</p>
          <h3 style="color: #CBB98B; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">💰 Valor Total</h3>
          <p style="font-size: 20px; font-weight: bold; color: #163A2F;">R$ ${data.financials ? data.financials.grandTotal.toFixed(2) : '0.00'}</p>
        </div>
      </div>
    </div>
  `;
  MailApp.sendEmail({ to: EMAIL_EMPRESA, subject: subject, htmlBody: bodyHtml });
}

function sendEmailConfirmationToGuest(data) {
  const subject = "Recebemos sua solicitação de reserva — Morada Quintal da Serra";
  const bodyHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #FAF8F2; padding: 20px; color: #163A2F;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #CBB98B; overflow: hidden;">
        <div style="background-color: #163A2F; color: #CBB98B; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">Morada Quintal da Serra</h1>
          <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Pré-Confirmação de Reserva</p>
        </div>
        <div style="padding: 24px;">
          <p>Olá, <strong>${data.guest.name}</strong>!</p>
          <p>Sua solicitação de reserva foi recebida com carinho por nossa equipe (Código: <strong>${data.id}</strong>).</p>
          <div style="background: #FAF8F2; padding: 15px; border-radius: 10px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Modalidade:</strong> ${data.stay.title}</p>
            <p style="margin: 5px 0;"><strong>Check-in:</strong> ${data.stay.checkIn}</p>
            <p style="margin: 5px 0;"><strong>Check-out:</strong> ${data.stay.checkOut}</p>
            <p style="margin: 5px 0;"><strong>Valor Total:</strong> R$ ${data.financials ? data.financials.grandTotal.toFixed(2) : '0.00'}</p>
          </div>
          <p>Em breve nossa equipe entrará em contato via WhatsApp para enviar os dados para PIX e o contrato de hospedagem.</p>
        </div>
      </div>
    </div>
  `;
  MailApp.sendEmail({ to: data.guest.email, subject: subject, htmlBody: bodyHtml });
}

function createGoogleCalendarEvent(data) {
  try {
    const calendar = CalendarApp.getDefaultCalendar();
    const checkInParts = data.stay.checkIn.split('/');
    const checkOutParts = data.stay.checkOut.split('/');
    if (checkInParts.length === 3 && checkOutParts.length === 3) {
      const startDate = new Date(checkInParts[2], checkInParts[1] - 1, checkInParts[0], 14, 0, 0);
      const endDate = new Date(checkOutParts[2], checkOutParts[1] - 1, checkOutParts[0], 11, 0, 0);
      const title = "RESERVA: " + data.guest.name + " (" + data.id + ")";
      const description = "Titular: " + data.guest.name + "\nTelefone: " + data.guest.phone + "\nE-mail: " + data.guest.email + "\nValor: R$ " + (data.financials ? data.financials.grandTotal.toFixed(2) : '0.00');
      calendar.createEvent(title, startDate, endDate, { description: description });
    }
  } catch (err) { Logger.log(err.toString()); }
}
```

- Clique no ícone de disco **💾 Salvar** (no topo).

### 3. Publicar o Webapp (Implantar)
- No canto superior direito, clique no botão azul **"Implantar"** ➔ **"Nova implantação"**.
- Clique no ícone de engrenagem **⚙️** ao lado de *Selecione o tipo* e escolha **App da Web**.
- Ajuste os 3 campos:
  - **Descrição:** `Webhook Morada`
  - **Executar como:** `Eu (Reservasmoradaquintaldaserra@gmail.com)`
  - **Quem tem acesso:** `Qualquer pessoa` *(Essencial para aceitar requisições do site)*.
- Clique em **Implantar**.

### 4. Conceder Permissão no Google
- Clique em **"Autorizar acesso"**.
- Escolha a conta `Reservasmoradaquintaldaserra@gmail.com`.
- Se aparecer a aviso *"O Google não verificou este app"*, clique no link **"Avançado"** (na parte inferior) ➔ **"Acessar Projeto (não seguro)"** ➔ **"Permitir"**.

### 5. Salvar a URL no Painel
- Copie a **URL do app da Web** (que começa com `https://script.google.com/macros/s/.../exec`).
- Acesse o [**Painel Administrativo (admin.html)**](admin.html), clique no botão **"⚙️ Configurar Google"** e cole esse link.

---

## 📌 PARTE 2: Ativação do Banco de Dados & Login (Firebase Console)

### 1. Criar Projeto no Firebase
- Acesse: 👉 [**console.firebase.google.com**](https://console.firebase.google.com/)
- Logue com `Reservasmoradaquintaldaserra@gmail.com`.
- Clique em **"+ Adicionar projeto"** e dê o nome: `Morada Quintal da Serra`.

### 2. Ativar Autenticação & Domínios Autorizados
- No menu esquerdo, vá em **Build ➔ Authentication**.
- Na aba **Método de login (Sign-in method)**, ative os provedores:
  - **E-mail/senha**
  - **Google** (ative e configure o e-mail de suporte como `Reservasmoradaquintaldaserra@gmail.com`).
- Na aba **Configurações (Settings)** ➔ **Domínios autorizados (Authorized domains)**:
  - Clique em **Adicionar domínio**.
  - Adicione o endereço/domínio de onde você está acessando a aplicação (ex: `localhost`, `127.0.0.1`, ou o domínio final da hospedagem como `suaempresa.vercel.app` ou `moradaquintaldaserra.com.br`).
- Vá na aba **Users** e clique em **Adicionar usuário**:
  - E-mail: `Reservasmoradaquintaldaserra@gmail.com`
  - Senha: Crie uma senha segura para o gestor.

### 3. Ativar Banco de Dados Firestore
- No menu esquerdo, vá em **Build ➔ Firestore Database**.
- Clique em **Criar banco de dados** ➔ Escolha o local (ex: `southamerica-east1` em SP) e avance em modo de produção.

### 4. Cole as Chaves no Código
- Vá nas engrenagem de **Configurações do Projeto ➔ Geral**.
- Em *Seus aplicativos*, clique no ícone **`</>` (Web)**.
- Copie o bloco `firebaseConfig` e cole no arquivo `src/js/firebase-config.js`.

---

## 🔗 Links Úteis para Consulta

- 🌐 [**Site Principal da Morada**](index.html)
- 🏛️ [**Painel Administrativo de Gestão**](admin.html)
- 📜 [**Arquivo do Script Google (google-apps-script.js)**](google-apps-script.js)
- ⚙️ [**Arquivo de Configuração Firebase (src/js/firebase-config.js)**](src/js/firebase-config.js)
