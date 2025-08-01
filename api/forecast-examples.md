# 📊 Exemplos de Previsão Mensal

## 🚀 Gerar Previsão para Janeiro/2024

```powershell
curl -X POST http://localhost:3000/forecast/generate -H "Content-Type: application/json" -d '{"workScheduleId":"on512uiik","month":1,"year":2024,"includeHolidays":false}'
```

## 🚀 Gerar Previsão para Fevereiro/2024

```powershell
curl -X POST http://localhost:3000/forecast/generate -H "Content-Type: application/json" -d '{"workScheduleId":"on512uiik","month":2,"year":2024,"includeHolidays":false}'
```

## 🚀 Gerar Previsão para Março/2024

```powershell
curl -X POST http://localhost:3000/forecast/generate -H "Content-Type: application/json" -d '{"workScheduleId":"on512uiik","month":3,"year":2024,"includeHolidays":false}'
```

## 📋 Consultar Previsões

### Listar todas as previsões:
```powershell
curl http://localhost:3000/forecast
```

### Buscar previsão por ID:
```powershell
curl http://localhost:3000/forecast/FORECAST_ID_AQUI
```

### Buscar previsões por agenda:
```powershell
curl http://localhost:3000/forecast/work-schedule/on512uiik
```

## 📊 Exemplo de Resposta

```json
{
  "id": "abc123def",
  "workScheduleId": "on512uiik",
  "month": 1,
  "year": 2024,
  "totalWorkDays": 22,
  "totalWorkHours": 220,
  "workDays": [
    {
      "date": "2024-01-01",
      "dayOfWeek": 1,
      "dayName": "Segunda-feira",
      "isWorkDay": true,
      "startTime": "07:00",
      "endTime": "17:00",
      "workHours": 10,
      "isHoliday": false,
      "holidayName": null
    },
    {
      "date": "2024-01-02",
      "dayOfWeek": 2,
      "dayName": "Terça-feira",
      "isWorkDay": true,
      "startTime": "07:00",
      "endTime": "17:00",
      "workHours": 10,
      "isHoliday": false,
      "holidayName": null
    }
    // ... todos os dias do mês
  ],
  "createdAt": "2024-01-22T20:45:00.000Z",
  "updatedAt": "2024-01-22T20:45:00.000Z"
}
```

## 🎯 Parâmetros

- **workScheduleId**: ID da agenda de trabalho (ex: "on512uiik")
- **month**: Mês (1-12)
- **year**: Ano (ex: 2024)
- **includeHolidays**: Incluir feriados (true/false) - opcional

## 📈 Cálculos Automáticos

- **Total de dias úteis** no mês
- **Total de horas trabalhadas** no mês
- **Horários específicos** de cada dia baseado na agenda
- **Dias de trabalho** configurados na agenda 