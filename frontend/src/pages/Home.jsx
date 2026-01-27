// Home.js
import React, { useState, useEffect } from 'react';
import '../App.css';
import {
  Calendar,
  Clock,
  PlusCircle,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarDays,
  UserPlus,
  List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import TodayAppointments from '../components/AppointmentSections/TodayAppointments';
import OverdueAppointments from '../components/AppointmentSections/OverdueAppointments';
import PendingAppointments from '../components/AppointmentSections/PendingAppointments';
import { appointmentService } from '../services/appointmentService';
import { getStartOfTodayUTC, getEndOfTodayUTC } from '../utils/dateUtils';

const Home = ({ user, handleLogout }) => {
  const [showModal, setShowModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [overdueAppointments, setOverdueAppointments] = useState([]);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(null);
  const [selectedAppointmentToReschedule, setSelectedAppointmentToReschedule] = useState(null);
  const [activeNav, setActiveNav] = useState('dashboard');
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

  const loadAllAppointmentData = async () => {
    try {
      console.log('Cargando todos los datos de turnos...');
      console.log('Usuario actual:', user);

      // Debug: mostrar rangos de fecha
      const startOfDay = getStartOfTodayUTC();
      const endOfDay = getEndOfTodayUTC();
      console.log('Rango de HOY (UTC):', startOfDay, 'a', endOfDay);

      const [today, overdue, total] = await Promise.all([
        appointmentService.getTodayAppointments(user.id),
        appointmentService.getOverdueAppointments(user.id),
        appointmentService.getTotalPendingAppointments(user.id)
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

  useEffect(() => {
    loadAllAppointmentData();
  }, []);

  const handleMarkAsCompleted = async (id) => {
    try {
      setMarkingComplete(id);
      console.log('Marcando turno como atendido:', id);

      // ✅ Pasar user.id
      await appointmentService.markAppointmentAsCompleted(id, user.id);

      console.log('Turno marcado exitosamente');
      setShowSuccessModal(true);
      
      // Cerrar modal automáticamente después de 3 segundos
      setTimeout(() => {
        setShowSuccessModal(false);
        loadAllAppointmentData();
      }, 3000);
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

    const appointmentDate = new Date(appointment.datetime);
    // Convertir a fecha local: restar offset de zona horaria
    const offset = appointmentDate.getTimezoneOffset() * 60000;
    const localDate = new Date(appointmentDate.getTime() - offset);
    const dateString = localDate.toISOString().split('T')[0];
    const timeString = localDate.toISOString().split('T')[1].slice(0, 5);

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

      // ✅ Pasar user.id
      await appointmentService.updateAppointment(selectedAppointmentToReschedule.id, {
        date: rescheduleData.date,
        time: rescheduleData.time
      }, user.id);

      setSuccessMessage(`Turno reprogramado para ${selectedAppointmentToReschedule.name} el ${rescheduleData.date} a las ${rescheduleData.time}`);
      setShowSuccessModal(true);
      handleCloseRescheduleModal();
      
      // Cerrar modal automáticamente después de 3 segundos
      setTimeout(() => {
        setShowSuccessModal(false);
        loadAllAppointmentData();
      }, 3000);
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
      console.log('User ID:', user.id);

      // ✅ Pasar user.id
      await appointmentService.createAppointment(formData, user.id);

      setSuccessMessage(`Turno agendado para ${formData.name} el ${formData.date} a las ${formData.time}`);
      setShowSuccessModal(true);
      handleCloseModal();
      
      // Cerrar modal automáticamente después de 3 segundos
      setTimeout(() => {
        setShowSuccessModal(false);
        loadAllAppointmentData();
      }, 3000);
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

  const formatAppointmentName = (appointment) => {
    const dniText = appointment.dni ? appointment.dni : '(sin DNI)';
    return `${appointment.name} - ${dniText}`;
  };

  const quickActions = [
    { id: 1, icon: <PlusCircle size={24} />, label: 'Agendar Turno', color: '#0066cc', onClick: handleOpenModal },
    { id: 2, icon: <UserPlus size={24} />, label: 'Nuevo Paciente', color: '#0066cc', onClick: () => navigate('/newpatient') },
    { id: 3, icon: <CalendarDays size={24} />, label: 'Ver Agenda', color: '#0066cc', onClick: () => navigate('/diary') },
    { id: 4, icon: <List size={24} />, label: 'Ver Pacientes', color: '#0066cc', onClick: () => navigate('/patients') },
  ];

  return (
    <div className="app">
      <NavBar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        handleLogout={handleLogout}
      />
      <main className="main-content">
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
              <TodayAppointments
                appointments={todayAppointments}
                markingComplete={markingComplete}
                onMarkAsCompleted={handleMarkAsCompleted}
                onOpenRescheduleModal={handleOpenRescheduleModal}
                onOpenModal={handleOpenModal}
                formatAppointmentName={formatAppointmentName}
              />

              <OverdueAppointments
                appointments={overdueAppointments}
                markingComplete={markingComplete}
                onMarkAsCompleted={handleMarkAsCompleted}
                onOpenRescheduleModal={handleOpenRescheduleModal}
                formatAppointmentName={formatAppointmentName}
              />
            </div>

            {/* Columna derecha */}
            <div className="right-column">
              <PendingAppointments
                todayAppointments={todayAppointments}
                overdueAppointments={overdueAppointments}
                totalPending={totalPending}
                formatAppointmentName={formatAppointmentName}
              />
            </div>
          </div>
        </div>
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

      {/* Modal Éxito - Turno Marcado o Agendado */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="success-modal-content">
            <div className="success-checkmark">✓</div>
            <h2>¡Éxito!</h2>
            <p>{successMessage || 'El turno ha sido registrado exitosamente'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;