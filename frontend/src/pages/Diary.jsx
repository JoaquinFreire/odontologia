import React, { useEffect } from 'react';
import '../App.css';
import { Filter, PlusCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import { appointmentService } from '../services/appointmentService';

const Diary = ({ setIsAuthenticated, user, setUser }) => {
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        await appointmentService.getAppointments();
      } catch (error) {
        console.error('Error al cargar agenda:', error);
      }
    };

    loadAppointments();
  }, []);

  return (
    <div className="app">
      <Navigation 
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />

      <main className="main-content">
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
      </main>
    </div>
  );
};

export default Diary;
