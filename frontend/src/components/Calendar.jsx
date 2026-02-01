import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trash2, Clock, User, Briefcase } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { getAppointmentDateLocal, getAppointmentTimeLocal } from '../utils/dateUtils';
import '../styles/calendar.css';

const Calendar = ({ userId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', date: '', time: '', dni: '', type: ''
  });

  const timeSlots = (() => {
    const slots = [];
    for (let h = 8; h <= 21; h++) {
      const hh = String(h).padStart(2, '0');
      slots.push(`${hh}:00`, `${hh}:30`);
    }
    slots.push("22:00");
    return slots;
  })();

  useEffect(() => {
    if (userId) loadAppointments();
  }, [currentDate, userId]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getAppointments(userId);
      const overdue = await appointmentService.getOverdueAppointments(userId);
      setAppointments([...data, ...overdue]);
    } catch (err) {
      console.error("Error al cargar turnos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Lógica para obtener los 7 días de la semana (Lunes a Domingo)
  const getWeekDays = () => {
    const d = new Date(currentDate);
    const day = d.getDay();
    // Ajuste para que el Lunes sea el inicio (si es Domingo(0), retrocede 6 días)
    const diff = d.getDate() - (day === 0 ? 6 : day - 1);
    const startOfWeek = new Date(d.setDate(diff));
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const getAptAtSlot = (date, slot) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    return appointments.find(apt => 
      getAppointmentDateLocal(apt.datetime) === dateStr && 
      getAppointmentTimeLocal(apt.datetime) === slot
    );
  };

  const handleSlotClick = (day, slot, apt) => {
    if (apt) {
      setSelectedAppointment(apt);
      setIsEditMode(true);
      setFormData({
        name: apt.name,
        date: getAppointmentDateLocal(apt.datetime),
        time: getAppointmentTimeLocal(apt.datetime),
        dni: apt.dni || '',
        type: apt.type
      });
    } else {
      const y = day.getFullYear();
      const m = String(day.getMonth() + 1).padStart(2, '0');
      const d = String(day.getDate()).padStart(2, '0');
      setFormData({ name: '', date: `${y}-${m}-${d}`, time: slot, dni: '', type: '' });
      setIsEditMode(false);
      setSelectedAppointment(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await appointmentService.updateAppointment(selectedAppointment.id, formData, userId);
      } else {
        await appointmentService.createAppointment(formData, userId);
      }
      await loadAppointments();
      setIsModalOpen(false);
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;
    if (window.confirm(`¿Eliminar el turno de ${selectedAppointment.name}?`)) {
      setLoading(true);
      try {
        await appointmentService.deleteAppointment(selectedAppointment.id, userId);
        await loadAppointments();
        setIsModalOpen(false);
      } catch (err) {
        alert("Error al eliminar: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="planner-container">
      <div className="planner-header">
        <div>
          <h1 className="month-name">{currentDate.toLocaleString('es-ES', { month: 'long' }).toUpperCase()}</h1>
          <span className="year-label">{currentDate.getFullYear()}</span>
        </div>
        <div className="nav-controls">
          <button onClick={() => setCurrentDate(new Date())} className="btn-today-planner">Hoy</button>
          <button onClick={() => {
            const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(new Date(d));
          }} className="btn-icon"><ChevronLeft /></button>
          <button onClick={() => {
            const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(new Date(d));
          }} className="btn-icon"><ChevronRight /></button>
        </div>
      </div>

      <div className="planner-grid">
        {getWeekDays().map((day, idx) => {
          const isToday = day.toDateString() === new Date().toDateString();
          return (
            <div key={idx} className={`planner-column ${isToday ? 'current-day-col' : ''}`}>
              <div className="column-header">
                <span className="day-name">{day.toLocaleString('es-ES', { weekday: 'short' })}</span>
                <span className="day-number">{day.getDate()}</span>
                
              </div>
              <div className="slots-container">
                {timeSlots.map(slot => {
                  const apt = getAptAtSlot(day, slot);
                  return (
                    <div 
                      key={slot} 
                      className="time-slot"
                      onClick={() => handleSlotClick(day, slot, apt)}
                    >
                      <span className="slot-time">{slot}</span>
                      {apt && <div className="apt-badge">{apt.name}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditMode ? 'Editar Turno' : 'Nuevo Turno'}</h2>
            </div>
            <form onSubmit={handleSave} className="appointment-form">
              <div className="form-group">
                <label><User size={14}/> Paciente</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Nombre completo" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label><Clock size={14}/> Hora</label>
                  <select value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required>
                    {timeSlots.map(t => <option key={t} value={t}>{t} hs</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label><Briefcase size={14}/> Tratamiento</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required>
                  <option value="">Seleccionar...</option>
                  <option value="Consulta">Consulta</option>
                  <option value="Limpieza dental">Limpieza dental</option>
                  <option value="Extracción">Extracción</option>
                  <option value="Ortodoncia">Ortodoncia</option>
                </select>
              </div>

              <div className="modal-actions-container">
                {isEditMode && (
                  <button type="button" className="btn-delete-planner" onClick={handleDelete} disabled={loading}>
                    <Trash2 size={16} /> <span>Eliminar</span>
                  </button>
                )}
                <div className="main-actions">
                  <button type="button" className="btn-outline-planner" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="btn-confirm-planner" disabled={loading}>
                    {loading ? 'Guardando...' : 'Confirmar'}
                  </button>
                </div>
              </div>
            </form>
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