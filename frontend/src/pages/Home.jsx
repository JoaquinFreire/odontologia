// Home.js
import React, { useState } from 'react';
import '../App.css';
import { 
  Calendar,
  Users, 
  FileText, 
  DollarSign, 
  Clock,
  PlusCircle,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarDays,
  UserPlus,
  List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Home = ({ setIsAuthenticated, user, setUser }) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  // Obtener fecha actual formateada
  const obtenerFechaActual = () => {
    const fecha = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  // Datos de ejemplo
  const patients = [
    { id: 1, name: 'María González', lastVisit: '2024-03-10', nextAppointment: '2024-03-25', phone: '+1 234 567 890', email: 'maria@email.com', treatments: 3 },
    { id: 2, name: 'Carlos Rodríguez', lastVisit: '2024-03-05', nextAppointment: '2024-04-02', phone: '+1 234 567 891', email: 'carlos@email.com', treatments: 2 },
    { id: 3, name: 'Ana Martínez', lastVisit: '2024-02-28', nextAppointment: '2024-03-20', phone: '+1 234 567 892', email: 'ana@email.com', treatments: 5 },
  ];

  const todayAppointments = [
    { id: 1, patient: 'María González', time: '09:00 AM', type: 'Limpieza dental', status: 'confirmado' },
    { id: 2, patient: 'Juan Pérez', time: '10:30 AM', type: 'Extracción', status: 'pendiente' },
    { id: 3, patient: 'Laura Sánchez', time: '02:00 PM', type: 'Consulta', status: 'confirmado' },
  ];

  const overdueAppointments = [
    { id: 1, patient: 'Roberto Díaz', date: '2024-03-15', reason: 'Control post-operatorio' },
    { id: 2, patient: 'Sofía Ramírez', date: '2024-03-18', reason: 'Aplicación de brackets' },
  ];

  const treatments = [
    { id: 1, name: 'Blanqueamiento', price: '$15,000', duration: '1 hora', category: 'Estética' },
    { id: 2, name: 'Ortodoncia', price: '$45,000', duration: '18 meses', category: 'Ortodoncia' },
    { id: 3, name: 'Implante dental', price: '$80,000', duration: '3-6 meses', category: 'Implantes' },
  ];

  const quickActions = [
    { id: 1, icon: <PlusCircle size={24} />, label: 'Agendar Turno', color: '#1a237e', onClick: () => alert('Agendar turno') },
    { id: 2, icon: <UserPlus size={24} />, label: 'Nuevo Paciente', color: '#1976d2', onClick: () => setActiveNav('patients') },
    { id: 3, icon: <CalendarDays size={24} />, label: 'Ver Agenda', color: '#7b1fa2', onClick: () => setActiveNav('appointments') },
    { id: 4, icon: <List size={24} />, label: 'Ver Pacientes', color: '#388e3c', onClick: () => setActiveNav('patients') },
  ];

  const renderDashboard = () => (
    <div className="dashboard-content">
      {/* Header con saludo y fecha */}
      <div className="dashboard-header">
        <div>
          <h1>¡Hola, {user?.name || 'Dr./Dra.'}!</h1>
          <p style={{ color: '#666', marginTop: '8px', fontSize: '14px' }}>Hoy es {obtenerFechaActual()}</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => alert('Agendar turno')}>
            <PlusCircle size={18} />
            <span>Agendar turno</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card kpi-card">
          <div className="stat-icon" style={{ backgroundColor: '#e3f2fd' }}>
            <Calendar size={24} color="#1976d2" />
          </div>
          <div className="stat-info">
            <h3>{todayAppointments.length}</h3>
            <p>Turnos hoy</p>
            <div className="kpi-subtitle">
              <span className="kpi-status confirmed">{todayAppointments.filter(a => a.status === 'confirmado').length} confirmados</span>
              <span className="kpi-status pending">{todayAppointments.filter(a => a.status === 'pendiente').length} pendientes</span>
            </div>
          </div>
        </div>

        <div className="stat-card kpi-card">
          <div className="stat-icon" style={{ backgroundColor: '#ffebee' }}>
            <AlertCircle size={24} color="#d32f2f" />
          </div>
          <div className="stat-info">
            <h3>{overdueAppointments.length}</h3>
            <p>Turnos atrasados</p>
            <div className="kpi-subtitle">
              <span className="kpi-status overdue">Requieren atención</span>
            </div>
          </div>
        </div>

        <div className="stat-card kpi-card">
          <div className="stat-icon" style={{ backgroundColor: '#e8f5e9' }}>
            <CheckCircle size={24} color="#388e3c" />
          </div>
          <div className="stat-info">
            <h3>18</h3>
            <p>Turnos totales</p>
            <div className="kpi-subtitle">
              <span className="kpi-status total">Este mes</span>
            </div>
          </div>
        </div>

        <div className="stat-card kpi-card">
          <div className="stat-icon" style={{ backgroundColor: '#fff3e0' }}>
            <Users size={24} color="#f57c00" />
          </div>
          <div className="stat-info">
            <h3>{patients.length}</h3>
            <p>Pacientes activos</p>
            <div className="kpi-subtitle">
              <span className="kpi-status patients">En seguimiento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3 className="section-title">Acciones rápidas</h3>
        <div className="quick-actions-grid">
          {quickActions.map(action => (
            <button key={action.id} className="quick-action-card" onClick={action.onClick}>
              <div className="quick-action-icon" style={{ backgroundColor: action.color + '15' }}>
                <div style={{ color: action.color }}>
                  {action.icon}
                </div>
              </div>
              <span className="quick-action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido principal en grid */}
      <div className="content-grid">
        {/* Columna izquierda: Turnos de hoy y agenda */}
        <div className="left-column">
          {/* Turnos de hoy */}
          <div className="appointments-card">
            <div className="card-header">
              <h3>Turnos de hoy</h3>
              <div className="card-header-actions">
                <span className="badge">{todayAppointments.length} citas programadas</span>
                <button className="btn-text" onClick={() => setActiveNav('appointments')}>
                  Ver agenda completa
                </button>
              </div>
            </div>
            
            {todayAppointments.length > 0 ? (
              <div className="today-appointments-list">
                {todayAppointments.map(app => (
                  <div key={app.id} className="appointment-item today">
                    <div className="appointment-time">
                      <Clock size={16} />
                      <span>{app.time}</span>
                    </div>
                    <div className="appointment-details">
                      <div className="appointment-patient">
                        <User size={14} />
                        <h5>{app.patient}</h5>
                      </div>
                      <p>{app.type}</p>
                    </div>
                    <span className={`status-badge ${app.status}`}>
                      {app.status === 'confirmado' ? '✓' : '⏱'} {app.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <AlertCircle size={48} color="#9e9e9e" />
                <h4>Sin turnos hoy</h4>
                <p>No hay citas programadas para hoy</p>
                <button className="btn-outline" onClick={() => alert('Agendar turno')}>
                  <PlusCircle size={18} />
                  <span>Agendar turno</span>
                </button>
              </div>
            )}
          </div>

          {/* Turnos atrasados */}
          {overdueAppointments.length > 0 && (
            <div className="overdue-card">
              <div className="card-header">
                <h3>Turnos atrasados</h3>
                <div className="badge overdue-badge">Requieren atención</div>
              </div>
              <div className="overdue-list">
                {overdueAppointments.map(app => (
                  <div key={app.id} className="overdue-item">
                    <div className="overdue-info">
                      <XCircle size={16} color="#d32f2f" />
                      <div>
                        <h5>{app.patient}</h5>
                        <p>Fecha original: {app.date}</p>
                        <small>Motivo: {app.reason}</small>
                      </div>
                    </div>
                    <button className="btn-outline small" onClick={() => alert(`Reagendar ${app.patient}`)}>
                      Reagendar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha: Pacientes recientes y acciones */}
        <div className="right-column">
          {/* Pacientes recientes */}
          <div className="patients-card">
            <div className="card-header">
              <h3>Pacientes recientes</h3>
              <div className="card-header-actions">
                <button className="btn-primary small" onClick={() => alert('Nuevo paciente')}>
                  <UserPlus size={16} />
                  <span>Nuevo</span>
                </button>
                <button className="btn-text" onClick={() => setActiveNav('patients')}>
                  Ver todos
                </button>
              </div>
            </div>
            <div className="recent-patients-list">
              {patients.map(patient => (
                <div key={patient.id} className="patient-item" onClick={() => alert(`Ver historial de ${patient.name}`)}>
                  <div className="patient-avatar">
                    <User size={20} />
                  </div>
                  <div className="patient-info">
                    <h5>{patient.name}</h5>
                    <div className="patient-details">
                      <span className="patient-detail">
                        <Phone size={12} />
                        {patient.phone}
                      </span>
                      <span className="patient-detail">
                        Última visita: {patient.lastVisit}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={20} color="#666" />
                </div>
              ))}
            </div>
          </div>

          {/* Próximos turnos destacados */}
          <div className="upcoming-card">
            <div className="card-header">
              <h3>Próximos turnos</h3>
              <button className="btn-text" onClick={() => setActiveNav('appointments')}>
                Ver todos
              </button>
            </div>
            <div className="upcoming-list">
              <div className="upcoming-item">
                <div className="upcoming-date">
                  <span className="upcoming-day">25</span>
                  <span className="upcoming-month">MAR</span>
                </div>
                <div className="upcoming-info">
                  <h5>María González</h5>
                  <p>Control post-tratamiento</p>
                  <small>10:30 AM</small>
                </div>
                <span className="status-badge confirmado">Confirmado</span>
              </div>
              <div className="upcoming-item">
                <div className="upcoming-date">
                  <span className="upcoming-day">27</span>
                  <span className="upcoming-month">MAR</span>
                </div>
                <div className="upcoming-info">
                  <h5>Carlos Rodríguez</h5>
                  <p>Aplicación de brackets</p>
                  <small>03:00 PM</small>
                </div>
                <span className="status-badge confirmado">Confirmado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="patients-content">
      <div className="content-header">
        <h1>Gestión de Pacientes</h1>
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar paciente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary">
            <PlusCircle size={18} />
            <span>Nuevo paciente</span>
          </button>
        </div>
      </div>

      <div className="patients-table">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell">Nombre</div>
            <div className="table-cell">Contacto</div>
            <div className="table-cell">Última visita</div>
            <div className="table-cell">Próximo turno</div>
            <div className="table-cell">Tratamientos</div>
            <div className="table-cell">Acciones</div>
          </div>
        </div>
        <div className="table-body">
          {patients.map(patient => (
            <div key={patient.id} className="table-row">
              <div className="table-cell">
                <div className="patient-cell">
                  <div className="patient-avatar">
                    <User size={16} />
                  </div>
                  <span>{patient.name}</span>
                </div>
              </div>
              <div className="table-cell">
                <div className="contact-info">
                  <div className="contact-item">
                    <Phone size={14} />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="contact-item">
                    <Mail size={14} />
                    <span>{patient.email}</span>
                  </div>
                </div>
              </div>
              <div className="table-cell">{patient.lastVisit}</div>
              <div className="table-cell">
                <div className="next-appointment">
                  <Calendar size={14} />
                  <span>{patient.nextAppointment}</span>
                </div>
              </div>
              <div className="table-cell">
                <span className="treatment-count">{patient.treatments}</span>
              </div>
              <div className="table-cell">
                <button className="btn-icon">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="appointments-content">
      <div className="content-header">
        <h1>Agenda de Turnos</h1>
        <div className="header-actions">
          <button className="btn-outline">
            <Filter size={18} />
            <span>Filtrar</span>
          </button>
          <button className="btn-primary">
            <PlusCircle size={18} />
            <span>Nuevo turno</span>
          </button>
        </div>
      </div>

      <div className="calendar-view">
        <div className="calendar-header">
          <h3>Marzo 2024</h3>
          <div className="calendar-nav">
            <button className="btn-icon">‹</button>
            <button className="btn-text">Hoy</button>
            <button className="btn-icon">›</button>
          </div>
        </div>
        
        <div className="week-days">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="week-day">{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className={`calendar-day ${i === 15 ? 'today' : ''}`}>
              <span className="day-number">{i + 1}</span>
              {i === 10 && (
                <div className="calendar-event" style={{ backgroundColor: '#e3f2fd' }}>
                  <span className="event-time">09:00</span>
                  <span className="event-title">María G.</span>
                </div>
              )}
              {i === 15 && (
                <div className="calendar-event" style={{ backgroundColor: '#f3e5f5' }}>
                  <span className="event-time">14:30</span>
                  <span className="event-title">Carlos R.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTreatments = () => (
    <div className="treatments-content">
      <div className="content-header">
        <h1>Tratamientos</h1>
        <div className="header-actions">
          <button className="btn-primary">
            <PlusCircle size={18} />
            <span>Nuevo tratamiento</span>
          </button>
        </div>
      </div>

      <div className="treatments-grid">
        {treatments.map(treatment => (
          <div key={treatment.id} className="treatment-card">
            <div className="treatment-header">
              <h3>{treatment.name}</h3>
              <span className="treatment-price">{treatment.price}</span>
            </div>
            <div className="treatment-info">
              <div className="info-item">
                <Clock size={16} />
                <span>{treatment.duration}</span>
              </div>
              <div className="info-item">
                <FileText size={16} />
                <span>{treatment.category}</span>
              </div>
            </div>
            <div className="treatment-actions">
              <button className="btn-text">Ver detalles</button>
              <button className="btn-primary">Agendar</button>
            </div>
          </div>
        ))}
      </div>

      <div className="treatments-history">
        <h3>Historial de Tratamientos</h3>
        <div className="history-table">
          <div className="table-row">
            <div className="table-cell">Fecha</div>
            <div className="table-cell">Paciente</div>
            <div className="table-cell">Tratamiento</div>
            <div className="table-cell">Monto</div>
            <div className="table-cell">Estado</div>
          </div>
          <div className="table-row">
            <div className="table-cell">2024-03-10</div>
            <div className="table-cell">María González</div>
            <div className="table-cell">Limpieza dental</div>
            <div className="table-cell">$2,500</div>
            <div className="table-cell"><span className="status-badge completado">Completado</span></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
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

      <main className="main-content">
        {activeNav === 'dashboard' && renderDashboard()}
        {activeNav === 'patients' && renderPatients()}
        {activeNav === 'appointments' && renderAppointments()}
        {activeNav === 'treatments' && renderTreatments()}
      </main>
    </div>
  );
};

export default Home;