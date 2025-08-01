import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-title">
          <h1>Freelance Manager</h1>
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/projects" className="nav-link">Projetos</Link>
          </li>
          <li className="nav-item">
            <Link to="/work-logs" className="nav-link">Work Logs</Link>
          </li>
          <li className="nav-item">
            <Link to="/tasks" className="nav-link">Tarefas</Link>
          </li>
        </ul>

        <div className="user-menu">
          <button className="user-button" onClick={toggleDropdown}>
            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=667eea&color=fff`} 
              alt={user?.name}
              className="user-avatar"
            />
            <span className="user-name">{user?.name}</span>
            <svg 
              className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} 
              width="16" 
              height="16" 
              viewBox="0 0 16 16"
            >
              <path fill="currentColor" d="M4.427 9.573L8 6l3.573 3.573a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708z"/>
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=667eea&color=fff`} 
                  alt={user?.name}
                  className="dropdown-avatar"
                />
                <div className="dropdown-info">
                  <p className="dropdown-name">{user?.name}</p>
                  <p className="dropdown-email">{user?.email}</p>
                  <span className="dropdown-provider">
                    {user?.provider === 'google' ? '🔗 Google' : '🔗 GitHub'}
                  </span>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <div className="dropdown-actions">
                <button className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 11a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6z"/>
                  </svg>
                  Perfil
                </button>
                
                <button className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                  </svg>
                  Configurações
                </button>
                
                <div className="dropdown-divider"></div>
                
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                    <path fill="currentColor" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                  </svg>
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div className="dropdown-overlay" onClick={() => setIsDropdownOpen(false)}></div>
      )}
    </nav>
  );
};

export default Header;