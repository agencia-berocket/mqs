# 🛡️ Morada Quintal da Serra — Plano de Cibersegurança

> Documento técnico de segurança para implantação das integrações.  
> **Nível de proteção-alvo: Produção com dados financeiros e pessoais (LGPD).**

---

## ⚠️ Aviso de Criticidade

> [!CAUTION]
> Com a integração do Mercado Pago e dados pessoais de hóspedes, o site passa a processar **dados sensíveis financeiros e pessoais**, tornando-o alvo potencial de ataques. Cada camada abaixo é obrigatória, não opcional.

---

## 🏗️ Arquitetura de Segurança em Camadas

```
INTERNET
    │
    ▼
┌───────────────────────┐
│  Cloudflare WAF        │  ← Camada 1: Firewall de Aplicação Web
│  DDoS Protection       │
│  Rate Limiting         │
└───────────────────────┘
    │
    ▼
┌───────────────────────┐
│  NGINX (Coolify)       │  ← Camada 2: Servidor Web Endurecido
│  SSL/TLS 1.3           │
│  Security Headers      │
└───────────────────────┘
    │
    ▼
┌───────────────────────┐
│  Back-end (API)        │  ← Camada 3: Lógica de Negócio Segura
│  Validação de Entrada  │
│  Sanitização de Dados  │
└───────────────────────┘
    │
    ▼
┌───────────────────────┐
│  Firebase / Google     │  ← Camada 4: Autenticação & Dados
│  Auth + Firestore      │
│  Security Rules        │
└───────────────────────┘
    │
    ▼
┌───────────────────────┐
│  Mercado Pago          │  ← Camada 5: Pagamentos (PCI-DSS)
│  (ambiente externo)    │
└───────────────────────┘
```

---

## 1. 🌐 Camada 1 — Infraestrutura e CDN

### 1.1 Cloudflare (Obrigatório)

**O que faz**: Fica na frente do servidor, filtrando tráfego malicioso antes de chegar ao site.

**Configurações obrigatórias:**

| Recurso | Configuração | Por quê |
|---------|-------------|---------|
| SSL/TLS Mode | **Full (Strict)** | Criptografia ponta a ponta |
| Always HTTPS | **Ativo** | Redireciona HTTP → HTTPS |
| HSTS | **Ativo, max-age=31536000** | Força HTTPS por 1 ano no browser |
| Min TLS Version | **TLS 1.2** (idealmente 1.3) | Bloqueia protocolos obsoletos |
| WAF | **Ativo (modo Managed Rules)** | Bloqueia SQLi, XSS, CSRF automático |
| DDoS Protection | **Ativo** | Absorve ataques de volume |
| Bot Fight Mode | **Ativo** | Bloqueia scrapers e bots maliciosos |
| Rate Limiting | **100 req/min por IP** | Evita força bruta no formulário |
| Security Level | **Medium** | Bloqueia IPs com histórico ruim |

**Regras customizadas do WAF:**
```
BLOQUEAR se:
- User-Agent contém "sqlmap", "nikto", "nmap", "masscan"
- URI contém "../", "<?php", "<script>", "UNION SELECT"
- Mais de 5 requisições POST por segundo do mesmo IP
- País de origem não é Brasil (opcional — definir com cliente)
```

### 1.2 Registro DNS Seguro
```dns
; Registros recomendados
mqs.berocket.com.br.  IN  A      [IP Coolify]
mqs.berocket.com.br.  IN  CAA    0 issue "letsencrypt.org"
mqs.berocket.com.br.  IN  CAA    0 issuewild ";"
_dmarc.berocket.com.br. IN TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@berocket.com.br"
berocket.com.br.      IN  TXT   "v=spf1 include:_spf.google.com ~all"
```

> [!IMPORTANT]
> O registro **CAA** impede que qualquer outra autoridade certificadora emita um SSL para o domínio, bloqueando ataques de certificado falso.

---

## 2. 🔒 Camada 2 — Headers de Segurança HTTP

Todos os headers abaixo devem ser aplicados no NGINX (configuração customizada no Coolify).

### Headers Obrigatórios

```nginx
# Arquivo: nginx-security.conf (adicionar no Coolify como custom_nginx_configuration)

# Proíbe iframes de terceiros (clickjacking)
add_header X-Frame-Options "SAMEORIGIN" always;

# Bloqueia MIME sniffing
add_header X-Content-Type-Options "nosniff" always;

# Ativa proteção XSS do browser
add_header X-XSS-Protection "1; mode=block" always;

# Força HTTPS por 1 ano (HSTS)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Controla informações de referência
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Desativa recursos perigosos do browser
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(self 'https://www.mercadopago.com.br')" always;

# Content Security Policy (CSP)
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'nonce-{NONCE}' https://cdn.tailwindcss.com https://sdk.mercadopago.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://*.mercadopago.com.br;
  connect-src 'self' https://api.mercadopago.com https://fcm.googleapis.com;
  frame-src https://www.mercadopago.com.br;
  form-action 'self';
  base-uri 'self';
  upgrade-insecure-requests;
" always;

# Remove informações do servidor
server_tokens off;
more_clear_headers 'X-Powered-By';
more_clear_headers 'Server';
```

