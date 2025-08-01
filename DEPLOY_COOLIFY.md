# Deploy no Coolify - Freelance Manager

Este guia explica como fazer o deploy da aplicação Freelance Manager no Coolify.

## 📋 Pré-requisitos

1. **Servidor Coolify configurado e funcionando**
2. **Repositório Git** com o código do projeto
3. **Variáveis de ambiente** configuradas
4. **Banco de dados PostgreSQL** (pode ser criado no próprio Coolify)
5. **Docker** e **Docker Compose** (já incluídos no Coolify)

## 🚀 Opções de Deploy

O Coolify oferece várias opções de deploy. Para este projeto, recomendamos:

### Opção 1: Deploy via Docker Compose (Recomendado) 🐳

Esta é a opção mais simples e completa, usando o arquivo `docker-compose.yml` incluído:

1. **Criar novo projeto no Coolify**
   - Acesse seu painel do Coolify
   - Clique em "New Resource" → "Application"
   - Selecione "Docker Compose"

2. **Configurar repositório**
   - Cole a URL do seu repositório Git
   - Selecione a branch (geralmente `main` ou `master`)
   - Defina o diretório raiz como `/` (raiz do projeto)

3. **Configurar variáveis de ambiente**
   - Copie as variáveis do arquivo `.env.example`
   - Configure os valores apropriados para produção
   - **Importante**: Altere `JWT_SECRET` e `POSTGRES_PASSWORD`

4. **Deploy automático**
   - O Coolify detectará automaticamente o `docker-compose.yml`
   - Todos os serviços serão criados: PostgreSQL, API, Frontend e Redis
   - As portas serão expostas automaticamente

### Opção 2: Deploy via Git (Nixpacks)
### Opção 3: Deploy via Dockerfile Individual

## 🐳 Arquivos Docker Criados

O projeto agora inclui os seguintes arquivos para facilitar o deploy:

- `docker-compose.yml` - Orquestração completa dos serviços
- `api/Dockerfile` - Container do backend NestJS
- `frontend/Dockerfile` - Container do frontend React
- `frontend/nginx.conf` - Configuração do Nginx
- `api/healthcheck.js` - Health check do backend
- `.env.example` - Exemplo de variáveis de ambiente

### 1. Servidor com Coolify

Você precisa de um servidor com Coolify instalado. Se ainda não tem:

**Requisitos mínimos do servidor:** <mcreference link="https://coolify.io/docs/get-started/installation" index="5">5</mcreference>
- CPU: 2 cores
- RAM: 2 GB
- Storage: 30 GB de espaço livre
- Sistema operacional: Linux (Ubuntu, Debian, CentOS, etc.)

**Instalação do Coolify:** <mcreference link="https://coolify.io/docs/get-started/installation" index="5">5</mcreference>
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

### 2. Repositório Git

Seu código deve estar em um repositório Git (GitHub, GitLab, etc.).

## Estrutura do Projeto

Nosso projeto tem a seguinte estrutura:
```
├── api/          # Backend NestJS
├── frontend/     # Frontend React
└── package.json  # Root package.json
```

## Deploy do Backend (API)

### 1. Criar Nova Aplicação no Coolify

1. Acesse seu painel do Coolify
2. Vá em **Projects** → **New Resource** → **Application**
3. Conecte seu repositório Git
4. Configure os seguintes parâmetros:

### 2. Configurações da Aplicação

**General:**
- **Name:** `freelance-manager-api`
- **Branch:** `main` (ou sua branch principal)
- **Base Directory:** `api` <mcreference link="https://coolify.io/docs/applications/" index="1">1</mcreference>
- **Port Exposes:** `3000` <mcreference link="https://coolify.io/docs/applications/" index="1">1</mcreference>

**Build Configuration:**
- **Build Pack:** Nixpacks (padrão) <mcreference link="https://coolify.io/docs/applications/" index="1">1</mcreference>
- **Install Command:** `npm ci`
- **Build Command:** `npm run build`
- **Start Command:** `npm run start:prod`

### 3. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente:

```env
# Database
DATABASE_URL=postgresql://username:password@host:5432/database

# JWT
JWT_SECRET=your-jwt-secret-key

# OAuth (se usando)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# CORS
FRONTEND_URL=https://your-frontend-domain.com

# Node Environment
NODE_ENV=production
```

### 4. Banco de Dados

**Opção 1: Usar banco do Coolify**
1. Vá em **New Resource** → **Database** → **PostgreSQL**
2. Configure nome e senha
3. Use a URL de conexão gerada nas variáveis de ambiente

**Opção 2: Banco externo**
Use um serviço como Railway, Supabase ou AWS RDS.

### 5. Configurações Adicionais

**Health Check:**
- **Path:** `/health` (se implementado) ou `/`
- **Port:** `3000`

**Persistent Storage:** <mcreference link="https://coolify.io/docs/applications/" index="1">1</mcreference>
Se necessário para uploads ou logs:
- **Source:** `/app/uploads`
- **Destination:** `/data/uploads`

## Deploy do Frontend

### 1. Criar Nova Aplicação

1. **New Resource** → **Application**
2. Mesmo repositório, mas configuração diferente:

