# 🏡 Morada Quintal da Serra — Plano de Integrações

> Documento técnico e didático para conversa com o cliente.  
> **Nada aqui será implantado automaticamente** — cada etapa exige ação conjunta.

---

## 📋 Visão Geral

| # | Integração | Complexidade | Custo Estimado | Prioridade |
|---|-----------|-------------|----------------|-----------|
| 1 | Mercado Pago (checkout) | Média | 0 setup + % por transação | 🔴 Alta |
| 2 | Google Calendar (reservas) | Baixa | Grátis até 1M req/mês | 🟡 Média |
| 3 | Gmail (e-mails automáticos) | Baixa | Grátis até 500 e-mails/dia | 🟡 Média |
| 4 | Painel do Hóspede (login) | Alta | Grátis (Firebase) | 🟢 Opcional |
| 5 | APIs complementares | Variável | Variável | 🟢 Opcional |

---

## 1. 💳 Mercado Pago — Checkout de Pagamento

### O que é
O Mercado Pago integrado ao carrinho permite que o hóspede clique em "Confirmar Reserva", seja redirecionado para a tela segura do Mercado Pago e realize o pagamento (Pix ou Cartão de Crédito) sem que nenhum dado sensível transite pelo nosso servidor.

### Fluxo da Experiência
```
1. Hóspede monta a reserva no carrinho
2. Clica em "Confirmar Reserva"
3. Sistema envia os dados para a API do Mercado Pago
4. Mercado Pago retorna um link de pagamento seguro (Checkout Pro)
5. Hóspede é redirecionado para o ambiente Mercado Pago
6. Após pagamento, o Mercado Pago nos notifica automaticamente (webhook)
7. Sistema confirma a reserva e envia e-mail para o hóspede e para você
```

### O que o CLIENTE precisa fazer

> [!IMPORTANT]
> **Ações obrigatórias do cliente antes da implantação:**

