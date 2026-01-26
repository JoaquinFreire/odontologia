import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { authService } from '../services/authService';

const LoginForm = ({ setIsAuthenticated, setUser }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo('');
    setLoading(true);

    try {
      console.log('=== FORM SUBMIT ===');
      console.log('Email input:', usuario);
      console.log('Password input:', contrasena);
      console.log('Email válido:', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario));
      
      setDebugInfo(`Intentando login con: ${usuario}`);

      const result = await authService.login(usuario, contrasena);
      console.log('=== LOGIN EXITOSO ===');
      console.log('Login resultado:', result);
      
      setDebugInfo(`Login exitoso para: ${usuario}`);

      // Guardar datos del usuario
      if (result) {
        console.log('Guardando user data:', result);
        setUser({
          id: result.id,
          email: result.email,
          name: result.name || '',
          lastname: result.lastname || ''
        });
      }
      
      setIsAuthenticated(true);
      console.log('isAuthenticated seteado a true');
      
      // Navegar sin delay
      navigate('/', { replace: true });
    } catch (err) {
      console.error('=== ERROR EN FORM SUBMIT ===');
      console.error('Error objeto:', err);
      console.error('Error message:', err.message);
      console.error('Error type:', typeof err);
      
      const errorMsg = err.message || 'Error al iniciar sesión';
      setError(errorMsg);
      setDebugInfo(`ERROR: ${errorMsg}`);
      setLoading(false);
    }
  };

  return (
    <div className='centrar'>
      <div className="login-container">
        <div className="login-card">
          <div className="logo-section">
            <span className="logo-icon">🦷</span>
            <h1 className="clinic-name">Odontología</h1>
            <p className="clinic-subname">Clínica Odontológica Monica</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {debugInfo && (
            <div style={{
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '12px',
              marginBottom: '15px',
              fontFamily: 'monospace',
              color: '#333'
            }}>
              <strong>Debug Info:</strong>
              <div>{debugInfo}</div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="usuario">EMAIL</label>
              <input
                type="email"
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingrese su email"
                required
                disabled={loading}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="contrasena">Contraseña</label>
              <input
                type="password"
                id="contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
            </button>
          </form>
          
          
          {/* Info de debug para desarrollo */}
        </div>
        
        <div className="footer-note">
          <p>© 2026 Odontología Monica. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;