### Content Security Policy (CSP) — Explicação

| Diretiva | Valor | Motivo |
|---------|-------|--------|
| `default-src 'self'` | Apenas recursos do próprio domínio | Base segura |
| `script-src` | Self + Tailwind + MP SDK + GTM | Apenas scripts necessários |
| `frame-src mercadopago.com.br` | Permite iframe do MP | Checkout Pro funciona em iframe |
| `form-action 'self'` | Formulários só enviam para o próprio domínio | Previne phishing via form |
| `upgrade-insecure-requests` | Força HTTPS em recursos internos | Sem conteúdo misto |

---

## 3. 🧱 Camada 3 — Segurança da Aplicação (Back-end)

> [!WARNING]
> Esta camada requer um **back-end dedicado** (não apenas HTML estático). Com as integrações de Mercado Pago e Google Calendar, precisaremos de um servidor de API (Node.js recomendado) rodando no Coolify.

### 3.1 OWASP Top 10 — Proteções Obrigatórias

| Vulnerabilidade | Proteção Implementada |
|----------------|----------------------|
| **A01 – Broken Access Control** | Firebase Security Rules + JWT validation |
| **A02 – Cryptographic Failures** | HTTPS obrigatório, tokens nunca em logs |
| **A03 – Injection (SQLi, XSS)** | Sanitização com DOMPurify + Cloudflare WAF |
| **A04 – Insecure Design** | Webhook com assinatura HMAC-SHA256 |
| **A05 – Security Misconfiguration** | Headers CSP + HSTS + auditoria periódica |
| **A06 – Vulnerable Components** | `npm audit` automatizado no CI/CD |
| **A07 – Auth Failures** | Firebase Auth + rate limiting no login |
| **A08 – Integrity Failures** | SRI (Subresource Integrity) nos scripts CDN |
| **A09 – Logging Failures** | Logs de erros e acessos no Coolify |
| **A10 – SSRF** | Allowlist de domínios nas chamadas externas |

### 3.2 Validação e Sanitização

```javascript
// Exemplo: Todo dado que entra do usuário deve ser validado
const { body, validationResult } = require('express-validator');

const reservaRules = [
  body('nome').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').normalizeEmail().isEmail(),
  body('telefone').isMobilePhone('pt-BR'),
  body('checkIn').isISO8601().isAfter(new Date().toISOString()),
  body('checkOut').isISO8601(),
  body('valor').isFloat({ min: 0, max: 99999 }),
];
```

### 3.3 Proteção do Webhook do Mercado Pago

> [!CAUTION]
> **Crítico**: Sem esta verificação, um atacante pode forjar um pagamento aprovado sem pagar.

```javascript
// Verificação obrigatória de assinatura HMAC no webhook
const crypto = require('crypto');

function verificarWebhookMP(req, res, next) {
  const assinaturaRecebida = req.headers['x-mp-signature'];
  const segredo = process.env.MP_WEBHOOK_SECRET;
  
  const assinaturaEsperada = crypto
    .createHmac('sha256', segredo)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (assinaturaRecebida !== assinaturaEsperada) {
    return res.status(401).json({ error: 'Assinatura inválida' });
  }
  
  next();
}
```

### 3.4 Rate Limiting no Back-end

```javascript
const rateLimit = require('express-rate-limit');

// Limitar tentativas de reserva
const limiteReserva = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,                   // 10 tentativas por IP
  message: { error: 'Muitas tentativas. Aguarde 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/reserva', limiteReserva, criarReserva);

// Limitar login (mais restrito)
const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                    // 5 tentativas de login por IP
  message: { error: 'Conta bloqueada temporariamente.' },
});

app.post('/api/auth/login', limiteLogin, autenticar);
```

---

## 4. 🔐 Camada 4 — Autenticação e Dados (Firebase)

### 4.1 Firebase Security Rules (Firestore)

```javascript
// firestore.rules — Define quem pode ler/escrever o quê
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Reservas: hóspede só vê as próprias; admin vê todas
    match /reservas/{reservaId} {
      allow read: if request.auth != null 
        && (resource.data.userId == request.auth.uid 
            || get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isAdmin == true);
      
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.valor is number
        && request.resource.data.valor > 0;
      
      allow update: if false; // Apenas o sistema (service account) pode atualizar
      allow delete: if false; // Nunca excluir, apenas cancelar
    }
    
    // Usuários: só o próprio usuário pode ver/editar seu perfil
    match /usuarios/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    // Admins: apenas leitura pelo sistema
    match /admins/{adminId} {
      allow read: if false;
      allow write: if false;
    }
  }
}
```