1. **Criar ou acessar conta Mercado Pago** em [mercadopago.com.br](https://mercadopago.com.br)
   - Deve ser conta do tipo **Empresa** (não pessoa física, para emitir comprovantes)
   
2. **Verificar a conta** — enviar documentos da empresa (CNPJ, comprovante de endereço)

3. **Acessar o Painel de Desenvolvedor**: [developers.mercadopago.com](https://developers.mercadopago.com)
   - Criar um **Aplicativo** → Dará acesso às chaves de API

4. **Nos fornecer 2 chaves** (modo produção):
   - `PUBLIC_KEY` — usada no front-end (não secreta)
   - `ACCESS_TOKEN` — usada no back-end (secreta, nunca exposta)

5. **Configurar a URL de webhook** — endereço que o Mercado Pago vai notificar quando um pagamento for aprovado/recusado. Nós definiremos esse endereço.

### Tarifas Mercado Pago (agosto 2026)
| Método | Taxa por transação |
|--------|-------------------|
| Pix | 0,99% |
| Cartão de crédito 1x | 2,99% |
| Cartão de crédito 2x–6x | 3,99% |
| Cartão de crédito 7x–12x | 4,99% |

> [!NOTE]
> Nos optamos por trabalhar com até **4x sem juros** — a taxa de 3,99% é absorvida pelo negócio ou repassada no preço final. Definir com o cliente.

---

## 2. 📅 Google Calendar — Gestão de Disponibilidade

### O que é
Toda reserva confirmada cria automaticamente um evento no Google Calendar do cliente. Isso elimina o trabalho manual de controlar datas ocupadas e permite que o calendário funcione como painel de gestão de reservas.

### Fluxo da Experiência
```
1. Pagamento confirmado pelo Mercado Pago
2. Sistema automaticamente cria evento no Google Calendar:
   - Título: "✅ [Nome Hóspede] — Check-in [data] / Check-out [data]"
   - Descrição: dados completos da reserva
   - Cor: verde (hospedagem) / azul (day use)
3. Calendário sempre atualizado em tempo real
4. Hóspede pode receber convite no próprio Calendar (opcional)
```

### Bloqueio de Datas no Site
O sistema também pode **consultar o Google Calendar** antes de mostrar as datas disponíveis no site. Assim, se uma data está ocupada no calendário, ela aparece bloqueada no formulário de reserva.

### O que o CLIENTE precisa fazer

> [!IMPORTANT]
> **Ações obrigatórias do cliente:**

1. **Ter uma conta Google** (pode ser pessoal ou criar uma profissional: `reservas@moradaquintaldasserra.com.br`)

2. **Criar um Google Cloud Project** — nós fazemos isso com o cliente (10 minutos):
   - Acesse: [console.cloud.google.com](https://console.cloud.google.com)
   - Projeto novo: `MQS-Reservas`

3. **Ativar a API do Google Calendar** no projeto

4. **Criar uma Conta de Serviço** (Service Account) — é como um "funcionário virtual" que tem acesso ao calendário
   - Gera um arquivo `.json` com credenciais (guardamos com segurança)

5. **Compartilhar o Google Calendar** com o e-mail da conta de serviço (com permissão de "Fazer alterações")

6. **Nos fornecer**:
   - ID do Calendário (ex: `abc123@group.calendar.google.com`)
   - O arquivo `.json` de credenciais da conta de serviço

---

## 3. 📧 Gmail — Envio e Recebimento de E-mails de Reserva

### O que é
Sempre que uma reserva for confirmada, o sistema envia automaticamente:
- **Para o hóspede**: Confirmação de reserva estilizada (PDF ou HTML), com todos os detalhes
- **Para você**: Alerta de nova reserva com resumo completo

### Fluxo
```
1. Reserva confirmada
2. Sistema envia e-mail para o hóspede:
   ✉️ "Sua reserva foi confirmada! Aqui estão todos os detalhes..."
3. Sistema envia e-mail para você:
   ✉️ "Nova reserva recebida! [Nome] — [Datas] — R$ [Valor]"
4. Respostas do hóspede chegam normalmente no Gmail do cliente
```

### O que o CLIENTE precisa fazer

> [!IMPORTANT]
> **Recomendamos criar um e-mail profissional:**  
> `reservas@moradaquintaldasserra.com.br` (ou domínio que você já tiver)

**Opção A — Gmail com domínio próprio (Google Workspace)**
1. Assinar o Google Workspace (~R$ 30/mês/usuário)
2. Configurar o domínio
3. Nos fornecer as credenciais para envio via API

**Opção B — Gmail pessoal com App Password (mais simples)**
1. Ativar **verificação em dois passos** na conta Google
2. Gerar uma **App Password** exclusiva para o sistema
3. Nos fornecer: e-mail + app password

> [!NOTE]
> A Opção B é gratuita mas tem limite de **500 e-mails/dia** (mais que suficiente). A Opção A é profissional e sem limite relevante.

---

## 4. 🔐 Painel do Hóspede — Login e Gestão de Reservas

### O que é
Uma área exclusiva onde o hóspede pode:
- Ver o histórico de reservas
- Cancelar ou editar uma reserva
- Baixar confirmações
- O cliente (você) também tem área admin para ver todas as reservas

### Opções de Autenticação

#### Opção A — E-mail e Senha
```
Hóspede → Cria conta com e-mail + senha → Acessa o painel
```

#### Opção B — Login com Google ("Entrar com Google")
```
Hóspede → Clica "Entrar com Google" → Autoriza → Acesso imediato
```

#### Opção C — Ambos (Recomendado)
Permite os dois métodos. O hóspede escolhe o que preferir.

### Tecnologia Recomendada: **Firebase Authentication**

- **Gratuito** até 50.000 usuários ativos/mês (mais que suficiente)
- Gerenciado pelo Google — máxima segurança
- Suporta: e-mail/senha, Google, Apple, Facebook, WhatsApp

### O que o CLIENTE precisa fazer

1. **Criar um projeto Firebase** (nós fazemos junto):
   - Acesse: [console.firebase.google.com](https://console.firebase.google.com)
   - Criar projeto `MQS-App`

2. **Ativar os métodos de autenticação** desejados:
   - Email/Senha: ✅ (automático)
   - Google: precisa configurar o OAuth Client ID no Google Cloud

3. **Definir quem é administrador** — e-mail do proprietário que terá acesso ao painel admin

> [!IMPORTANT]
> **Para o Login com Google funcionar em produção**, é necessário:
> - Verificar o domínio `mqs.berocket.com.br` no Google Search Console
> - Configurar as URLs autorizadas no OAuth 2.0 do Google Cloud Console
> - Essa etapa leva ~2 dias para aprovação do Google

---

## 5. 🔌 APIs Complementares Recomendadas

### 5.1 — API de CEP (ViaCEP)
- **Para**: Auto-preencher endereço do hóspede pelo CEP no checkout
- **Custo**: Gratuito
- **Ação do cliente**: Nenhuma

### 5.2 — WhatsApp Business API (opcional, via Twilio ou Zapi)
- **Para**: Enviar confirmação de reserva também pelo WhatsApp
- **Custo**: ~$0,05 por mensagem (Twilio) ou planos a partir de R$ 49/mês (Zapi)
- **Ação do cliente**: 
  - Ter WhatsApp Business verificado
  - Cadastro na plataforma escolhida

### 5.3 — Google Analytics 4 (GA4)
- **Para**: Monitorar visitas, funil de conversão, origens de tráfego
- **Custo**: Gratuito
- **Ação do cliente**:
  1. Criar conta em [analytics.google.com](https://analytics.google.com)
  2. Criar propriedade `Morada Quintal da Serra`
  3. Nos fornecer o ID de medição (ex: `G-XXXXXXXXXX`)

### 5.4 — Hotjar ou Microsoft Clarity (Mapa de Calor)
- **Para**: Ver onde os usuários clicam e onde abandonam o site
- **Custo**: Gratuito (plano básico)
- **Ação do cliente**: Criar conta e nos fornecer o ID do site

---

## 🗂️ Resumo do que o Cliente Precisa Entregar

| Item | Responsável | Urgência |
|------|-------------|----------|
| Acesso ao Mercado Pago (PUBLIC_KEY + ACCESS_TOKEN) | Cliente | 🔴 Alta |
| Conta Google para reservas | Cliente | 🟡 Média |
| Compartilhamento do Google Calendar | Cliente | 🟡 Média |
| App Password do Gmail | Cliente | 🟡 Média |
| Definição: Login com Google ou E-mail/Senha | Cliente | 🟢 Baixa |
| ID do Google Analytics | Cliente | 🟢 Baixa |

---

## ⏱️ Estimativa de Implantação (após recebimento das credenciais)

| Etapa | Tempo estimado |
|-------|---------------|
| Mercado Pago (checkout) | 3–5 dias úteis |
| Google Calendar | 1–2 dias úteis |
| Gmail automático | 1 dia útil |
| Painel do Hóspede (login) | 5–10 dias úteis |
| APIs complementares | 1–2 dias úteis |
| **Total estimado** | **~15 dias úteis** |

---

*Documento preparado por Berocket Agency — Agosto 2026*
