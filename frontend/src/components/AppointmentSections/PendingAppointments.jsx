import React from 'react';
import { Clock, User, CheckCircle } from 'lucide-react';

const PendingAppointments = ({
  todayAppointments,
  overdueAppointments,
  totalPending,
  formatAppointmentName
}) => {
  return (
    <div className="appointments-card">
      <div className="card-header">
        <h3>Turnos pendientes</h3>
        <div className="card-header-actions">
          <span className="badge">{totalPending} citas pendientes</span>
        </div>
      </div>

      {totalPending > 0 ? (
        <div className="today-appointments-list">
          {[...todayAppointments, ...overdueAppointments].map(app => (
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
                <p>{new Date(app.datetime).toLocaleDateString('es-ES')}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <CheckCircle size={48} color="#388e3c" />
          <h4>Sin turnos pendientes</h4>
          <p>No hay citas pendientes en el sistema</p>
        </div>
      )}
    </div>
  );
};

export default PendingAppointments;
