import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Edit2, Trash2, PlusCircle } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { getAppointmentDateLocal, getAppointmentTimeLocal } from '../utils/dateUtils';
import '../styles/calendar.css';

const Calendar = ({ userId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [overdueAppointments, setOverdueAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    dni: '',
    type: '', 
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadAppointments();
  }, [currentDate, userId]);

  const loadAppointments = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const futureData = await appointmentService.getAppointments(userId);
      const overdueData = await appointmentService.getOverdueAppointments(userId);
      setAppointments([...overdueData, ...futureData]);
      setOverdueAppointments(overdueData);
      setError('');
    } catch (err) {
      setError('Error al cargar los turnos');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getAppointmentsForDate = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    return appointments.filter((apt) => getAppointmentDateLocal(apt.datetime) === dateStr);
  };

  const getAppointmentClass = (appointment) => {
    const aptDateLocal = getAppointmentDateLocal(appointment.datetime);
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (overdueAppointments.some(oap => oap.id === appointment.id)) return 'overdue';
    if (aptDateLocal === todayStr) return 'today';
    return 'future';
  };

  const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const goToToday = () => setCurrentDate(new Date());

  const openEditModal = (appointment = null) => {
    if (appointment) {
      setFormData({
        name: appointment.name,
        date: getAppointmentDateLocal(appointment.datetime),
        time: getAppointmentTimeLocal(appointment.datetime),
        dni: appointment.dni || '',
        type: appointment.type,
      });
      setSelectedAppointment(appointment);
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
    setIsModalOpen(true);
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setError('');
    setSuccessMessage('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAppointment = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.date || !formData.time || !formData.type) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      if (isEditMode && selectedAppointment) {
        // SOLUCIÓN AL ERROR DE SHIFT: Se agrega userId
        await appointmentService.updateAppointment(selectedAppointment.id, formData, userId);
      } else {
        // SOLUCIÓN AL ERROR DE SHIFT: Se agrega userId
        await appointmentService.createAppointment(formData, userId);
      }
      await loadAppointments();
      closeModal();
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment || !window.confirm(`¿Eliminar turno?`)) return;
    try {
      setLoading(true);
      await appointmentService.deleteAppointment(selectedAppointment.id);
      await loadAppointments();
      closeModal();
    } catch (err) {
      setError('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={goToPreviousMonth} className="btn-nav"><ChevronLeft size={20} /></button>
          <h2 className="calendar-title">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={goToNextMonth} className="btn-nav"><ChevronRight size={20} /></button>
        </div>
        <button onClick={goToToday} className="btn-today">Hoy</button>
      </div>

      <div className="calendar-weekdays">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => <div key={d} className="weekday">{d}</div>)}
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => {
          const dayAppointments = day ? getAppointmentsForDate(day) : [];
          const cellDate = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
          const todayAtMidnight = new Date().setHours(0, 0, 0, 0);
          const isPast = cellDate && cellDate.getTime() < todayAtMidnight;

          return (
            <div key={index} className={`calendar-day ${day ? 'active' : 'empty'} ${cellDate?.getTime() === todayAtMidnight ? 'today' : ''} ${isPast ? 'is-past' : ''}`}>
              {day && (
                <>
                  <div className="day-number">{day}</div>
                  <div className="appointments-list">
                    {dayAppointments.map((apt) => (
                      <div key={apt.id} className={`appointment-item ${getAppointmentClass(apt)}`} onClick={() => {
                        setSelectedAppointment(apt);
                        setIsModalOpen(true);
                        setIsEditMode(false);
                      }}>
                        <div className="apt-time">{getAppointmentTimeLocal(apt.datetime)}</div>
                        <div className="apt-name">{apt.name}</div>
                      </div>
                    ))}
                  </div>
                  
                  {!isPast && (
                    <button
                      className="btn-add-appointment"
                      onClick={() => {
                        const year = currentDate.getFullYear();
                        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                        const dayStr = String(day).padStart(2, '0');
                        const formattedDate = `${year}-${month}-${dayStr}`;
                        
                        setFormData({
                          name: '',
                          date: formattedDate,
                          time: '09:00',
                          dni: '',
                          type: '',
                        });
                        openEditModal();
                      }}
                    >
                      +
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {isEditMode ? 'Editar Turno' : selectedAppointment ? 'Detalles del Turno' : 'Agendar Nuevo Turno'}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <span>&times;</span>
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {selectedAppointment && !isEditMode ? (
              <div className="appointment-details">
                <div className="detail-row"><span className="label">Paciente:</span><span className="value">{selectedAppointment.name}</span></div>
                <div className="detail-row"><span className="label">DNI:</span><span className="value">{selectedAppointment.dni || 'No especificado'}</span></div>
                <div className="detail-row"><span className="label">Tratamiento:</span><span className="value">{selectedAppointment.type}</span></div>
                <div className="detail-row"><span className="label">Fecha:</span><span className="value">{new Date(selectedAppointment.datetime).toLocaleDateString()} {getAppointmentTimeLocal(selectedAppointment.datetime)}</span></div>
                
                <div className="modal-actions">
                   <button type="button" className="btn-outline" onClick={closeModal}>Cerrar</button>
                   <button type="button" className="btn-primary" onClick={() => openEditModal(selectedAppointment)}>Editar</button>
                   <button type="button" className="btn-danger" onClick={handleDeleteAppointment} style={{ marginLeft: 'auto' }}>Eliminar</button>
                </div>
              </div>
            ) : (
              <form className="appointment-form" onSubmit={handleSaveAppointment}>
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
                  <button type="button" className="btn-outline" onClick={closeModal} disabled={loading}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Agendar Turno')}
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


// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, X, Edit2, Trash2 } from 'lucide-react';
// import { appointmentService } from '../services/appointmentService';
// import { getAppointmentDateLocal, getAppointmentTimeLocal } from '../utils/dateUtils';
// import '../styles/calendar.css';

// const Calendar = ({ userId }) => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [appointments, setAppointments] = useState([]);
//   const [overdueAppointments, setOverdueAppointments] = useState([]);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     date: '',
//     time: '',
//     dni: '',
//     type: 'Consulta',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     loadAppointments();
//   }, [currentDate, userId]);

//   const loadAppointments = async () => {
//     if (!userId) return;
//     setLoading(true);
//     try {
//       const futureData = await appointmentService.getAppointments(userId);
//       const overdueData = await appointmentService.getOverdueAppointments(userId);
//       setAppointments([...overdueData, ...futureData]);
//       setOverdueAppointments(overdueData);
//       setError('');
//     } catch (err) {
//       setError('Error al cargar los turnos');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//   const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

//   const getAppointmentsForDate = (day) => {
//     const year = currentDate.getFullYear();
//     const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//     const dayStr = String(day).padStart(2, '0');
//     const dateStr = `${year}-${month}-${dayStr}`;
//     return appointments.filter((apt) => getAppointmentDateLocal(apt.datetime) === dateStr);
//   };

//   const getAppointmentClass = (appointment) => {
//     const aptDateLocal = getAppointmentDateLocal(appointment.datetime);
//     const today = new Date();
//     const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

//     if (overdueAppointments.some(oap => oap.id === appointment.id)) return 'overdue';
//     if (aptDateLocal === todayStr) return 'today';
//     return 'future';
//   };

//   const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
//   const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
//   const goToToday = () => setCurrentDate(new Date());

//   const openEditModal = (appointment = null) => {
//     if (appointment) {
//       setFormData({
//         name: appointment.name,
//         date: getAppointmentDateLocal(appointment.datetime),
//         time: getAppointmentTimeLocal(appointment.datetime),
//         dni: appointment.dni || '',
//         type: appointment.type,
//       });
//       setSelectedAppointment(appointment);
//       setIsEditMode(true);
//     } else {
//       setIsEditMode(false);
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedAppointment(null);
//     setError('');
//   };

//   const handleSaveAppointment = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       if (isEditMode && selectedAppointment) {
//         await appointmentService.updateAppointment(selectedAppointment.id, formData);
//       } else {
//         await appointmentService.createAppointment(formData);
//       }
//       await loadAppointments();
//       closeModal();
//     } catch (err) {
//       setError(err.message || 'Error al guardar');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteAppointment = async () => {
//     if (!selectedAppointment || !window.confirm(`¿Eliminar turno?`)) return;
//     try {
//       setLoading(true);
//       await appointmentService.deleteAppointment(selectedAppointment.id);
//       await loadAppointments();
//       closeModal();
//     } catch (err) {
//       setError('Error al eliminar');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const daysInMonth = getDaysInMonth(currentDate);
//   const firstDay = getFirstDayOfMonth(currentDate);
//   const days = [];
//   const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

//   for (let i = 0; i < firstDay; i++) days.push(null);
//   for (let i = 1; i <= daysInMonth; i++) days.push(i);

//   return (
//     <div className="calendar-container">
//       <div className="calendar-header">
//         <div className="calendar-nav">
//           <button onClick={goToPreviousMonth} className="btn-nav"><ChevronLeft size={20} /></button>
//           <h2 className="calendar-title">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
//           <button onClick={goToNextMonth} className="btn-nav"><ChevronRight size={20} /></button>
//         </div>
//         <button onClick={goToToday} className="btn-today">Hoy</button>
//       </div>

//       <div className="calendar-weekdays">
//         {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => <div key={d} className="weekday">{d}</div>)}
//       </div>

//       <div className="calendar-grid">
//         {days.map((day, index) => {
//           const dayAppointments = day ? getAppointmentsForDate(day) : [];
//           const cellDate = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
//           const todayAtMidnight = new Date().setHours(0, 0, 0, 0);
//           const isPast = cellDate && cellDate.getTime() < todayAtMidnight;

//           return (
//             <div key={index} className={`calendar-day ${day ? 'active' : 'empty'} ${cellDate?.getTime() === todayAtMidnight ? 'today' : ''}`}>
//               {day && (
//                 <>
//                   <div className="day-number">{day}</div>
//                   <div className="appointments-list">
//                     {dayAppointments.map((apt) => (
//                       <div key={apt.id} className={`appointment-item ${getAppointmentClass(apt)}`} onClick={() => {
//                         setSelectedAppointment(apt);
//                         setIsModalOpen(true);
//                         setIsEditMode(false);
//                       }}>
//                         <div className="apt-time">{getAppointmentTimeLocal(apt.datetime)}</div>
//                         <div className="apt-name">{apt.name}</div>
//                       </div>
//                     ))}
//                   </div>
                  
//                   {!isPast && (
//                     <button
//                       className="btn-add-appointment"
//                       onClick={() => {
//                         const year = currentDate.getFullYear();
//                         const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//                         const dayStr = String(day).padStart(2, '0');
//                         const formattedDate = `${year}-${month}-${dayStr}`;
                        
//                         setFormData({
//                           name: '',
//                           date: formattedDate,
//                           time: '09:00',
//                           dni: '',
//                           type: 'Consulta',
//                         });
//                         openEditModal();
//                       }}
//                     >+</button>
//                   )}
//                 </>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* MODAL ORIGINAL */}
//       {isModalOpen && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>{isEditMode ? 'Editar Turno' : selectedAppointment ? 'Detalles' : 'Nuevo Turno'}</h3>
//               <button onClick={closeModal} className="btn-close"><X size={24} /></button>
//             </div>

//             {selectedAppointment && !isEditMode ? (
//               <div className="appointment-details">
//                 <div className="detail-row"><span className="label">Paciente:</span><span className="value">{selectedAppointment.name}</span></div>
//                 <div className="detail-row"><span className="label">DNI:</span><span className="value">{selectedAppointment.dni || 'No especificado'}</span></div>
//                 <div className="detail-row"><span className="label">Tipo:</span><span className="value">{selectedAppointment.type}</span></div>
//                 <div className="modal-actions">
//                   <button className="btn-edit" onClick={() => openEditModal(selectedAppointment)}><Edit2 size={18} /> Editar</button>
//                   <button className="btn-delete" onClick={handleDeleteAppointment} disabled={loading}><Trash2 size={18} /> Eliminar</button>
//                 </div>
//               </div>
//             ) : (
//               <form onSubmit={handleSaveAppointment} className="appointment-form">
//                 <div className="form-group"><label>Paciente *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
//                 <div className="form-row">
//                   <div className="form-group"><label>Fecha *</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required /></div>
//                   <div className="form-group"><label>Hora *</label><input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required /></div>
//                 </div>
//                 <div className="form-group"><label>DNI</label><input type="text" value={formData.dni} onChange={(e) => setFormData({ ...formData, dni: e.target.value })} /></div>
//                 <div className="form-group">
//                   <label>Tipo de Turno *</label>
//                   <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
//                     <option value="Consulta">Consulta</option>
//                     <option value="Limpieza">Limpieza</option>
//                     <option value="Tratamiento">Tratamiento</option>
//                   </select>
//                 </div>
//                 <div className="modal-actions">
//                   <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
//                   <button type="submit" className="btn-save" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Calendar;