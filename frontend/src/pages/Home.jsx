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
import NavBar from '../components/NavBar';

const Home = ({ setIsAuthenticated, user, setUser }) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patient: '',
    date: '',
    time: '',
    type: ''
  });
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      patient: '',
      date: '',
      time: '',
      type: ''
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAppointment = (e) => {
    e.preventDefault();
    if (formData.patient && formData.date && formData.time && formData.type) {
      alert(`Turno agendado para ${formData.patient} el ${formData.date} a las ${formData.time}`);
      handleCloseModal();
    } else {
      alert('Por favor completa todos los campos');
    }
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
    { id: 1, icon: <PlusCircle size={24} />, label: 'Agendar Turno', color: '#1a237e', onClick: handleOpenModal },
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
          <button className="btn-primary" onClick={handleOpenModal}>
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
            
          </div>
        </div>

        <div className="stat-card kpi-card">
          <div className="stat-icon" style={{ backgroundColor: '#ffebee' }}>
            <AlertCircle size={24} color="#d32f2f" />
          </div>
          <div className="stat-info">
            <h3>{overdueAppointments.length}</h3>
            <p>Turnos atrasados</p>
            
          </div>
        </div>

        <div className="stat-card kpi-card">
          <div className="stat-icon" style={{ backgroundColor: '#e8f5e9' }}>
            <CheckCircle size={24} color="#388e3c" />
          </div>
          <div className="stat-info">
            <h3>18</h3>
            <p>Turnos totales</p>
            
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
      <NavBar 
        activeNav={activeNav} 
        setActiveNav={setActiveNav} 
        user={user} 
        handleLogout={handleLogout}
      />

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
                <label htmlFor="patient">Nombre completo</label>
                <input type="text" />

                <label htmlFor="patient">Documento</label>
                <input type="number" />
                {/* <select 
                  id="patient"
                  name="patient" 
                  value={formData.patient}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Seleccionar paciente...</option>
                  <option value="María González">María González</option>
                  <option value="Carlos Rodríguez">Carlos Rodríguez</option>
                  <option value="Ana Martínez">Ana Martínez</option>
                </select> */}
              </div>

              <div className="form-group">
                <label htmlFor="date">Fecha</label>
                <input 
                  type="date" 
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Hora</label>
                <input 
                  type="time" 
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Tipo de Tratamiento</label>
                <select 
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Seleccionar tratamiento...</option>
                  <option value="Limpieza dental">Limpieza dental</option>
                  <option value="Extracción">Extracción</option>
                  <option value="Consulta">Consulta</option>
                  <option value="Blanqueamiento">Blanqueamiento</option>
                  <option value="Ortodoncia">Ortodoncia</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Agendar Turno
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