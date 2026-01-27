import React from 'react';
import { XCircle } from 'lucide-react';

const OverdueAppointments = ({
  appointments,
  markingComplete,
  onMarkAsCompleted,
  onOpenRescheduleModal,
  formatAppointmentName
}) => {
  if (appointments.length === 0) {
    return null;
  }

  return (
    <div className="overdue-card">
      <div className="card-header">
        <h3>Turnos atrasados</h3>
        <div className="badge overdue-badge">Requieren atención</div>
      </div>
      <div className="overdue-list">
        {appointments.map(app => (
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
    </div>
  );
};

export default OverdueAppointments;
