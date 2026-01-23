import React from 'react';
import {
  FileText,
  Users,
  Calendar,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const Navigation = ({ user, setIsAuthenticated, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Inicio',
      icon: <FileText size={20} />,
      route: '/'
    },
    {
      id: 'diary',
      label: 'Agenda',
      icon: <Calendar size={20} />,
      route: '/diary'
    },
    {
      id: 'patients',
      label: 'Gestión Pacientes',
      icon: <Users size={20} />,
      route: '/patients'
    },
    {
      id: 'newpatient',
      label: 'Nuevo Paciente',
      icon: <Users size={20} />,
      route: '/newpatient'
    },
    {
      id: 'configuration',
      label: 'Configuración',
      icon: <Settings size={20} />,
      route: '/configuration'
    }
  ];

  const isActive = (route) => {
    return location.pathname === route;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">🦷</div>
          <h2>Odontología</h2>
        </div>
        <p className="clinic-subtitle">Clínica Odontológica</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item.route) ? 'active' : ''}`}
            onClick={() => navigate(item.route)}
          >
            <div className="nav-icon">
              {item.icon}
            </div>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name || 'Usuario'}</span>
            <span className="user-role">Odontólogo/a</span>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-text logout-btn">
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
        <p className="footer-text">© 2024 Odontología</p>
      </div>
    </aside>
  );
};

export default Navigation;
