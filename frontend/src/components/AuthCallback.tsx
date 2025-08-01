import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      if (error) {
        console.error('OAuth error:', error);
        navigate('/login?error=oauth_error');
        return;
      }

      if (!code) {
        console.error('No authorization code received');
        navigate('/login?error=no_code');
        return;
      }

      try {
        // Exchange code for access token via our backend
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/auth/github/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange code for token');
        }

        const data = await response.json();
        
        if (data.user && data.token) {
          // Store token and user data
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Update auth context
          login(data.user);
          
          // Redirect to dashboard
          navigate('/');
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Error during OAuth callback:', error);
        navigate('/login?error=callback_error');
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Processando autenticação...</p>
    </div>
  );
};

export default AuthCallback;