### 4.2 Gerenciamento de Segredos (Variáveis de Ambiente)

> [!CAUTION]
> **Nunca** colocar chaves de API diretamente no código. Usar variáveis de ambiente.

```bash
# .env (NUNCA commitar no GitHub — já está no .gitignore)
MP_ACCESS_TOKEN=APP_USR-...
MP_PUBLIC_KEY=APP_USR-...
MP_WEBHOOK_SECRET=...
GOOGLE_SERVICE_ACCOUNT=./credentials/google-service-account.json
FIREBASE_ADMIN_SDK=./credentials/firebase-admin.json
GMAIL_APP_PASSWORD=...
JWT_SECRET=...            # gerado aleatoriamente: openssl rand -hex 32
```

**Armazenamento seguro no Coolify:**
- Nunca no código-fonte
- Configuradas na aba **Environment Variables** do Coolify
- Rotacionadas a cada 90 dias
- Acesso restrito apenas ao proprietário do projeto

### 4.3 Tokens JWT e Sessões

```javascript
// Tokens de acesso de curta duração + refresh tokens
const accessToken = jwt.sign(
  { uid: user.uid, role: 'hospede' },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }    // Expira em 15 minutos
);

const refreshToken = jwt.sign(
  { uid: user.uid },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }     // Expira em 7 dias
);
```

---

## 5. 📊 Camada 5 — Monitoramento e Detecção de Incidentes

### 5.1 Logs Estruturados

```javascript
// Formato de log: JSON estruturado para análise fácil
const log = {
  timestamp: new Date().toISOString(),
  level: 'warn',
  event: 'tentativa_login_falha',
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  email: req.body.email, // nunca logar senha!
  tentativas: 3,
};
console.log(JSON.stringify(log));
```

### 5.2 Alertas Automáticos (via Coolify Notifications)

Configurar alertas para:
- ❌ Mais de 5 erros 500 em 5 minutos
- ⚠️ CPU acima de 80% por mais de 3 minutos
- 🔴 Container caiu e reiniciou
- 💳 Webhook do Mercado Pago com assinatura inválida
- 🔒 Mais de 20 tentativas de login falhas por minuto

### 5.3 Análise de Segurança Periódica

| Frequência | Ação |
|-----------|------|
| A cada deploy | `npm audit` — verifica dependências vulneráveis |
| Semanal | Revisão dos logs de erro e segurança |
| Mensal | Rotação de chaves de API não críticas |
| Trimestral | Rotação de todos os segredos |
| Semestral | Pentest básico com OWASP ZAP |

---

## 6. 📁 Arquivos e Estrutura de Segurança

### 6.1 Arquivos que Precisamos Criar/Gerenciar

```
projeto/
├── .gitignore              ✅ Já existe — adicionar .env, credentials/
├── .env                    🔒 NÃO commitar — variáveis de ambiente
├── credentials/            🔒 NÃO commitar — chaves Google/Firebase
│   ├── google-service-account.json
│   └── firebase-admin.json
├── security/
│   ├── nginx-security.conf  📄 Headers de segurança
│   ├── csp-policy.conf      📄 Content Security Policy
│   └── rate-limits.conf     📄 Limites de requisição
├── api/
│   ├── middleware/
│   │   ├── auth.js          🔐 Verificação de JWT
│   │   ├── rateLimit.js     🛡️ Rate limiting
│   │   ├── validateInput.js ✅ Validação de entrada
│   │   └── verifyWebhook.js 🔏 Assinatura HMAC
│   └── routes/
│       ├── reservas.js      📋 Rotas de reserva (protegidas)
│       ├── pagamento.js     💳 Rotas do Mercado Pago
│       └── webhook.js       🔔 Receptor de eventos MP
└── firestore.rules          🔒 Regras de acesso ao banco
```

### 6.2 .gitignore (Atualizado)

```gitignore
# Segredos — NUNCA no repositório
.env
.env.local
.env.production
credentials/
*.json.key
*.pem
*.p12

# Logs
logs/
*.log

# Dependências
node_modules/

# Build
dist/
.next/
```

---

## 7. ⚖️ Conformidade LGPD

> [!IMPORTANT]
> Com dados de hóspedes (nome, CPF, telefone, e-mail), a **Lei Geral de Proteção de Dados (LGPD)** é obrigatória.

### Checklist LGPD

