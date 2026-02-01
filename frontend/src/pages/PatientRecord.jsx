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
  Download,
  AlertCircle
} from 'lucide-react';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';
import { saveCompletePatient } from '../services/patientService';

// Importar componentes
import Odontograma from '../components/PatientRecord/Odontograma';
import DatosPersonales from '../components/PatientRecord/DatosPersonales';
import Consentimiento from '../components/PatientRecord/Consentimiento';
import Anamnesis from '../components/PatientRecord/Anamnesis';

const PatientRecord = ({ setIsAuthenticated, user, setUser }) => {
  const [activeTab, setActiveTab] = useState('datos');
  const [activeNav, setActiveNav] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  // Datos compartidos entre componentes
  const [patientData, setPatientData] = useState({
    name: '',
    lastname: '',
    dni: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    healthInsurance: {
      number: '',
      isHolder: false
    },
    dentalObservations: '',
    elements: '1'
  });

  const [anamnesisData, setAnamnesisData] = useState({
    primaryDoctor: '',
    primaryDoctorPhone: '',
    primaryService: '',
    allergies: { hasAllergies: false, description: '' },
    currentTreatment: { underTreatment: false, description: '' },
    hospitalization: { wasHospitalized: false, reason: '' },
    healingProblems: false,
    bloodType: '',
    bloodRh: '',
    takesMedication: false,
    medication: '',
    isPregnant: false,
    pregnancyTime: '',
    obstetrician: '',
    obstetricianPhone: '',
    diseases: {
      diabetes: false,
      headaches: false,
      trauma: false,
      neurological: false,
      hypertension: false,
      epilepsy: false,
      psoriasis: false,
      psychiatric: false,
      rheumaticFever: false,
      unconsciousness: false,
      boneDiseases: false,
      heartDiseases: false,
      arthritis: false,
      consumesAlcohol: false,
      muscleDiseases: false,
      bloodDiseases: false,
      asthma: false,
      consumesTobacco: false,
      respiratoryDiseases: false,
      lymphDiseases: false,
      sinusitis: false,
      surgeries: false,
      jointDiseases: false,
      skinDiseases: false,
      hepatitis: false,
      receivedTransfusions: false,
      kidneyDiseases: false,
      std: false,
      liverDiseases: false,
      receivedDialysis: false,
      congenitalDiseases: false,
      chronicInfections: false,
      chagas: false,
      operations: false,
      glandularDiseases: false
    },
    observations: ''
  });

  const [consentData, setConsentData] = useState({
    accepted: false,
    datetime: new Date().toISOString().slice(0, 16),
    doctorName: '',
    doctorMatricula: ''
  });

  const [odontogramaData, setOdontogramaData] = useState({
    adult: { teethState: {}, connections: [] },
    child: { teethState: {}, connections: [] },
    observaciones: '',
    elementos_dentarios: '',
    version: 1,
    treatments: []
  });

  const tabs = [
    { id: 'datos', label: 'Datos Personales', icon: <User size={20} /> },
    { id: 'anamnesis', label: 'Anamnesis', icon: <Briefcase size={20} /> },
    { id: 'odontograma', label: 'Odontograma', icon: <FileText size={20} /> },
    { id: 'consentimiento', label: 'Consentimiento', icon: <Clipboard size={20} /> }
  ];

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };


  const validateRequiredData = () => {
    const patientErrors = [];

    // Validar datos personales obligatorios
    if (!patientData.name) patientErrors.push('Nombre');
    if (!patientData.lastname) patientErrors.push('Apellido');
    if (!patientData.dni) patientErrors.push('DNI');
    if (!patientData.birthDate) patientErrors.push('Fecha de Nacimiento');

    return {
      isValid: patientErrors.length === 0,
      patientErrors
    };
  };

  const handleSaveAll = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    const validation = validateRequiredData();

    if (!validation.isValid) {
      let errorMsg = '✗ Campos requeridos incompletos:\n\n';
      
      if (validation.patientErrors.length > 0) {
        errorMsg += `Datos Personales: ${validation.patientErrors.join(', ')}\n`;
      }

      setMessage({ 
        type: 'error', 
        text: errorMsg.replace(/\n/g, ' | ') 
      });
      setLoading(false);
      return;
    }

    try {
      console.log('=== GUARDANDO PACIENTE COMPLETO ===');
      console.log('Datos del paciente:', patientData);
      console.log('Datos de consentimiento:', consentData);
      console.log('User ID:', user.id);

      const result = await saveCompletePatient(patientData, anamnesisData, consentData, odontogramaData, user.id);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `✓ ${result.message}` 
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setMessage({ 
          type: 'error', 
          text: `✗ Error: ${result.error}` 
        });
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      setMessage({ 
        type: 'error', 
        text: `✗ Error: ${error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'odontograma':
        return <Odontograma 
          onDataChange={setOdontogramaData}
          initialData={odontogramaData}
        />;
      case 'datos':
        return <DatosPersonales 
          patientData={patientData} 
          setPatientData={setPatientData} 
        />;
      case 'consentimiento':
        return <Consentimiento 
          patientData={patientData}
          user={user}
          consentData={consentData}
          setConsentData={setConsentData}
        />;
      case 'anamnesis':
        return <Anamnesis 
          anamnesisData={anamnesisData} 
          setAnamnesisData={setAnamnesisData} 
        />;
      default:
        return <DatosPersonales 
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
                <span className="patient-name">{patientData.name || 'Nuevo Paciente'} {patientData.lastname}</span>
                <span className="patient-id">ID: #P-{patientData.healthInsurance.number.slice(0, 6) || 'NUEVO'}</span>
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

          {/* Mensaje de estado */}
          {message.text && (
            <div className={`message-alert message-${message.type}`}>
              <AlertCircle size={18} />
              <span>{message.text}</span>
            </div>
          )}

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
              <button 
                className="btn-primary"
                onClick={handleSaveAll}
                disabled={loading}
              >
                <Save size={18} />
                <span>{loading ? 'Guardando...' : 'Guardar Todo'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientRecord;