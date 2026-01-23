import React, { useState, useEffect } from 'react';
import '../App.css';
import { Settings, Save } from 'lucide-react';
import Navigation from '../components/Navigation';
import { supabase } from '../config/supabaseClient';

const Configuration = ({ setIsAuthenticated, user, setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    lastname: '',
    tuition: ''
  });
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      if (!user?.email) {
        console.error('No user email available');
        return;
      }

      console.log('=== CARGANDO DATOS DEL USUARIO ===');
      console.log('Email:', user.email);

      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('email', user.email)
        .single();

      console.log('Query error:', error);
      console.log('User data:', data);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setFormData({
          email: data.email || '',
          name: data.name || '',
          lastname: data.lastname || '',
          tuition: data.tuition || ''
        });
        setOriginalData({
          email: data.email || '',
          name: data.name || '',
          lastname: data.lastname || '',
          tuition: data.tuition || ''
        });
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
      setMessage('Error al cargar los datos');
      setMessageType('error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('=== ACTUALIZANDO DATOS DEL USUARIO ===');
      console.log('Datos nuevos:', formData);

      // Preparar datos a actualizar
      const dataToUpdate = {
        email: formData.email,
        tuition: formData.tuition
      };

      console.log('Actualizando con:', dataToUpdate);

      const { data, error } = await supabase
        .from('user')
        .update(dataToUpdate)
        .eq('email', originalData.email)
        .select();

      console.log('Update error:', error);
      console.log('Updated data:', data);

      if (error) {
        throw new Error(error.message);
      }

      console.log('=== ACTUALIZACIÓN EXITOSA ===');

      // Actualizar datos originales
      setOriginalData(formData);

      // Actualizar el estado global del usuario
      setUser(prev => ({
        ...prev,
        email: formData.email,
        tuition: formData.tuition
      }));

      setMessage('✓ Datos actualizados exitosamente');
      setMessageType('success');
    } catch (error) {
      console.error('Error actualizando datos:', error);
      setMessage(`✗ Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

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
                Configuración de Perfil
              </h3>
            </div>

            {message && (
              <div style={{
                backgroundColor: messageType === 'success' ? '#e8f5e9' : '#ffebee',
                border: `1px solid ${messageType === 'success' ? '#4caf50' : '#f44336'}`,
                color: messageType === 'success' ? '#2e7d32' : '#c62828',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '15px'
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Nombre - Solo lectura */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold' }}>Nombre:</label>
                <input 
                  type="text" 
                  value={formData.name}
                  readOnly
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginTop: '5px', 
                    boxSizing: 'border-box',
                    backgroundColor: '#e8e8e8',
                    cursor: 'not-allowed'
                  }} 
                />
                <small style={{ color: '#999' }}>Este campo no puede modificarse</small>
              </div>

              {/* Apellido - Solo lectura */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold' }}>Apellido:</label>
                <input 
                  type="text" 
                  value={formData.lastname}
                  readOnly
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginTop: '5px', 
                    boxSizing: 'border-box',
                    backgroundColor: '#e8e8e8',
                    cursor: 'not-allowed'
                  }} 
                />
                <small style={{ color: '#999' }}>Este campo no puede modificarse</small>
              </div>

              {/* Email - Editable */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold' }}>Email:</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginTop: '5px', 
                    boxSizing: 'border-box',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} 
                />
              </div>

              {/* Matrícula - Editable */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold' }}>Matrícula:</label>
                <input 
                  type="text"
                  name="tuition"
                  value={formData.tuition}
                  onChange={handleChange}
                  placeholder="Ingrese su número de matrícula"
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginTop: '5px', 
                    boxSizing: 'border-box',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} 
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ marginTop: '20px' }}
                disabled={loading || !hasChanges()}
              >
                <Save size={18} style={{ marginRight: '8px', display: 'inline' }} />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>

              {!hasChanges() && (
                <p style={{ color: '#999', fontSize: '14px', marginTop: '10px' }}>
                  No hay cambios por guardar
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Configuration;
