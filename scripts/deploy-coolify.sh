#!/bin/bash

# Freelance Manager - Deploy no Coolify
# Este script prepara o projeto para deploy no Coolify

set -e

echo "🚀 Preparando deploy para Coolify"
echo "================================="

# Verificar se estamos na raiz do projeto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Execute este script na raiz do projeto (onde está o docker-compose.yml)"
    exit 1
fi

# Verificar se existe .env.example
if [ ! -f ".env.example" ]; then
    echo "❌ Arquivo .env.example não encontrado"
    exit 1
fi

echo "✅ Estrutura do projeto verificada"

# Verificar arquivos Docker
echo "📋 Verificando arquivos Docker..."

files_to_check=(
    "docker-compose.yml"
    "api/Dockerfile"
    "frontend/Dockerfile"
    "frontend/nginx.conf"
    "api/healthcheck.js"
    "api/nixpacks.toml"
    "frontend/nixpacks.toml"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file não encontrado"
        exit 1
    fi
done

echo ""
echo "🔧 Checklist para deploy no Coolify:"
echo ""
echo "1. ✅ Arquivos Docker criados"
echo "2. 📝 Configure as variáveis de ambiente no Coolify:"
echo ""
echo "   Variáveis obrigatórias:"
echo "   - DATABASE_URL"
echo "   - JWT_SECRET (gere uma chave segura)"
echo "   - POSTGRES_PASSWORD"
echo "   - GITHUB_CLIENT_ID"
echo "   - GITHUB_CLIENT_SECRET"
echo "   - FRONTEND_URL (URL do seu domínio)"
echo "   - REACT_APP_API_URL (URL da API)"
echo "   - REACT_APP_REDIRECT_URI (URL de callback)"
echo ""
echo "3. 🌐 No Coolify:"
echo "   - Crie um novo recurso → Application"
echo "   - Selecione 'Docker Compose'"
echo "   - Cole a URL do seu repositório Git"
echo "   - Configure as variáveis de ambiente"
echo "   - Faça o deploy!"
echo ""
echo "4. 🔗 Configurar domínios:"
echo "   - Frontend: seu-dominio.com"
echo "   - API: api.seu-dominio.com"
echo ""
echo "5. 🔒 SSL será configurado automaticamente pelo Coolify"
echo ""

# Gerar exemplo de variáveis para produção
echo "📝 Gerando exemplo de variáveis para produção..."
cat > .env.coolify.example << EOF
# Variáveis de ambiente para Coolify (Produção)
# Copie estas variáveis para o painel do Coolify

# Database
DATABASE_URL=postgresql://freelance_user:CHANGE_THIS_PASSWORD@postgres:5432/freelance_manager
POSTGRES_PASSWORD=CHANGE_THIS_PASSWORD

# JWT (GERE UMA CHAVE SEGURA!)
JWT_SECRET=CHANGE_THIS_TO_A_SECURE_RANDOM_STRING

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# URLs (ALTERE PARA SEU DOMÍNIO!)
FRONTEND_URL=https://your-domain.com
REACT_APP_API_URL=https://api.your-domain.com
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
REACT_APP_REDIRECT_URI=https://your-domain.com/auth/callback

# Opcional: Redis
REDIS_URL=redis://redis:6379
EOF

echo "✅ Arquivo .env.coolify.example criado"
echo ""
echo "🎯 Próximos passos:"
echo "1. Faça commit e push das alterações"
echo "2. Configure o projeto no Coolify"
echo "3. Use as variáveis do arquivo .env.coolify.example"
echo "4. Configure seus domínios"
echo ""
echo "📚 Consulte o arquivo DEPLOY_COOLIFY.md para instruções detalhadas"
echo ""
echo "🎉 Projeto pronto para deploy no Coolify!"