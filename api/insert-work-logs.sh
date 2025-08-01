#!/bin/bash

echo "🕐 Inserindo work logs..."
echo "================================"

# Usar o userId correto dos projetos existentes
USER_ID="1b4caf79-91b9-425b-8335-d1ff3eae12a5"
PROJECT_ID="0ca88a01-51c1-4f43-b524-6871b73cc1a5"

echo "🆔 Usando User ID: $USER_ID"
echo "📁 Usando Project ID: $PROJECT_ID"

# Criar work logs com dados válidos
echo "\n⏰ Criando work logs..."

echo "\n📝 Work log 1..."
WORKLOG1=$(curl -s -X POST http://localhost:3000/work-logs \
    -H "Content-Type: application/json" \
    -d "{
        \"userId\": \"$USER_ID\",
        \"projectId\": \"$PROJECT_ID\",
        \"date\": \"2024-01-15\",
        \"startTime\": \"2024-01-15T09:00:00Z\",
        \"endTime\": \"2024-01-15T12:00:00Z\",
        \"description\": \"Desenvolvimento da página inicial do e-commerce\",
        \"hoursWorked\": 3
    }")
echo "Resposta: $WORKLOG1"

echo "\n📝 Work log 2..."
WORKLOG2=$(curl -s -X POST http://localhost:3000/work-logs \
    -H "Content-Type: application/json" \
    -d "{
        \"userId\": \"$USER_ID\",
        \"projectId\": \"$PROJECT_ID\",
        \"date\": \"2024-01-16\",
        \"startTime\": \"2024-01-16T14:00:00Z\",
        \"endTime\": \"2024-01-16T18:00:00Z\",
        \"description\": \"Implementação do sistema de carrinho de compras\",
        \"hoursWorked\": 4
    }")
echo "Resposta: $WORKLOG2"

echo "\n📝 Work log 3..."
WORKLOG3=$(curl -s -X POST http://localhost:3000/work-logs \
    -H "Content-Type: application/json" \
    -d "{
        \"userId\": \"$USER_ID\",
        \"projectId\": \"$PROJECT_ID\",
        \"date\": \"2024-01-17\",
        \"startTime\": \"2024-01-17T10:00:00Z\",
        \"endTime\": \"2024-01-17T16:00:00Z\",
        \"description\": \"Integração com gateway de pagamento\",
        \"hoursWorked\": 6
    }")
echo "Resposta: $WORKLOG3"

echo "\n📝 Work log 4..."
WORKLOG4=$(curl -s -X POST http://localhost:3000/work-logs \
    -H "Content-Type: application/json" \
    -d "{
        \"userId\": \"$USER_ID\",
        \"projectId\": \"$PROJECT_ID\",
        \"date\": \"2024-01-18\",
        \"startTime\": \"2024-01-18T08:30:00Z\",
        \"endTime\": \"2024-01-18T11:30:00Z\",
        \"description\": \"Testes de funcionalidade e correção de bugs\",
        \"hoursWorked\": 3
    }")
echo "Resposta: $WORKLOG4"

echo "\n📝 Work log 5..."
WORKLOG5=$(curl -s -X POST http://localhost:3000/work-logs \
    -H "Content-Type: application/json" \
    -d "{
        \"userId\": \"$USER_ID\",
        \"projectId\": \"$PROJECT_ID\",
        \"date\": \"2024-01-19\",
        \"startTime\": \"2024-01-19T13:00:00Z\",
        \"endTime\": \"2024-01-19T17:00:00Z\",
        \"description\": \"Otimização de performance e deploy\",
        \"hoursWorked\": 4
    }")
echo "Resposta: $WORKLOG5"

# Também criar alguns work logs para o segundo projeto
PROJECT2_ID="ce6bfcf6-a0b9-4cb0-9938-8dd316c2ceac"
echo "\n📱 Criando work logs para o projeto Mobile App..."

echo "\n📝 Work log 6 (Mobile)..."
WORKLOG6=$(curl -s -X POST http://localhost:3000/work-logs \
    -H "Content-Type: application/json" \
    -d "{
        \"userId\": \"$USER_ID\",
        \"projectId\": \"$PROJECT2_ID\",
        \"date\": \"2024-01-20\",
        \"startTime\": \"2024-01-20T09:00:00Z\",
        \"endTime\": \"2024-01-20T13:00:00Z\",
        \"description\": \"Setup inicial do projeto React Native\",
        \"hoursWorked\": 4
    }")
echo "Resposta: $WORKLOG6"

echo "\n📝 Work log 7 (Mobile)..."
WORKLOG7=$(curl -s -X POST http://localhost:3000/work-logs \
    -H "Content-Type: application/json" \
    -d "{
        \"userId\": \"$USER_ID\",
        \"projectId\": \"$PROJECT2_ID\",
        \"date\": \"2024-01-21\",
        \"startTime\": \"2024-01-21T14:00:00Z\",
        \"endTime\": \"2024-01-21T18:00:00Z\",
        \"description\": \"Desenvolvimento das telas de autenticação\",
        \"hoursWorked\": 4
    }")
echo "Resposta: $WORKLOG7"

echo "\n\n✅ Work logs inseridos com sucesso!"
echo "\n🧪 Para testar, use:"
echo "curl 'http://localhost:3000/work-logs?userId=$USER_ID'"
echo "curl 'http://localhost:3000/work-logs?userId=$USER_ID&projectId=$PROJECT_ID'"
echo "curl 'http://localhost:3000/projects?userId=$USER_ID'"
echo "\n📊 Para ver no navegador:"
echo "http://localhost:3000/api (Swagger Documentation)"
echo "http://localhost:3001 (Frontend)"