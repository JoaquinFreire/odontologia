import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Edit2, Trash2 } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import '../styles/calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    dni: '',
    type: 'Consulta',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar turnos al cambiar de mes
  useEffect(() => {
    loadAppointments();
  }, [currentDate]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments();
      setAppointments(data);
      setError('');
    } catch (err) {
      console.error('Error cargando turnos:', err);
      setError('Error al cargar los turnos');
    } finally {
      setLoading(false);
    }
  };

  // Obtener días del mes
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Obtener primer día del mes (0-6, donde 0 es domingo)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Obtener turnos para una fecha específica
  const getAppointmentsForDate = (day) => {
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
      .toISOString()
      .split('T')[0];

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.datetime).toISOString().split('T')[0];
      return aptDate === dateStr;
    });
  };

  // Navegar meses
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Abrir modal para editar/crear turno
  const openEditModal = (appointment = null) => {
    if (appointment) {
      const appointmentDate = new Date(appointment.datetime);
      const dateStr = appointmentDate.toISOString().split('T')[0];
      const timeStr = appointmentDate.toTimeString().substring(0, 5);

      setFormData({
        name: appointment.name,
        date: dateStr,
        time: timeStr,
        dni: appointment.dni || '',
        type: appointment.type,
      });
      setSelectedAppointment(appointment);
      setIsEditMode(true);
    } else {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      setFormData({
        name: '',
        date: dateStr,
        time: '09:00',
        dni: '',
        type: 'Consulta',
      });
      setSelectedAppointment(null);
      setIsEditMode(false);
    }
    setIsModalOpen(true);
    setError('');
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setError('');
  };

  // Guardar turno
  const handleSaveAppointment = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.date || !formData.time) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (isEditMode && selectedAppointment) {
        await appointmentService.updateAppointment(
          selectedAppointment.id,
          formData
        );
      } else {
        await appointmentService.createAppointment(formData);
      }

      await loadAppointments();
      closeModal();
    } catch (err) {
      console.error('Error guardando turno:', err);
      setError(err.message || 'Error al guardar el turno');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar turno
  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar el turno de ${selectedAppointment.name}?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await appointmentService.deleteAppointment(selectedAppointment.id);
      await loadAppointments();
      closeModal();
    } catch (err) {
      console.error('Error eliminando turno:', err);
      setError('Error al eliminar el turno');
    } finally {
      setLoading(false);
    }
  };

  // Generar días para el calendario
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];
  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  // Llenar días vacíos antes del primero del mes
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Llenar días del mes
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={goToPreviousMonth} className="btn-nav">
            <ChevronLeft size={20} />
          </button>
          <h2 className="calendar-title">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={goToNextMonth} className="btn-nav">
            <ChevronRight size={20} />
          </button>
        </div>
        <button onClick={goToToday} className="btn-today">
          Hoy
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="calendar-weekdays">
        <div className="weekday">Dom</div>
        <div className="weekday">Lun</div>
        <div className="weekday">Mar</div>
        <div className="weekday">Mié</div>
        <div className="weekday">Jue</div>
        <div className="weekday">Vie</div>
        <div className="weekday">Sáb</div>
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => {
          const dayAppointments = day ? getAppointmentsForDate(day) : [];
          const isToday =
            day &&
            new Date().toDateString() ===
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              ).toDateString();

          return (
            <div
              key={index}
              className={`calendar-day ${day ? 'active' : 'empty'} ${
                isToday ? 'today' : ''
              }`}
            >
              {day && (
                <>
                  <div className="day-number">{day}</div>
                  <div className="appointments-list">
                    {dayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className={`appointment-item ${
                          apt.status ? 'completed' : 'pending'
                        }`}
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setIsModalOpen(true);
                          setIsEditMode(false);
                        }}
                      >
                        <div className="apt-time">
                          {new Date(apt.datetime).toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="apt-name">{apt.name}</div>
                      </div>
                    ))}
                    <button
                      className="btn-add-appointment"
                      onClick={() => {
                        const dateStr = new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          day
                        )
                          .toISOString()
                          .split('T')[0];
                        setFormData((prev) => ({
                          ...prev,
                          date: dateStr,
                        }));
                        openEditModal();
                      }}
                      title="Agregar turno"
                    >
                      +
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal para ver/editar turnos */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {isEditMode ? 'Editar Turno' : selectedAppointment ? 'Detalles del Turno' : 'Nuevo Turno'}
              </h3>
              <button onClick={closeModal} className="btn-close">
                <X size={24} />
              </button>
            </div>

            {selectedAppointment && !isEditMode ? (
              <div className="appointment-details">
                <div className="detail-row">
                  <span className="label">Paciente:</span>
                  <span className="value">{selectedAppointment.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Fecha y Hora:</span>
                  <span className="value">
                    {new Date(selectedAppointment.datetime).toLocaleString(
                      'es-AR'
                    )}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">DNI:</span>
                  <span className="value">
                    {selectedAppointment.dni || 'No especificado'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Tipo:</span>
                  <span className="value">{selectedAppointment.type}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Estado:</span>
                  <span
                    className={`value status-${
                      selectedAppointment.status ? 'completed' : 'pending'
                    }`}
                  >
                    {selectedAppointment.status ? 'Atendido' : 'Pendiente'}
                  </span>
                </div>

                <div className="modal-actions">
                  <button
                    className="btn-edit"
                    onClick={() => openEditModal(selectedAppointment)}
                  >
                    <Edit2 size={18} />
                    <span>Editar</span>
                  </button>
                  <button
                    className="btn-delete"
                    onClick={handleDeleteAppointment}
                    disabled={loading}
                  >
                    <Trash2 size={18} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveAppointment} className="appointment-form">
                <div className="form-group">
                  <label>Paciente *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nombre de la paciente"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Hora *</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>DNI</label>
                  <input
                    type="text"
                    value={formData.dni}
                    onChange={(e) =>
                      setFormData({ ...formData, dni: e.target.value })
                    }
                    placeholder="Número de DNI"
                  />
                </div>

                <div className="form-group">
                  <label>Tipo de Turno *</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="Consulta">Consulta</option>
                    <option value="Limpieza">Limpieza</option>
                    <option value="Tratamiento">Tratamiento</option>
                    <option value="Extracción">Extracción</option>
                    <option value="Control">Control</option>
                    <option value="Emergencia">Emergencia</option>
                  </select>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={closeModal}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-save"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
