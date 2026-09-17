/**
 * MORADA QUINTAL DA SERRA — GOOGLE APPS SCRIPT WEBHOOK
 * 
 * Como instalar em 2 minutos:
 * 1. Acesse https://script.google.com/ com a conta Google da empresa.
 * 2. Clique em "Novo Projeto".
 * 3. Cole todo o código deste arquivo.
 * 4. Altere O EMAIL_EMPRESA abaixo para o e-mail oficial da Morada.
 * 5. Clique no botão "Implantar" (topo direito) -> "Nova Implantação".
 * 6. Selecione Tipo: "App da Web" (Web App).
 * 7. Em "Quem pode acessar", escolha: "Qualquer pessoa" (Anyone).
 * 8. Clique em "Implantar" e copie a URL gerada (ex: https://script.google.com/macros/s/.../exec).
 * 9. Cole essa URL no Painel Admin em "Configurar Google" ou no localStorage.
 */

const EMAIL_EMPRESA = "Reservasmoradaquintaldaserra@gmail.com"; // E-mail oficial para alertas de reserva

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // 1. Enviar E-mail para a Empresa (Notificação de Nova Reserva)
    sendEmailNotificationToCompany(data);
    
    // 2. Enviar E-mail de Pré-comprovante para o Hóspede (se tiver e-mail)
    if (data.guest && data.guest.email) {
      sendEmailConfirmationToGuest(data);
    }
    
    // 3. Criar evento prévio no Google Agenda (Google Calendar)
    createGoogleCalendarEvent(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "E-mails enviados e evento criado no Google Agenda!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 1. E-mail para a Empresa
 */
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
          <p><strong>Titular:</strong> ${data.guest.name}</p>
          <p><strong>Segundo Hóspede:</strong> ${data.guest.secondGuest}</p>
          <p><strong>WhatsApp:</strong> ${data.guest.phone}</p>
          <p><strong>E-mail:</strong> ${data.guest.email}</p>
          ${data.guest.cpf ? `<p><strong>CPF:</strong> ${data.guest.cpf}</p>` : ''}
          ${data.guest.petName ? `<p><strong>🐾 Pet:</strong> ${data.guest.petName}</p>` : ''}
          ${data.guest.extraGuest && data.guest.extraGuest.active ? `<p><strong>👶 Hóspede Extra:</strong> ${data.guest.extraGuest.name} (${data.guest.extraGuest.age} anos)</p>` : ''}
          
          <h3 style="color: #CBB98B; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">🌙 Detalhes da Estadia</h3>
          <p><strong>Modalidade:</strong> ${data.stay.title}</p>
          <p><strong>Check-in:</strong> ${data.stay.checkIn}</p>
          <p><strong>Check-out:</strong> ${data.stay.checkOut}</p>
          <p><strong>Duração:</strong> ${data.stay.numNights} noites</p>

          <h3 style="color: #CBB98B; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">💰 Valor Total</h3>
          <p style="font-size: 20px; font-weight: bold; color: #163A2F;">R$ ${data.financials ? data.financials.grandTotal.toFixed(2) : '0.00'}</p>
          
          <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="margin-bottom: 12px; font-size: 13px; color: #163A2F; font-weight: bold;">Acesse o Painel Administrativo para gerenciar a reserva</p>
            <a href="http://localhost:3000/admin.html" style="background-color: #163A2F; color: #CBB98B; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 12px; display: inline-block;">🏛️ Abrir Painel Administrativo</a>
          </div>
        </div>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: EMAIL_EMPRESA,
    subject: subject,
    htmlBody: bodyHtml
  });
}

/**
 * 2. E-mail de Pré-Confirmação para o Hóspede
 */
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

          <p>Em breve, nossa equipe entrará em contato pelo WhatsApp (<strong>${data.guest.phone}</strong>) para enviar os dados de PIX/Cartão e o contrato de hospedagem.</p>
          <p style="margin-top: 20px;">Com carinho,<br/><strong>Morada Quintal da Serra</strong></p>
        </div>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: data.guest.email,
    subject: subject,
    htmlBody: bodyHtml
  });
}

/**
 * 3. Criar Evento no Google Agenda (Google Calendar)
 */
function createGoogleCalendarEvent(data) {
  try {
    const calendar = CalendarApp.getDefaultCalendar();
    
    // Converte datas formato BR (DD/MM/YYYY) para Date Object
    const checkInParts = data.stay.checkIn.split('/');
    const checkOutParts = data.stay.checkOut.split('/');
    
    if (checkInParts.length === 3 && checkOutParts.length === 3) {
      const startDate = new Date(checkInParts[2], checkInParts[1] - 1, checkInParts[0], 14, 0, 0); // Check-in às 14h
      const endDate = new Date(checkOutParts[2], checkOutParts[1] - 1, checkOutParts[0], 11, 0, 0);   // Check-out às 11h
      
      const title = "PRÉ-RESERVA: " + data.guest.name + " (" + data.id + ")";
      const description = "Titular: " + data.guest.name + "\n" +
                          "2º Hóspede: " + data.guest.secondGuest + "\n" +
                          "Telefone: " + data.guest.phone + "\n" +
                          "E-mail: " + data.guest.email + "\n" +
                          "Valor: R$ " + (data.financials ? data.financials.grandTotal.toFixed(2) : '0.00');
      
      calendar.createEvent(title, startDate, endDate, {
        description: description
      });
      Logger.log("Evento criado no Google Calendar com sucesso!");
    }
  } catch (err) {
    Logger.log("Erro ao criar evento no Calendar: " + err.toString());
  }
}
