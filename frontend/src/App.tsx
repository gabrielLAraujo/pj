import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Auth from './components/Auth';
import AuthCallback from './components/AuthCallback';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import WorkLogs from './components/WorkLogs';
import Tasks from './components/Tasks';
import { useAuth } from './contexts/AuthContext';
import './App.css';

// Main App Content Component
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
            <Navigate to="/" replace /> : 
            <Auth onLogin={login} />
        } 
      />
      <Route 
        path="/auth/callback" 
        element={<AuthCallback />} 
      />
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <div className="App">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/work-logs" element={<WorkLogs />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;