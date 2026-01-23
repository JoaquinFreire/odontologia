import React, { useState } from 'react';
import '../App.css';
import { PlusCircle } from 'lucide-react';
import Navigation from '../components/Navigation';

const NewPatient = ({ setIsAuthenticated, user, setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    dni: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nuevo paciente:', formData);
    alert('Paciente agregado exitosamente');
    setFormData({
      name: '',
      lastname: '',
      email: '',
      phone: '',
      dni: ''
    });
  };

  return (
    <div className="app">
      <Navigation 
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />

      <main className="main-content">
        <div className="patients-content">
          <div className="content-header">
            <h1>Nuevo Paciente</h1>
          </div>

          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <form className="appointment-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nombre *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre del paciente"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastname">Apellido *</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Apellido del paciente"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dni">DNI *</label>
                <input
                  type="number"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder="DNI del paciente"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@ejemplo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Teléfono *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  <PlusCircle size={18} />
                  <span>Agregar Paciente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewPatient;
