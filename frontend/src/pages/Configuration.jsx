import React from 'react';
import '../App.css';
import { Settings } from 'lucide-react';
import Navigation from '../components/Navigation';

const Configuration = ({ setIsAuthenticated, user, setUser }) => {
  return (
    <div className="app">
      <Navigation 
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />

      <main className="main-content">
        <div style={{ padding: '20px' }}>
          <div className="content-header">
            <h1>Configuración</h1>
          </div>

          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '600px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center' }}>
                <Settings size={24} style={{ marginRight: '10px' }} />
                Configuración de la Clínica
              </h3>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold' }}>Nombre de la Clínica:</label>
              <input 
                type="text" 
                placeholder="Odontología Sonrisas" 
                style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} 
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold' }}>Email de contacto:</label>
              <input 
                type="email" 
                placeholder="contacto@clinica.com" 
                style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} 
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold' }}>Teléfono:</label>
              <input 
                type="tel" 
                placeholder="+1 234 567 890" 
                style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} 
              />
            </div>

            <button className="btn-primary" style={{ marginTop: '20px' }}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Configuration;
