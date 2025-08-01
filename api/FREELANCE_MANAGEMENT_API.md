# Freelance Management API

A comprehensive API for freelance developers to manage projects, track time, log work activities, and generate financial forecasts.

## Features

### 🎯 Project Management
- Create and manage projects with custom hourly rates
- Set project status (Active, Completed, Paused, Cancelled)
- Define project timelines with start and end dates
- Support for multiple currencies

### ⏰ Time Tracking
- Log daily work hours with detailed descriptions
- Track start and end times for work sessions
- Link work logs to specific projects and tasks
- Calculate costs automatically based on project hourly rates

### 📋 Task Management
- Create and organize tasks within projects
- Set task priorities (Low, Medium, High, Urgent)
- Track task status (Todo, In Progress, Completed, Cancelled)
- Estimate vs actual hours tracking

### 📊 Work Schedule & Forecasting
- Define custom work schedules (e.g., Mon-Fri 9-17 with lunch break)
- Generate monthly forecasts based on work schedules
- Calculate projected earnings for upcoming months
- Support for holidays and non-working days

### 📈 Reporting & Analytics
- Project summaries with total hours and costs
- Time period filtering for detailed analysis
- Work log summaries by project
- Financial forecasting based on work patterns

## API Endpoints

### Projects
- `POST /projects` - Create a new project
- `GET /projects` - List all projects for a user
- `GET /projects/:id` - Get project details
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Work Logs
- `POST /work-logs` - Create a work log entry
- `GET /work-logs` - List work logs (with optional project filter)
- `GET /work-logs/:id` - Get specific work log
- `PATCH /work-logs/:id` - Update work log
- `DELETE /work-logs/:id` - Delete work log
- `GET /work-logs/project/:projectId/summary` - Get project work summary

### Tasks
- `POST /tasks` - Create a new task
- `GET /tasks` - List tasks (with optional project filter)
- `GET /tasks/by-status/:status` - Get tasks by status
- `GET /tasks/:id` - Get task details
- `PATCH /tasks/:id` - Update task
- `PATCH /tasks/:id/actual-hours` - Update actual hours
- `DELETE /tasks/:id` - Delete task

### Work Schedules
- `POST /work-schedules` - Create work schedule
- `GET /work-schedules` - List work schedules
- `GET /work-schedules/:id` - Get schedule details
- `PATCH /work-schedules/:id` - Update schedule
- `DELETE /work-schedules/:id` - Delete schedule

### Forecasting
- `POST /forecast/generate` - Generate monthly forecast
- `GET /forecast` - List all forecasts
- `GET /forecast/:id` - Get specific forecast

## Example Usage

### 1. Create a Project
```json
POST /projects
{
  "name": "E-commerce Website",
  "description": "Building a modern e-commerce platform",
  "hourlyRate": 75.0,
  "currency": "USD",
  "status": "ACTIVE",
  "startDate": "2024-01-15",
  "userId": "user-id"
}
```

### 2. Log Work Hours
```json
POST /work-logs
{
  "date": "2024-01-15",
  "startTime": "2024-01-15T09:00:00Z",
  "endTime": "2024-01-15T17:00:00Z",
  "hoursWorked": 7.0,
  "description": "Implemented user authentication and product catalog",
  "projectId": "project-id",
  "userId": "user-id"
}
```

### 3. Create a Task
```json
POST /tasks
{
  "title": "Implement Payment Gateway",
  "description": "Integrate Stripe payment processing",
  "status": "TODO",
  "priority": "HIGH",
  "estimatedHours": 12.0,
  "projectId": "project-id",
  "userId": "user-id"
}
```

### 4. Generate Monthly Forecast
```json
POST /forecast/generate
{
  "workScheduleId": "schedule-id",
  "month": 2,
  "year": 2024,
  "includeHolidays": false
}
```

### 5. Get Project Summary
```
GET /work-logs/project/{projectId}/summary?userId={userId}&startDate=2024-01-01&endDate=2024-01-31
```

Response:
```json
{
  "projectId": "project-id",
  "projectName": "E-commerce Website",
  "totalHours": 120.5,
  "totalCost": 9037.50,
  "currency": "USD",
  "workLogCount": 24,
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }
}
```

## Database Schema

The API uses PostgreSQL with the following main entities:

- **Projects**: Store project information with hourly rates and status
- **WorkLogs**: Track daily work entries with time and cost calculations
- **Tasks**: Organize work into manageable tasks with estimates
- **WorkSchedules**: Define working hours and patterns
- **Users**: Manage user accounts and authentication

## Getting Started

1. Install dependencies: `npm install`
2. Set up your PostgreSQL database
3. Configure environment variables in `.env`
4. Run migrations: `npx prisma migrate dev`
5. Start the server: `npm run start:dev`
6. Access Swagger documentation at `http://localhost:3000/api`

## Environment Variables

```env
DATABASE_URL="postgresql://username:password@localhost:5432/freelance_db"
JWT_SECRET="your-jwt-secret"
PORT=3000
```

This API provides everything a freelance developer needs to manage their projects efficiently, track time accurately, and forecast their earnings based on realistic work schedules.