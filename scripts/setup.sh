#!/bin/bash

# Freelance Manager Setup Script
# Este script configura o ambiente para desenvolvimento ou produção

set -e

echo "🚀 Freelance Manager Setup"
echo "========================="

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar dependências
echo "📋 Verificando dependências..."

if ! command_exists docker; then
    echo "❌ Docker não encontrado. Por favor, instale o Docker primeiro."
    exit 1
fi

if ! command_exists docker-compose; then
    echo "❌ Docker Compose não encontrado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados"

# Verificar se existe .env
if [ ! -f ".env" ]; then
    echo "📝 Criando arquivo .env a partir do .env.example..."
    cp .env.example .env
    echo "⚠️  Por favor, edite o arquivo .env com suas configurações antes de continuar."
    echo "   Especialmente: JWT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET"
    read -p "Pressione Enter quando terminar de editar o .env..."
fi

# Perguntar o tipo de setup
echo ""
echo "🔧 Escolha o tipo de setup:"
echo "1) Desenvolvimento (com hot reload)"
echo "2) Produção (containers otimizados)"
read -p "Digite sua escolha (1 ou 2): " choice

case $choice in
    1)
        echo "🔨 Configurando ambiente de desenvolvimento..."
        
        # Instalar dependências do backend
        echo "📦 Instalando dependências do backend..."
        cd api
        npm install
        
        # Gerar Prisma client
        echo "🗄️  Gerando Prisma client..."
        npx prisma generate
        
        # Voltar para raiz e instalar frontend
        cd ..
        echo "📦 Instalando dependências do frontend..."
        cd frontend
        npm install
        cd ..
        
        echo "✅ Setup de desenvolvimento concluído!"
        echo ""
        echo "Para iniciar o desenvolvimento:"
        echo "1. Backend: cd api && npm run start:dev"
        echo "2. Frontend: cd frontend && npm start"
        echo "3. Banco: docker-compose up postgres redis"
        ;;
    2)
        echo "🏭 Configurando ambiente de produção..."
        
        # Build e start com docker-compose
        echo "🐳 Construindo e iniciando containers..."
        docker-compose up --build -d
        
        # Aguardar banco estar pronto
        echo "⏳ Aguardando banco de dados..."
        sleep 10
        
        # Executar migrações
        echo "🗄️  Executando migrações do banco..."
        docker-compose exec api npx prisma migrate deploy
        
        echo "✅ Setup de produção concluído!"
        echo ""
        echo "Aplicação rodando em:"
        echo "- Frontend: http://localhost:3003"
        echo "- Backend: http://localhost:3000"
        echo "- Banco: localhost:5432"
        echo ""
        echo "Para parar: docker-compose down"
        echo "Para logs: docker-compose logs -f"
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac

echo ""
echo "🎉 Setup concluído com sucesso!"