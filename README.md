# Freelance Management System

A comprehensive freelance management system built with NestJS (API) and React TypeScript (Frontend).

## 🏗️ Project Structure

```
├── api/                    # NestJS Backend API
│   ├── src/               # Source code
│   ├── prisma/            # Database schema and migrations
│   └── package.json       # API dependencies
├── frontend/              # React TypeScript Frontend
│   ├── src/               # Source code
│   └── package.json       # Frontend dependencies
└── package.json           # Root package.json with monorepo scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL database

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up the database:**
   ```bash
   cd api
   # Copy and configure your .env file
   cp .env.example .env
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database (optional)
   npm run seed
   ```

### Development

**Run both API and Frontend simultaneously:**
```bash
npm run dev
```

This will start:
- API server on `http://localhost:3000`
- Frontend on `http://localhost:3001`

**Run services individually:**
```bash
# API only
npm run dev:api

# Frontend only
npm run dev:frontend
```

## 📋 Available Scripts

### Root Level Scripts
- `npm run dev` - Start both API and frontend in development mode
- `npm run build` - Build both API and frontend for production
- `npm run test` - Run tests for both services
- `npm run lint` - Lint both services
- `npm run install:all` - Install dependencies for all workspaces

### Individual Service Scripts
- `npm run dev:api` - Start API in development mode
- `npm run dev:frontend` - Start frontend in development mode
- `npm run build:api` - Build API for production
- `npm run build:frontend` - Build frontend for production
- `npm run test:api` - Run API tests
- `npm run test:frontend` - Run frontend tests
- `npm run lint:api` - Lint API code
- `npm run lint:frontend` - Lint frontend code

## 🔧 Technology Stack

### Backend (API)
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Documentation:** Swagger/OpenAPI

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Styling:** CSS3 with modern features
- **HTTP Client:** Axios
- **Routing:** React Router

## 🌟 Features

- **Project Management:** Create, update, and track freelance projects
- **Time Tracking:** Log work hours with detailed time entries
- **Task Management:** Organize work with task lists and progress tracking
- **Dashboard:** Overview of projects, earnings, and productivity metrics
- **Responsive Design:** Works on desktop and mobile devices
- **Type Safety:** Full TypeScript implementation across the stack

## 🔗 API Documentation

Once the API is running, visit `http://localhost:3000/api` for interactive Swagger documentation.

## 🤝 Development Workflow

1. **Start development servers:**
   ```bash
   npm run dev
   ```

2. **Make changes to either API or Frontend**

3. **Both services will automatically reload on file changes**

4. **Test your changes:**
   - Frontend: `http://localhost:3001`
   - API: `http://localhost:3000`
   - API Docs: `http://localhost:3000/api`

## 📝 Environment Variables

Make sure to configure your environment variables in the `api/.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/freelance_db"
JWT_SECRET="your-jwt-secret"
PORT=3000
```

## 🚀 Production Deployment

1. **Build both services:**
   ```bash
   npm run build
   ```

2. **Deploy the API and Frontend separately or together based on your hosting setup**

## 📄 License

MIT License - see LICENSE file for details.