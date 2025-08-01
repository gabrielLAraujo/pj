# OAuth Authentication Setup Guide

## Overview
This guide will help you set up Google and GitHub OAuth authentication for the Freelance Management System.

## Backend Setup

### 1. Environment Variables
Copy the `.env.example` file to `.env` in the `api` directory and fill in your OAuth credentials:

```bash
cd api
cp .env.example .env
```

### 2. GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Create a new OAuth App with these settings:
   - **Application name**: Freelance Management System
   - **Homepage URL**: `http://localhost:3003`
   - **Authorization callback URL**: `http://localhost:3003/auth/callback`
3. Copy the Client ID and Client Secret to your `.env` file:
   ```
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Configure the OAuth consent screen
6. Add authorized origins:
   - `http://localhost:3003`
7. Add authorized redirect URIs:
   - `http://localhost:3003/auth/callback`
8. Copy the Client ID to your `.env` file:
   ```
   GOOGLE_CLIENT_ID="your-google-client-id"
   ```

## Frontend Setup

### Environment Variables
Copy the `.env.example` file to `.env` in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

Update the values:
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_REDIRECT_URI=http://localhost:3003/auth/callback
```

## Running the Application

1. **Start the Backend** (Port 3000):
   ```bash
   cd api
   npm run start:dev
   ```

2. **Start the Frontend** (Port 3003):
   ```bash
   cd frontend
   PORT=3003 npm start
   ```

3. **Access the Application**:
   - Frontend: http://localhost:3003
   - Backend API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api

## Features Implemented

### Backend
- ✅ OAuth endpoints for GitHub and Google
- ✅ User creation with OAuth providers
- ✅ JWT token generation
- ✅ Database schema updated for OAuth fields
- ✅ Authentication middleware

### Frontend
- ✅ Modern authentication page
- ✅ Google and GitHub login buttons
- ✅ OAuth callback handling
- ✅ Protected routes
- ✅ User context management
- ✅ Responsive design with dark mode support
- ✅ Header with user menu and logout

## API Endpoints

### Authentication
- `POST /auth/login` - Local login
- `POST /auth/register` - Local registration
- `GET /auth/github` - Get GitHub OAuth URL
- `POST /auth/github/callback` - Handle GitHub callback
- `POST /auth/google/callback` - Handle Google callback
- `POST /auth/verify` - Verify JWT token

## Database Schema

The User model now includes OAuth fields:
- `provider` - OAuth provider (github/google)
- `providerId` - Provider-specific user ID
- `avatar` - User avatar URL
- `password` - Optional (null for OAuth users)

## Security Notes

- JWT tokens are stored in localStorage
- OAuth users don't have passwords
- All routes are protected except login/register
- CORS is configured for frontend domain
- Environment variables keep secrets secure

## Troubleshooting

1. **"Client ID not found"**: Make sure your OAuth apps are properly configured
2. **"Redirect URI mismatch"**: Ensure callback URLs match exactly
3. **CORS errors**: Check that frontend URL is in backend CORS config
4. **Database errors**: Run `npx prisma migrate dev` to apply schema changes

## Next Steps

1. Configure your OAuth applications
2. Set up environment variables
3. Test the authentication flow
4. Customize the UI as needed
5. Add additional OAuth providers if desired