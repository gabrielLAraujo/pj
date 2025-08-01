# Como Gerar Credenciais OAuth - Guia Passo a Passo

## 🔑 GitHub OAuth - Configuração Completa

### Passo 1: Acessar GitHub Developer Settings
1. Faça login no GitHub
2. Vá para: https://github.com/settings/developers
3. Clique em **"OAuth Apps"** no menu lateral
4. Clique no botão **"New OAuth App"**

### Passo 2: Preencher Informações da Aplicação
```
Application name: Freelance Management System
Homepage URL: http://localhost:3003
Application description: Sistema de gerenciamento freelance com autenticação OAuth
Authorization callback URL: http://localhost:3003/auth/callback
```

### Passo 3: Obter Credenciais
1. Após criar a aplicação, você verá:
   - **Client ID**: Copie este valor
   - **Client Secret**: Clique em "Generate a new client secret" e copie

### Passo 4: Configurar no .env
```bash
# No arquivo api/.env
GITHUB_CLIENT_ID="seu_client_id_aqui"
GITHUB_CLIENT_SECRET="seu_client_secret_aqui"
GITHUB_REDIRECT_URI="http://localhost:3003/auth/callback"

# No arquivo frontend/.env
REACT_APP_GITHUB_CLIENT_ID="seu_client_id_aqui"
```

---

## 🔑 Google OAuth - Configuração Completa

### Passo 1: Acessar Google Cloud Console
1. Vá para: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. Crie um novo projeto ou selecione um existente

### Passo 2: Habilitar APIs Necessárias
1. No menu lateral, vá em **"APIs & Services" > "Library"**
2. Procure por **"Google+ API"** ou **"People API"**
3. Clique em **"Enable"**

### Passo 3: Configurar Tela de Consentimento OAuth
1. Vá em **"APIs & Services" > "OAuth consent screen"**
2. Escolha **"External"** (para desenvolvimento)
3. Preencha as informações obrigatórias:
   ```
   App name: Freelance Management System
   User support email: seu_email@gmail.com
   Developer contact information: seu_email@gmail.com
   ```
4. Clique em **"Save and Continue"**
5. Em **"Scopes"**, clique **"Save and Continue"** (sem adicionar escopos)
6. Em **"Test users"**, adicione seu email para testes
7. Clique em **"Save and Continue"**

### Passo 4: Criar Credenciais OAuth
1. Vá em **"APIs & Services" > "Credentials"**
2. Clique em **"+ CREATE CREDENTIALS"**
3. Selecione **"OAuth 2.0 Client IDs"**
4. Escolha **"Web application"**
5. Preencha:
   ```
   Name: Freelance Management System
   Authorized JavaScript origins: http://localhost:3003
   Authorized redirect URIs: http://localhost:3003/auth/callback
   ```
6. Clique em **"Create"**

### Passo 5: Obter Client ID
1. Após criar, você verá uma janela com:
   - **Client ID**: Copie este valor
   - **Client Secret**: Copie este valor (opcional para frontend)

### Passo 6: Configurar no .env
```bash
# No arquivo api/.env
GOOGLE_CLIENT_ID="seu_client_id_aqui"
GOOGLE_CLIENT_SECRET="seu_client_secret_aqui"

# No arquivo frontend/.env
REACT_APP_GOOGLE_CLIENT_ID="seu_client_id_aqui"
```

---

## 📁 Configuração dos Arquivos .env

### Backend (.env no diretório /api)
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT
JWT_SECRET="sua_chave_secreta_jwt_muito_segura_aqui"

# GitHub OAuth
GITHUB_CLIENT_ID="seu_github_client_id"
GITHUB_CLIENT_SECRET="seu_github_client_secret"
GITHUB_REDIRECT_URI="http://localhost:3003/auth/callback"

# Google OAuth
GOOGLE_CLIENT_ID="seu_google_client_id"
GOOGLE_CLIENT_SECRET="seu_google_client_secret"

# Server
PORT=3000
```

### Frontend (.env no diretório /frontend)
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3000

# OAuth Configuration
REACT_APP_GITHUB_CLIENT_ID="seu_github_client_id"
REACT_APP_GOOGLE_CLIENT_ID="seu_google_client_id"
REACT_APP_REDIRECT_URI="http://localhost:3003/auth/callback"
```

---

## 🚀 Comandos para Configurar

### 1. Copiar arquivos de exemplo
```bash
# Backend
cd api
cp .env.example .env

# Frontend
cd ../frontend
cp .env.example .env
```

### 2. Editar os arquivos .env
```bash
# Editar backend
nano api/.env
# ou
code api/.env

# Editar frontend
nano frontend/.env
# ou
code frontend/.env
```

### 3. Reiniciar os servidores
```bash
# Backend
cd api
npm run start:dev

# Frontend (em outro terminal)
cd frontend
PORT=3003 npm start
```

---

## ⚠️ Dicas Importantes

### Segurança
- **NUNCA** commite arquivos `.env` no Git
- Use chaves JWT fortes (pelo menos 32 caracteres)
- Para produção, use URLs HTTPS

### URLs de Callback
- Desenvolvimento: `http://localhost:3003/auth/callback`
- Produção: `https://seudominio.com/auth/callback`

### Troubleshooting
1. **"redirect_uri_mismatch"**: Verifique se as URLs estão exatamente iguais
2. **"invalid_client"**: Verifique se o Client ID está correto
3. **CORS errors**: Certifique-se que as origens estão configuradas

### Testando as Configurações
1. Acesse: http://localhost:3003
2. Clique em "Login with GitHub" ou "Login with Google"
3. Autorize a aplicação
4. Você deve ser redirecionado de volta logado

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique se todas as URLs estão corretas
2. Confirme que as APIs estão habilitadas
3. Teste com um usuário de teste primeiro
4. Verifique os logs do console do navegador

**Pronto! Suas credenciais OAuth estão configuradas! 🎉**