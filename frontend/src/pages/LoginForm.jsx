import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { authService } from '../services/authService';

const LoginForm = ({ setIsAuthenticated }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Intentando login con:', usuario);
      const result = await authService.login(usuario, contrasena);
      console.log('Login resultado:', result);
      
      setIsAuthenticated(true);
      console.log('isAuthenticated seteado a true');
      
      // Esperar un poco antes de navegar
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (err) {
      console.error('Error en handleSubmit:', err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='centrar'>

    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <h1 className="clinic-name">ODONTOLOGÍA SONRISAS</h1>
          
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
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
        
        <div className="login-links">
          <a href="#" className="link">Olvidé mi contraseña</a>
          <a href="#" className="link">Registrarse</a>
        </div>
      </div>
      
      <div className="footer-note">
        <p>© 2023 Odontología Sonrisas. Todos los derechos reservados.</p>
      </div>
    </div>
    </div>
  );
};

export default LoginForm;