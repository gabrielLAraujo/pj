#!/bin/bash

echo "🕐 Inserindo dados na API..."
echo "================================"

# 1. Criar agenda de trabalho
echo "📅 Criando agenda de trabalho..."
AGENDA_RESPONSE=$(curl -s -X POST http://localhost:3000/work-schedule \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.999Z",
    "days": {
      "monday": true,
      "tuesday": true,
      "wednesday": true,
      "thursday": true,
      "friday": true,
      "saturday": false,
      "sunday": false
    }
  }')

echo "✅ Agenda criada: $AGENDA_RESPONSE"

# Extrair ID da agenda
AGENDA_ID=$(echo $AGENDA_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "🆔 ID da agenda: $AGENDA_ID"

echo ""
echo "📝 Criando dias de trabalho..."

# 2. Criar segunda-feira
echo "📅 Segunda-feira..."
curl -s -X POST http://localhost:3000/work-schedule-day \
  -H "Content-Type: application/json" \
  -d "{
    \"workScheduleId\": \"$AGENDA_ID\",
    \"dayOfWeek\": 1,
    \"startTime\": \"07:00\",
    \"endTime\": \"17:00\"
  }"

# 3. Criar terça-feira
echo ""
echo "📅 Terça-feira..."
curl -s -X POST http://localhost:3000/work-schedule-day \
  -H "Content-Type: application/json" \
  -d "{
    \"workScheduleId\": \"$AGENDA_ID\",
    \"dayOfWeek\": 2,
    \"startTime\": \"07:00\",
    \"endTime\": \"17:00\"
  }"

# 4. Criar quarta-feira
echo ""
echo "📅 Quarta-feira..."
curl -s -X POST http://localhost:3000/work-schedule-day \
  -H "Content-Type: application/json" \
  -d "{
    \"workScheduleId\": \"$AGENDA_ID\",
    \"dayOfWeek\": 3,
    \"startTime\": \"07:00\",
    \"endTime\": \"17:00\"
  }"

# 5. Criar quinta-feira
echo ""
echo "📅 Quinta-feira..."
curl -s -X POST http://localhost:3000/work-schedule-day \
  -H "Content-Type: application/json" \
  -d "{
    \"workScheduleId\": \"$AGENDA_ID\",
    \"dayOfWeek\": 4,
    \"startTime\": \"07:00\",
    \"endTime\": \"17:00\"
  }"

# 6. Criar sexta-feira
echo ""
echo "📅 Sexta-feira..."
curl -s -X POST http://localhost:3000/work-schedule-day \
  -H "Content-Type: application/json" \
  -d "{
    \"workScheduleId\": \"$AGENDA_ID\",
    \"dayOfWeek\": 5,
    \"startTime\": \"07:00\",
    \"endTime\": \"17:00\"
  }"

echo ""
echo "🎉 Dados inseridos com sucesso!"
echo "================================"
echo "📊 Verificar dados criados:"
echo "curl http://localhost:3000/work-schedule-day/work-schedule/$AGENDA_ID" 