**General:**
- **Name:** `freelance-manager-frontend`
- **Branch:** `main`
- **Base Directory:** `frontend` <mcreference link="https://coolify.io/docs/applications/" index="1">1</mcreference>
- **Port Exposes:** `3000`
- **Static Site:** `true` <mcreference link="https://coolify.io/docs/applications/" index="1">1</mcreference>
- **Public Directory:** `build` <mcreference link="https://coolify.io/docs/applications/" index="1">1</mcreference>

### 2. Build Configuration

```
Install Command: npm ci
Build Command: npm run build
Start Command: (deixar vazio para sites estáticos)
```

### 3. Variáveis de Ambiente

```env
# API URL
REACT_APP_API_URL=https://your-api-domain.com

# OAuth (se usando)
REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
REACT_APP_REDIRECT_URI=https://your-frontend-domain.com/auth/callback

# Build
GENERATE_SOURCEMAP=false
```

## Configuração de Domínios

### 1. Configurar DNS

Aponte seus domínios para o IP do servidor:
```
api.seudominio.com → IP_DO_SERVIDOR
app.seudominio.com → IP_DO_SERVIDOR
```

### 2. Adicionar Domínios no Coolify

1. Vá na aplicação → **Domains**
2. Adicione os domínios:
   - API: `api.seudominio.com`
   - Frontend: `app.seudominio.com`

### 3. SSL Automático

O Coolify configura automaticamente certificados SSL via Let's Encrypt. <mcreference link="https://coolify.io/docs/" index="4">4</mcreference>

## Configurações Especiais para Prisma

### 1. Variável de Ambiente

Adicione no backend: <mcreference link="https://sreyaj.dev/deploy-nodejs-applications-on-a-vps-using-coolify" index="3">3</mcreference>
```env
DATABASE_URL=postgresql://username:password@host:5432/database
```

### 2. Build Script

Certifique-se que o `package.json` do backend tem:
```json
{
  "scripts": {
    "build": "npm run prisma:generate && npm run build:nest",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy",
    "build:nest": "nest build",
    "start:prod": "npm run prisma:migrate && node dist/main"
  }
}
```

## Deploy Automático

### 1. Configurar Auto Deploy

1. Vá na aplicação → **General**
2. Ative **Auto Deploy** <mcreference link="https://coolify.io/docs/applications/" index="1">1</mcreference>
3. Configure **Webhook** se necessário

### 2. Preview Deployments

Para testar PRs automaticamente: <mcreference link="https://coolify.io/docs/applications/" index="1">1</mcreference>
1. Ative **Preview Deployments**
2. Configure **URL Template:** `{{pr_id}}.preview.seudominio.com`

## Monitoramento

### 1. Logs

- Acesse **Logs** na aplicação para ver logs em tempo real
- Configure **Log Retention** conforme necessário

### 2. Métricas

- Monitor CPU, RAM e storage no dashboard
- Configure alertas se necessário <mcreference link="https://coolify.io/docs/" index="4">4</mcreference>

## Troubleshooting

### 1. Problemas Comuns

**Build falha:**
- Verifique se o `Base Directory` está correto
- Confirme se as dependências estão no `package.json`
- Verifique logs de build

**Aplicação não inicia:**
- Verifique `Port Exposes`
- Confirme variáveis de ambiente
- Verifique logs da aplicação

**Banco de dados:**
- Teste conexão com a `DATABASE_URL`
- Verifique se migrations rodaram
- Confirme se o banco está acessível

### 2. Comandos Úteis

**Executar migrations manualmente:**
1. Vá em **Terminal** na aplicação
2. Execute: `npx prisma migrate deploy`

**Verificar status:**
```bash
# Ver containers rodando
docker ps

# Ver logs
docker logs container_name
```

## Backup

### 1. Configurar Backup Automático

1. Vá em **Backups**
2. Configure S3 ou storage compatível <mcreference link="https://coolify.io/docs/" index="4">4</mcreference>
3. Defina frequência (diário, semanal)

### 2. Backup Manual

```bash
# Backup do banco
pg_dump $DATABASE_URL > backup.sql

# Backup de arquivos
tar -czf backup.tar.gz /data/uploads
```

## Recursos Adicionais

- [Documentação Oficial do Coolify](https://coolify.io/docs/) <mcreference link="https://coolify.io/docs/" index="4">4</mcreference>
- [Exemplos de Deploy](https://github.com/coollabsio/coolify-examples) <mcreference link="https://github.com/coollabsio/coolify-examples" index="2">2</mcreference>
- [Guia de Deploy Node.js](https://sreyaj.dev/deploy-nodejs-applications-on-a-vps-using-coolify) <mcreference link="https://sreyaj.dev/deploy-nodejs-applications-on-a-vps-using-coolify" index="3">3</mcreference>

## Checklist de Deploy

- [ ] Servidor com Coolify instalado
- [ ] Repositório Git configurado
- [ ] Banco de dados criado
- [ ] Variáveis de ambiente configuradas
- [ ] Backend deployado e funcionando
- [ ] Frontend deployado e funcionando
- [ ] Domínios configurados
- [ ] SSL ativo
- [ ] Auto deploy configurado
- [ ] Backup configurado
- [ ] Monitoramento ativo

Com este guia, você deve conseguir fazer o deploy completo da aplicação Freelance Manager no Coolify!