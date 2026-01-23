import React from 'react';
import { Calendar, Users, FileText } from 'lucide-react';
import { User } from 'lucide-react';

const NavBar = ({ activeNav, setActiveNav, user, handleLogout }) => {
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
        <button 
          className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveNav('dashboard')}
        >
          <div className="nav-icon">
            <FileText size={20} />
          </div>
          <span>Inicio</span>
        </button>

        <button 
          className={`nav-item ${activeNav === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveNav('patients')}
        >
          <div className="nav-icon">
            <Users size={20} />
          </div>
          <span>Gestión Pacientes</span>
        </button>

        <button 
          className={`nav-item ${activeNav === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveNav('appointments')}
        >
          <div className="nav-icon">
            <Calendar size={20} />
          </div>
          <span>Ver Agenda</span>
        </button>

        <button 
          className={`nav-item ${activeNav === 'treatments' ? 'active' : ''}`}
          onClick={() => setActiveNav('treatments')}
        >
          <div className="nav-icon">
            <FileText size={20} />
          </div>
          <span>Tratamientos</span>
        </button>
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
          Cerrar sesión
        </button>
        <p className="footer-text">© 2024 Odontología</p>
      </div>
    </aside>
  );
};

export default NavBar;
