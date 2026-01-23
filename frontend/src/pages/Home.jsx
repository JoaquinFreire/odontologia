// Home.js
import React, { useState, useEffect } from 'react';
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
import { appointmentService } from '../services/appointmentService';

const Home = ({ setIsAuthenticated, user, setUser }) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [overdueAppointments, setOverdueAppointments] = useState([]);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(null);
  const [selectedAppointmentToReschedule, setSelectedAppointmentToReschedule] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    type: '',
    dni: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadAllAppointmentData();
  }, []);

  const loadAllAppointmentData = async () => {
    try {
      console.log('Cargando todos los datos de turnos...');
      
      const [today, overdue, total] = await Promise.all([
        appointmentService.getTodayAppointments(),
        appointmentService.getOverdueAppointments(),
        appointmentService.getTotalPendingAppointments()
      ]);

      setTodayAppointments(today);
      setOverdueAppointments(overdue);
      setTotalPending(total);

      console.log('Turnos de hoy:', today);
      console.log('Turnos atrasados:', overdue);
      console.log('Total pendientes:', total);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  const handleMarkAsCompleted = async (id) => {
    try {
      setMarkingComplete(id);
      console.log('Marcando turno como atendido:', id);

      await appointmentService.markAppointmentAsCompleted(id);
      
      console.log('Turno marcado exitosamente');
      alert('✓ Turno marcado como atendido');
      
      await loadAllAppointmentData();
    } catch (error) {
      console.error('Error al marcar turno:', error);
      alert(`✗ Error: ${error.message}`);
    } finally {
      setMarkingComplete(null);
    }
  };

  const handleOpenRescheduleModal = (appointment) => {
    console.log('Abriendo modal de reprogramación para:', appointment);
    setSelectedAppointmentToReschedule(appointment);
    
    // Obtener fecha y hora actual del turno
    const appointmentDate = new Date(appointment.datetime);
    const dateString = appointmentDate.toISOString().split('T')[0];
    const timeString = appointmentDate.toTimeString().slice(0, 5);
    
    setRescheduleData({
      date: dateString,
      time: timeString
    });
    
    setShowRescheduleModal(true);
  };

  const handleCloseRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedAppointmentToReschedule(null);
    setRescheduleData({
      date: '',
      time: ''
    });
  };

  const handleRescheduleChange = (e) => {
    const { name, value } = e.target;
    setRescheduleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitReschedule = async (e) => {
    e.preventDefault();
    
    if (!rescheduleData.date || !rescheduleData.time) {
      alert('Por favor completa la fecha y hora');
      return;
    }

    setLoading(true);

    try {
      console.log('=== REPROGRAMANDO TURNO ===');
      console.log('ID del turno:', selectedAppointmentToReschedule.id);
      console.log('Nueva fecha y hora:', rescheduleData);

      await appointmentService.updateAppointment(selectedAppointmentToReschedule.id, {
        date: rescheduleData.date,
        time: rescheduleData.time
      });
      
      alert('✓ Turno reprogramado exitosamente');
      handleCloseRescheduleModal();
      
      await loadAllAppointmentData();
    } catch (error) {
      console.error('Error al reprogramar turno:', error);
      alert(`✗ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      date: '',
      time: '',
      type: '',
      dni: ''
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.date || !formData.time || !formData.type) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      console.log('=== ENVIANDO TURNO ===');
      console.log('Form data:', formData);

      await appointmentService.createAppointment(formData);
      
      alert(`✓ Turno agendado para ${formData.name} el ${formData.date} a las ${formData.time}`);
      handleCloseModal();
      
      await loadAllAppointmentData();
    } catch (error) {
      console.error('Error al crear turno:', error);
      alert(`✗ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const obtenerFechaActual = () => {
    const fecha = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  const patients = [
    { id: 1, name: 'María González', lastVisit: '2024-03-10', nextAppointment: '2024-03-25', phone: '+1 234 567 890', email: 'maria@email.com', treatments: 3 },
    { id: 2, name: 'Carlos Rodríguez', lastVisit: '2024-03-05', nextAppointment: '2024-04-02', phone: '+1 234 567 891', email: 'carlos@email.com', treatments: 2 },
    { id: 3, name: 'Ana Martínez', lastVisit: '2024-02-28', nextAppointment: '2024-03-20', phone: '+1 234 567 892', email: 'ana@email.com', treatments: 5 },
  ];

  const treatments = [
    { id: 1, name: 'Blanqueamiento', price: '$15,000', duration: '1 hora', category: 'Estética' },
    { id: 2, name: 'Ortodoncia', price: '$45,000', duration: '18 meses', category: 'Ortodoncia' },
    { id: 3, name: 'Implante dental', price: '$80,000', duration: '3-6 meses', category: 'Implantes' },
  ];

  const quickActions = [
    { id: 1, icon: <PlusCircle size={24} />, label: 'Agendar Turno', color: '#1a237e', onClick: handleOpenModal },
    { id: 2, icon: <UserPlus size={24} />, label: 'Nuevo Paciente', color: '#1976d2', onClick: () => setActiveNav('patients') },
    { id: 3, icon: <CalendarDays size={24} />, label: 'Ver Agenda', color: '#7b1fa2', onClick: () => setActiveNav('appointments') },
    { id: 4, icon: <List size={24} />, label: 'Ver Pacientes', color: '#388e3c', onClick: () => setActiveNav('patients') },
  ];

  const formatAppointmentName = (appointment) => {
    const dniText = appointment.dni ? appointment.dni : '(sin DNI)';
    return `${appointment.name} - ${dniText}`;
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      {/* Header con saludo y fecha */}
      <div className="dashboard-header">
        <div>
          <h1>¡Hola, {user?.name || 'Dr./Dra.'}!</h1>
          <p style={{ color: '#666', marginTop: '8px', fontSize: '14px' }}>Hoy es {obtenerFechaActual()}</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleOpenModal}>
            <PlusCircle size={18} />
            <span>Agendar turno</span>
          </button>
        </div>
      </div>

      {/* KPI Cards - ACTUALIZADOS CON DATOS DE LA BD */}
      <div className="stats-grid">
        <div className="stat-card kpi-card">
          <div className="stat-icon" style={{ backgroundColor: '#e3f2fd' }}>
            <Calendar size={24} color="#1976d2" />
          </div>
          <div className="stat-info">
            <h3>{todayAppointments.length}</h3>
            <p>Turnos hoy</p>
            <div className="kpi-subtitle">
              <span className="kpi-status confirmed">{todayAppointments.length} pendientes</span>
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
            <h3>{totalPending}</h3>
            <p>Turnos pendientes</p>
            <div className="kpi-subtitle">
              <span className="kpi-status total">Total en el sistema</span>
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
              </div>
            </div>
            
            {todayAppointments.length > 0 ? (
              <div className="today-appointments-list">
                {todayAppointments.map(app => (
                  <div key={app.id} className="appointment-item today">
                    <div className="appointment-time">
                      <Clock size={16} />
                      <span>{new Date(app.datetime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="appointment-details">
                      <div className="appointment-patient">
                        <User size={14} />
                        <h5>{formatAppointmentName(app)}</h5>
                      </div>
                      <p>{app.type}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn-outline small"
                        onClick={() => handleMarkAsCompleted(app.id)}
                        disabled={markingComplete === app.id}
                      >
                        {markingComplete === app.id ? 'Marcando...' : 'Marcar atendido'}
                      </button>
                      <button 
                        className="btn-outline small"
                        onClick={() => handleOpenRescheduleModal(app)}
                      >
                        Reprogramar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <AlertCircle size={48} color="#9e9e9e" />
                <h4>Sin turnos hoy</h4>
                <p>No hay citas programadas para hoy</p>
                <button className="btn-outline" onClick={handleOpenModal}>
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
                        <h5>{formatAppointmentName(app)}</h5>
                        <p>Fecha original: {new Date(app.datetime).toLocaleDateString('es-ES')} &nbsp;
                          <span>{new Date(app.datetime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                        <small>Tratamiento: {app.type}</small>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                      <button 
                        className="btn-outline small"
                        onClick={() => handleMarkAsCompleted(app.id)}
                        disabled={markingComplete === app.id}
                      >
                        {markingComplete === app.id ? 'Marcando...' : 'Marcar atendido'}
                      </button>
                      <button 
                        className="btn-outline small"
                        onClick={() => handleOpenRescheduleModal(app)}
                      >
                        Reprogramar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha */}
        <div className="right-column">
          <div className="upcoming-card">
            <div className="card-header">
              <h3>Resumen de turnos</h3>
            </div>
            <div style={{ padding: '15px' }}>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total pendientes en el sistema: <strong>{totalPending}</strong></p>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Programados para hoy: <strong>{todayAppointments.length}</strong></p>
              </div>
              <div>
                <p style={{ margin: 0, color: '#d32f2f', fontSize: '14px' }}>Turnos atrasados: <strong>{overdueAppointments.length}</strong></p>
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

      {/* Modal Agendar Turno */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agendar Nuevo Turno</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <span>&times;</span>
              </button>
            </div>
            
            <form className="appointment-form" onSubmit={handleSubmitAppointment}>
              <div className="form-group">
                <label htmlFor="name">Nombre completo *</label>
                <input 
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Ej: María González"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dni">DNI (Opcional)</label>
                <input 
                  type="number"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleFormChange}
                  placeholder="Ej: 12345678"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Fecha *</label>
                <input 
                  type="date" 
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Hora *</label>
                <input 
                  type="time" 
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleFormChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Tipo de Tratamiento *</label>
                <select 
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  required
                  disabled={loading}
                >
                  <option value="">Seleccionar tratamiento...</option>
                  <option value="Consulta">Consulta</option>
                  <option value="Limpieza dental">Limpieza dental</option>
                  <option value="Extracción">Extracción</option>
                  <option value="Blanqueamiento">Blanqueamiento</option>
                  <option value="Ortodoncia">Ortodoncia</option>
                  <option value="Implante dental">Implante dental</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={handleCloseModal} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Agendando...' : 'Agendar Turno'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reprogramar Turno */}
      {showRescheduleModal && selectedAppointmentToReschedule && (
        <div className="modal-overlay" onClick={handleCloseRescheduleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reprogramar Turno</h2>
              <button className="modal-close" onClick={handleCloseRescheduleModal}>
                <span>&times;</span>
              </button>
            </div>
            
            <form className="appointment-form" onSubmit={handleSubmitReschedule}>
              <div className="form-group">
                <label>Información del turno</label>
                <div style={{
                  backgroundColor: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '4px',
                  marginBottom: '15px'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                    <strong>Paciente:</strong> {formatAppointmentName(selectedAppointmentToReschedule)}
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                    <strong>Tratamiento:</strong> {selectedAppointmentToReschedule.type}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    <strong>Fecha actual:</strong> {new Date(selectedAppointmentToReschedule.datetime).toLocaleDateString('es-ES')} a las {new Date(selectedAppointmentToReschedule.datetime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reschedule-date">Nueva Fecha *</label>
                <input 
                  type="date" 
                  id="reschedule-date"
                  name="date"
                  value={rescheduleData.date}
                  onChange={handleRescheduleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reschedule-time">Nueva Hora *</label>
                <input 
                  type="time" 
                  id="reschedule-time"
                  name="time"
                  value={rescheduleData.time}
                  onChange={handleRescheduleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={handleCloseRescheduleModal} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Reprogramando...' : 'Confirmar Reprogramación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;