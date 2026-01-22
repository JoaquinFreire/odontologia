import React, { useState } from 'react';
import '../styles/Login.css';

const LoginForm = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Iniciando sesión con:', { usuario, contrasena });
    // Aquí iría la lógica real de autenticación
  };

  return (
    <div className='centrar'>

    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <h1 className="clinic-name">ODONTOLOGÍA SONRISAS</h1>
          
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingrese su usuario"
              required
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
            />
          </div>
          
          <button type="submit" className="login-button">
            INICIAR SESIÓN
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