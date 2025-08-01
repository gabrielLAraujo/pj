import React, { useState, useEffect } from 'react';
import './Auth.css';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'github' | 'local';
}

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  // OAuth configuration
  // const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id';
  const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID || 'your-github-client-id';
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3001/auth/callback';

  // Commented out Google OAuth for now
  // useEffect(() => {
  //   // Load Google OAuth script
  //   const script = document.createElement('script');
  //   script.src = 'https://accounts.google.com/gsi/client';
  //   script.async = true;
  //   script.defer = true;
  //   document.body.appendChild(script);

  //   script.onload = () => {
  //     if (window.google) {
  //       window.google.accounts.id.initialize({
  //         client_id: GOOGLE_CLIENT_ID,
  //         callback: handleGoogleResponse,
  //       });
  //     }
  //   };

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  // Commented out Google OAuth functions
  // const handleGoogleResponse = async (response: any) => {
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     // Decode JWT token to get user info
  //     const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
  //     const user: User = {
  //       id: payload.sub,
  //       name: payload.name,
  //       email: payload.email,
  //       avatar: payload.picture,
  //       provider: 'google'
  //     };

  //     // Store token in localStorage
  //     localStorage.setItem('auth_token', response.credential);
  //     localStorage.setItem('user', JSON.stringify(user));
      
  //     onLogin(user);
  //   } catch (err) {
  //     setError('Erro ao fazer login com Google');
  //     console.error('Google login error:', err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleGoogleLogin = () => {
  //   if (window.google) {
  //     window.google.accounts.id.prompt();
  //   } else {
  //     setError('Google OAuth não está disponível');
  //   }
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = isRegisterMode ? '/auth/register' : '/auth/login';
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro na autenticação');
      }

      const data = await response.json();
      
      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatar || '',
        provider: 'local'
      };

      // Store token in localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Erro na autenticação');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get GitHub auth URL from backend
      const response = await fetch('http://localhost:3000/auth/github?redirect_uri=http://localhost:3003/auth/callback');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to get GitHub auth URL');
      }

      // Redirect to GitHub OAuth
      window.location.href = data.url;
    } catch (err) {
      setError('Erro ao iniciar login com GitHub');
      console.error('GitHub login error:', err);
      setIsLoading(false);
    }
  };

  const handleGitHubCallback = async (code: string) => {
    try {
      // Exchange code for access token
      const tokenResponse = await fetch('/api/auth/github/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const { access_token } = await tokenResponse.json();

      // Get user info from GitHub
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const githubUser = await userResponse.json();

      const user: User = {
        id: githubUser.id.toString(),
        name: githubUser.name || githubUser.login,
        email: githubUser.email,
        avatar: githubUser.avatar_url,
        provider: 'github'
      };

      // Store token in localStorage
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      onLogin(user);
    } catch (err) {
      setError('Erro ao fazer login com GitHub');
      console.error('GitHub login error:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Freelance Manager</h1>
          <p>Faça login para acessar sua conta</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="auth-form">
          {isRegisterMode && (
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Digite seu nome"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Digite seu email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Digite sua senha"
            />
          </div>
          
          <button
            type="submit"
            className="auth-button primary-button"
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : (isRegisterMode ? 'Registrar' : 'Entrar')}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isRegisterMode ? 'Já tem uma conta?' : 'Não tem uma conta?'}
            <button
              type="button"
              className="link-button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
            >
              {isRegisterMode ? 'Fazer login' : 'Registrar-se'}
            </button>
          </p>
        </div>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <div className="auth-buttons">
          <button
            className="auth-button github-button"
            onClick={handleGitHubLogin}
            disabled={isLoading}
          >
            <svg className="auth-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {isLoading ? 'Carregando...' : 'Continuar com GitHub'}
          </button>
        </div>

        <div className="auth-footer">
          <p>Ao fazer login, você concorda com nossos termos de uso e política de privacidade.</p>
        </div>
      </div>
    </div>
  );
};

// Extend Window interface for Google OAuth
declare global {
  interface Window {
    google: any;
  }
}

export default Auth;