- [ ] **Política de Privacidade** — página explicando quais dados coletamos e por quê
- [ ] **Consentimento explícito** — checkbox no formulário de reserva: _"Concordo com a Política de Privacidade"_
- [ ] **Direito de acesso** — hóspede pode solicitar seus dados (prazo: 15 dias)
- [ ] **Direito ao esquecimento** — hóspede pode solicitar exclusão dos dados
- [ ] **Retenção limitada** — dados de reservas mantidos por 5 anos (obrigação fiscal), depois excluídos
- [ ] **Notificação de vazamento** — se houver incidente, notificar ANPD em 72 horas
- [ ] **DPO** — Definir quem é o responsável pelos dados pessoais

### Dados Sensíveis — Como Proteger

| Dado | Armazenamento | Acesso |
|------|--------------|--------|
| Nome | Firestore (criptografado) | Hóspede + Admin |
| E-mail | Firebase Auth + Firestore | Hóspede + Admin |
| Telefone | Firestore (criptografado) | Admin apenas |
| Dados de pagamento | **Nunca armazenamos** — apenas no MP | Mercado Pago |
| CPF | Firestore (hash one-way) | Admin apenas |
| Senha | **Nunca armazenamos** — Firebase Auth | Nunca |

---

## 8. 🚨 Plano de Resposta a Incidentes

### Cenário 1 — Tentativa de invasão detectada (IPs suspeitos)
```
1. Cloudflare bloqueia IP automaticamente
2. Alerta chega ao Slack/WhatsApp
3. Analisar logs nas próximas 2 horas
4. Se confirmado: bloquear subnet inteira, revisar WAF rules
```

### Cenário 2 — Vulnerabilidade encontrada em dependência (npm audit)
```
1. CI/CD para o deploy
2. Atualizar dependência: npm update [pacote]
3. Testar localmente
4. Novo deploy
5. Documentar no log de segurança
```

### Cenário 3 — Vazamento de credencial no GitHub
```
1. REVOGAR imediatamente a credencial no console (MP, Google, Firebase)
2. Gerar nova credencial
3. Atualizar no Coolify (Environment Variables)
4. Novo deploy
5. Verificar histórico de uso da credencial vazada
6. Notificar cliente
```

### Cenário 4 — Ataque DDoS
```
1. Cloudflare absorve automaticamente (Under Attack Mode se necessário)
2. Rate limiting bloqueia IPs agressivos
3. Monitorar no Cloudflare Analytics
4. Ativar modo "I'm Under Attack" se ultrapassar 10k req/min
5. O site permanece online para usuários legítimos
```

---

## ✅ Checklist Final de Segurança (Antes do Go-Live)

### Infraestrutura
- [ ] Cloudflare configurado com WAF + DDoS + Rate Limiting
- [ ] SSL/TLS 1.3 ativo + HSTS preload
- [ ] Registros DNS CAA configurados
- [ ] DMARC + SPF + DKIM para e-mails

### Aplicação
- [ ] Todos os security headers configurados no NGINX
- [ ] CSP sem `unsafe-eval` e sem `unsafe-inline` em scripts
- [ ] SRI nos scripts de CDN externos
- [ ] Webhook do Mercado Pago com verificação HMAC
- [ ] Rate limiting em todos os endpoints críticos
- [ ] Validação e sanitização de todos os inputs

### Dados
- [ ] Firebase Security Rules auditadas
- [ ] Nenhuma credencial no código-fonte ou GitHub
- [ ] Variáveis de ambiente no Coolify (não em arquivos)
- [ ] .gitignore cobrindo todos os segredos
- [ ] Backup automático do Firestore ativo

### Conformidade
- [ ] Página de Política de Privacidade publicada
- [ ] Checkbox de consentimento LGPD no checkout
- [ ] Contato para solicitação de dados: `lgpd@moradaquintaldasserra.com.br`

### Monitoramento
- [ ] Alertas do Coolify configurados
- [ ] Logs estruturados ativos
- [ ] OWASP ZAP rodado antes do primeiro acesso público
- [ ] `npm audit` sem vulnerabilidades críticas/altas

---

## 🔑 Score de Segurança-Alvo

| Ferramenta | Score mínimo-alvo |
|-----------|------------------|
| [securityheaders.com](https://securityheaders.com) | **A+** |
| [SSL Labs](https://www.ssllabs.com/ssltest/) | **A+** |
| [observatory.mozilla.org](https://observatory.mozilla.org) | **A ou A+** |
| OWASP ZAP Scan | **0 vulnerabilidades críticas** |

---

*Documento técnico preparado por Berocket Agency — Agosto 2026*  
*Baseado em OWASP Top 10 2025 + LGPD + PCI-DSS Level 4 guidelines*
