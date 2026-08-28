# 📖 Morada Quintal da Serra — Guia Passo a Passo para o Cliente

> **Manual simplificado e didático de configuração e obtenção de chaves de acesso.**  
> *Não se preocupe com termos técnicos! Siga as instruções abaixo clique por clique.*

---

## 1. 💳 Mercado Pago (Para Receber Pagamentos no Site)

### O que você vai conseguir aqui:
Duas chaves de acesso (`Public Key` e `Access Token`) que autorizam o site a mandar o dinheiro das reservas direto para a sua conta bancária do Mercado Pago.

### Passo a Passo Clique a Clique:

1. **Acesse sua conta Mercado Pago:**
   - Entre em: [www.mercadopago.com.br](https://www.mercadopago.com.br)
   - Faça login com a conta do seu negócio (preferencialmente conta PJ / CNPJ).

2. **Entre no Painel de Desenvolvedores:**
   - Com a conta aberta, acesse o link: [developers.mercadopago.com.br](https://developers.mercadopago.com.br)
   - No canto superior da tela, clique em **"Suas integrações"** (ou "Painel").
   - Clique no botão azul **"+ Criar aplicação"**.

3. **Preencha os campos simples:**
   - **Nome da aplicação:** Digite `Morada Quintal da Serra`
   - **Tipo de integração:** Selecione *"Pagamentos no e-commerce"*
   - **Está usando uma plataforma de e-commerce?** Marque *"Não"*
   - **Modelo de integração:** Selecione *"Checkout Pro"*
   - Marque a caixa declarando que aceita os termos e clique em **"Criar aplicação"**.

4. **Copie e nos envie as duas chaves:**
   - No menu à esquerda dentro da sua nova aplicação, clique em **"Credenciais de produção"**.
   - Você verá duas chaves na tela:
     - 1️⃣ **Public Key** (começa com `APP_USR-...`)
     - 2️⃣ **Access Token** (clique no ícone do "olho" para visualizar e copiar).

> 💡 **O que nos enviar:** Copie a *Public Key* e o *Access Token* e nos mande pelo WhatsApp da agência!

---

## 2. 📅 Google Calendar (Para Atualizar suas Datas Automaticamente)

### O que você vai conseguir aqui:
Permite que o site insira as reservas automaticamente no seu Google Agenda do celular e bloqueie as datas ocupadas para evitar *overbooking*.

### Passo a Passo Clique a Clique:

1. **Abra o seu Google Agenda no Computador:**
   - Acesse: [calendar.google.com](https://calendar.google.com)

2. **Pegue o ID da Agenda:**
   - Na barra lateral esquerda (em *"Minhas agendas"*), passe o mouse sobre a agenda da Pousada.
   - Clique nos **3 pontinhos verticais** → **"Configurações e compartilhamento"**.
   - Role a página para baixo até encontrar a seção **"Integrar agenda"**.
   - Copie o código que aparece em **"ID da agenda"** (parece um e-mail, ex: `c_abc12345@group.calendar.google.com` ou seu próprio e-mail).

3. **Compartilhe a Agenda com o Robô de Reservas:**
   - Na mesma tela de configurações, suba um pouco até a seção **"Compartilhar com pessoas específicas"**.
   - Clique no botão **"+ Adicionar pessoas"**.
   - Cole o e-mail da nossa conta de serviço (nós te passaremos o e-mail exato).
   - Na opção de permissão, escolha: **"Fazer alterações nos eventos"**.
   - Clique em **"Enviar"**.

> 💡 **O que nos enviar:** O **ID da agenda** que você copiou no item 2.

---

## 3. 📧 Gmail Automático (Para Enviar Comprovantes de Reserva)

### O que você vai conseguir aqui:
Uma "Senha de App" de 16 letras que permite ao site disparar e-mails automáticos de confirmação com a logomarca da Morada Quintal da Serra para o hóspede.

### Passo a Passo Clique a Clique:

1. **Ative a Verificação em Duas Etapas no Google:**
   - Acesse: [myaccount.google.com/security](https://myaccount.google.com/security)
   - Clique em **"Verificação em duas etapas"** e ative usando o seu número de celular.

2. **Gere a Senha de App:**
   - Digite na barra de pesquisa no topo da conta Google: `Senhas de app` (ou acesse [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
   - No campo **"Nome do app"**, digite: `Site MQS`
   - Clique no botão **"Criar"**.
   - O Google exibirá uma caixinha com um código de **16 caracteres amarelados** (ex: `abcd efgh ijkl mnop`).

> 💡 **O que nos enviar:** O seu endereço de e-mail do Gmail + essa **Senha de App de 16 caracteres**.  
> *(Obs: Essa senha serve APENAS para o site enviar os comprovantes. Ela NÃO dá acesso à sua senha pessoal do e-mail).*

---

## 4. 📈 Google Analytics 4 (Para Acompanhar as Visitas do Site)

### Passo a Passo Clique a Clique:

1. Acesse: [analytics.google.com](https://analytics.google.com)
2. No canto inferior esquerdo, clique na engrenagem **"Administrador"**.
3. Clique em **"+ Criar Propriedade"** com o nome `Morada Quintal da Serra`.
4. Em Plataforma, escolha **"Web"** e coloque o link do site: `mqs.berocket.com.br`.
5. Copie o **ID DE MEDIÇÃO** (Começa com `G-`, ex: `G-ABC123XYZ`).

> 💡 **O que nos enviar:** O **ID de Medição (G-XXXXXXXXXX)**.

---

*Manual elaborado pela Berocket Agency para Morada Quintal da Serra — Agosto 2026*
