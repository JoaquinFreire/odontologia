// PatientRecord.js
import React, { useState } from 'react';
import '../styles/PatientRecord.css';
import '../styles/NewPatient.css';

import {
  FileText,
  User,
  Clipboard,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Check,
  Save,
  Printer,
  Download
} from 'lucide-react';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';

// Importar componentes
import Odontograma from '../components/PatientRecord/Odontograma';
import DatosPersonales from '../components/PatientRecord/DatosPersonales';
import Consentimiento from '../components/PatientRecord/Consentimiento';
import Anamnesis from '../components/PatientRecord/Anamnesis';


const PatientRecord = ({ setIsAuthenticated, user, setUser }) => {
  const [activeTab, setActiveTab] = useState('odontograma');
  const [activeNav, setActiveNav] = useState('dashboard');
  const navigate = useNavigate();

  // Datos compartidos entre componentes
  const [patientData, setPatientData] = useState({
    name: 'María',
    lastname: 'González',
    healthInsurance: {
      number: '123456789'
    },
    dentalObservations: '',
    elements: '1'
  });

  const tabs = [
    { id: 'odontograma', label: 'Odontograma', icon: <FileText size={20} /> },
    { id: 'datos', label: 'Datos Personales', icon: <User size={20} /> },
    { id: 'consentimiento', label: 'Consentimiento', icon: <Clipboard size={20} /> },
    { id: 'anamnesis', label: 'Anamnesis', icon: <Briefcase size={20} /> }
  ];

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'odontograma':
        return <Odontograma 
          patientData={patientData} 
          setPatientData={setPatientData} 
        />;
      case 'datos':
        return <DatosPersonales 
          patientData={patientData} 
          setPatientData={setPatientData} 
        />;
      case 'consentimiento':
        return <Consentimiento 
          patientData={patientData} 
          setPatientData={setPatientData} 
        />;
      case 'anamnesis':
        return <Anamnesis 
          patientData={patientData} 
          setPatientData={setPatientData} 
        />;
      default:
        return <Odontograma 
          patientData={patientData} 
          setPatientData={setPatientData} 
        />;
    }
  };

  return (
    <div className="app">
      <NavBar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        handleLogout={handleLogout}
      />

      <main className="main-content">
        <div className="patient-record-container">
          <div className="content-header">
            <div className="patient-header">
              <h1>Ficha del Paciente</h1>
              <div className="patient-subtitle">
                <span className="patient-name">{patientData.name} {patientData.lastname}</span>
                <span className="patient-id">ID: #P-{patientData.healthInsurance.number.slice(0, 6)}</span>
              </div>
            </div>
            <div className="header-actions">
              <button className="btn-outline">
                <Printer size={18} />
                <span>Imprimir Ficha</span>
              </button>
              <button className="btn-primary">
                <Download size={18} />
                <span>Exportar PDF</span>
              </button>
            </div>
          </div>

          {/* Pestañas de navegación */}
          <div className="record-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`record-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="tab-icon">
                  {tab.icon}
                </div>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Navegación por pasos */}
          <div className="steps-navigation">
            <button
              className="step-nav-btn prev"
              onClick={handlePrevious}
              disabled={tabs.findIndex(tab => tab.id === activeTab) === 0}
            >
              <ChevronLeft size={18} />
              <span>Anterior</span>
            </button>

            <div className="steps-indicator">
              {tabs.map((tab, index) => (
                <div key={tab.id} className="step-indicator">
                  <div
                    className={`step-dot ${activeTab === tab.id ? 'active' : ''} ${index < tabs.findIndex(t => t.id === activeTab) ? 'completed' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {index < tabs.findIndex(t => t.id === activeTab) ? <Check size={12} /> : index + 1}
                  </div>
                  <span className="step-label">{tab.label}</span>
                </div>
              ))}
            </div>

            <button
              className="step-nav-btn next"
              onClick={handleNext}
              disabled={tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1}
            >
              <span>Siguiente</span>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Contenido principal */}
          <div className="record-content">
            {renderContent()}
          </div>

          {/* Progreso */}
          <div className="progress-footer">
            <div className="progress-info">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((tabs.findIndex(tab => tab.id === activeTab) + 1) / tabs.length) * 100}%` }}
                ></div>
              </div>
              <span className="progress-text">
                Paso {tabs.findIndex(tab => tab.id === activeTab) + 1} de {tabs.length}
              </span>
            </div>
            <div className="progress-actions">
              <button className="btn-text">
                Guardar y Continuar después
              </button>
              <button className="btn-primary">
                <Save size={18} />
                <span>Guardar Todo</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientRecord;