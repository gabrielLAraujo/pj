# Comandos cURL para PowerShell (uma linha)

## 1. Criar Agenda de Trabalho

```powershell
curl -X POST http://localhost:3000/work-schedule -H "Content-Type: application/json" -d '{"startDate":"2024-01-01T00:00:00.000Z","endDate":"2024-12-31T23:59:59.999Z","days":{"monday":true,"tuesday":true,"wednesday":true,"thursday":true,"friday":true,"saturday":false,"sunday":false}}'
```

## 2. Criar Dias de Trabalho (Substitua AGENDA_ID pelo ID retornado acima)

### Segunda-feira

```powershell
curl -X POST http://localhost:3000/work-schedule-day -H "Content-Type: application/json" -d '{"workScheduleId":"AGENDA_ID","dayOfWeek":1,"startTime":"07:00","endTime":"17:00"}'
```

### Terça-feira

```powershell
curl -X POST http://localhost:3000/work-schedule-day -H "Content-Type: application/json" -d '{"workScheduleId":"AGENDA_ID","dayOfWeek":2,"startTime":"07:00","endTime":"17:00"}'
```

### Quarta-feira

```powershell
curl -X POST http://localhost:3000/work-schedule-day -H "Content-Type: application/json" -d '{"workScheduleId":"AGENDA_ID","dayOfWeek":3,"startTime":"07:00","endTime":"17:00"}'
```

### Quinta-feira

```powershell
curl -X POST http://localhost:3000/work-schedule-day -H "Content-Type: application/json" -d '{"workScheduleId":"AGENDA_ID","dayOfWeek":4,"startTime":"07:00","endTime":"17:00"}'
```

### Sexta-feira

```powershell
curl -X POST http://localhost:3000/work-schedule-day -H "Content-Type: application/json" -d '{"workScheduleId":"AGENDA_ID","dayOfWeek":5,"startTime":"07:00","endTime":"17:00"}'
```

## 3. Verificar Dados

```powershell
# Listar agendas
curl http://localhost:3000/work-schedule

# Listar dias
curl http://localhost:3000/work-schedule-day

# Listar dias de uma agenda específica
curl http://localhost:3000/work-schedule-day/work-schedule/AGENDA_ID
```

## 4. Swagger UI

```
http://localhost:3000/api
```
