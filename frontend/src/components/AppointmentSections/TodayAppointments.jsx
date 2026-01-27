import React from 'react';
import { Clock, User, AlertCircle, PlusCircle } from 'lucide-react';

const TodayAppointments = ({
  appointments,
  markingComplete,
  onMarkAsCompleted,
  onOpenRescheduleModal,
  onOpenModal,
  formatAppointmentName
}) => {
  return (
    <div className="appointments-card">
      <div className="card-header">
        <h3>Turnos de hoy</h3>
        <div className="card-header-actions">
          <span className="badge">{appointments.length} citas programadas</span>
        </div>
      </div>

      {appointments.length > 0 ? (
        <div className="today-appointments-list">
          {appointments.map(app => (
            <div key={app.id} className="home-appointment-item">
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
                  onClick={() => onMarkAsCompleted(app.id)}
                  disabled={markingComplete === app.id}
                >
                  {markingComplete === app.id ? 'Marcando...' : 'Marcar atendido'}
                </button>
                <button
                  className="btn-outline small"
                  onClick={() => onOpenRescheduleModal(app)}
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
          <button className="btn-outline" onClick={onOpenModal}>
            <PlusCircle size={18} />
            <span>Agendar turno</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TodayAppointments;
