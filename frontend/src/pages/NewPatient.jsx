// PatientRecord.js
import React, { useState } from 'react';
import '../styles/NewPatient.css';
import { 
  Calendar,
  FileText, 
  Clipboard, 
  User,
  Heart,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Save,
  Printer,
  Download,
  X,
  Check,
  Phone,
  Mail,
  Home,
  Briefcase
} from 'lucide-react';
import Navigation from '../components/Navigation';

const PatientRecord = ({ setIsAuthenticated, user, setUser }) => {
  const [activeTab, setActiveTab] = useState('odontograma');
  // eslint-disable-next-line no-unused-vars
  const [currentStep, setCurrentStep] = useState(1);
  const [medicalHistory, setMedicalHistory] = useState({
    // Datos personales
    name: 'María',
    lastname: 'González',
    birthDate: '1985-05-15',
    phone: '+1 234 567 890',
    email: 'maria.gonzalez@email.com',
    address: 'Calle Principal 123, Ciudad',
    occupation: 'Ingeniera',
    
    // Obra social
    healthInsurance: {
      number: '123456789',
      isHolder: true,
      observations: 'Sin observaciones',
      elements: '1'
    },
    
    // Acta de consentimiento
    consent: {
      dni: '',
      readAccepted: false,
      date: new Date().toISOString().split('T')[0]
    },
    
    // Datos médicos
    primaryDoctor: '',
    primaryDoctorPhone: '',
    primaryService: '',
    allergies: {
      hasAllergies: false,
      description: ''
    },
    currentTreatment: {
      underTreatment: false,
      description: ''
    },
    hospitalization: {
      wasHospitalized: false,
      reason: ''
    },
    
    // Historial médico
    healingProblems: false,
    bloodType: '',
    bloodRh: '',
    takesMedication: false,
    medication: '',
    isPregnant: false,
    pregnancyTime: '',
    obstetrician: '',
    obstetricianPhone: '',
    
    // Enfermedades (marcar con X)
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

  const tabs = [
    { id: 'odontograma', label: 'Odontograma', icon: <FileText size={20} /> },
    { id: 'datos', label: 'Datos Personales', icon: <User size={20} /> },
    { id: 'consentimiento', label: 'Consentimiento', icon: <Clipboard size={20} /> },
    { id: 'anamnesis', label: 'Anamnesis', icon: <Briefcase size={20} /> }
  ];

  const dentalChart = [
    { number: 18, type: 'Molar', status: 'healthy' },
    { number: 17, type: 'Molar', status: 'cavity' },
    { number: 16, type: 'Molar', status: 'filled' },
    { number: 15, type: 'Premolar', status: 'healthy' },
    { number: 14, type: 'Premolar', status: 'healthy' },
    { number: 13, type: 'Canine', status: 'cavity' },
    { number: 12, type: 'Incisor', status: 'healthy' },
    { number: 11, type: 'Incisor', status: 'healthy' },
    { number: 21, type: 'Incisor', status: 'healthy' },
    { number: 22, type: 'Incisor', status: 'healthy' },
    { number: 23, type: 'Canine', status: 'healthy' },
    { number: 24, type: 'Premolar', status: 'filled' },
    { number: 25, type: 'Premolar', status: 'healthy' },
    { number: 26, type: 'Molar', status: 'cavity' },
    { number: 27, type: 'Molar', status: 'extracted' },
    { number: 28, type: 'Molar', status: 'healthy' }
  ];

  const renderOdontograma = () => (
    <div className="odontograma-section">
      <div className="section-header">
        <h3>Odontograma</h3>
        <div className="section-actions">
          <button className="btn-outline small">
            <Download size={16} />
            <span>Guardar Diagrama</span>
          </button>
          <button className="btn-outline small">
            <Printer size={16} />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      <div className="dental-chart-container">
        <div className="dental-chart-legend">
          <div className="legend-item">
            <div className="legend-color healthy"></div>
            <span>Sano</span>
          </div>
          <div className="legend-item">
            <div className="legend-color cavity"></div>
            <span>Caries</span>
          </div>
          <div className="legend-item">
            <div className="legend-color filled"></div>
            <span>Obturado</span>
          </div>
          <div className="legend-item">
            <div className="legend-color extracted"></div>
            <span>Extraído</span>
          </div>
          <div className="legend-item">
            <div className="legend-color planned"></div>
            <span>Planificado</span>
          </div>
        </div>

        <div className="dental-chart">
          <div className="upper-jaw">
            <div className="jaw-label">Arcada Superior</div>
            <div className="teeth-row">
              {dentalChart.slice(0, 8).map(tooth => (
                <div key={tooth.number} className={`tooth ${tooth.status}`}>
                  <span className="tooth-number">{tooth.number}</span>
                  <span className="tooth-type">{tooth.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lower-jaw">
            <div className="teeth-row">
              {dentalChart.slice(8, 16).map(tooth => (
                <div key={tooth.number} className={`tooth ${tooth.status}`}>
                  <span className="tooth-number">{tooth.number}</span>
                  <span className="tooth-type">{tooth.type}</span>
                </div>
              ))}
            </div>
            <div className="jaw-label">Arcada Inferior</div>
          </div>
        </div>

        <div className="dental-notes">
          <h4>Observaciones Odontológicas</h4>
          <textarea 
            className="notes-textarea"
            placeholder="Ingrese observaciones sobre el estado dental del paciente..."
            rows="4"
          />
          <div className="notes-actions">
            <button className="btn-primary small">
              <Save size={16} />
              <span>Guardar Notas</span>
            </button>
          </div>
        </div>
      </div>

      <div className="treatment-plan">
        <h4>Plan de Tratamiento</h4>
        <div className="plan-items">
          <div className="plan-item">
            <div className="plan-info">
              <span className="plan-tooth">Diente 16</span>
              <span className="plan-treatment">Obturación composite</span>
            </div>
            <span className="plan-status pending">Pendiente</span>
          </div>
          <div className="plan-item">
            <div className="plan-info">
              <span className="plan-tooth">Diente 26</span>
              <span className="plan-treatment">Tratamiento de conducto</span>
            </div>
            <span className="plan-status in-progress">En Progreso</span>
          </div>
          <div className="plan-item">
            <div className="plan-info">
              <span className="plan-tooth">Diente 27</span>
              <span className="plan-treatment">Extracción</span>
            </div>
            <span className="plan-status completed">Completado</span>
          </div>
        </div>
        <button className="btn-outline">
          <Plus size={16} />
          <span>Agregar Tratamiento</span>
        </button>
      </div>
    </div>
  );

  const renderDatosPersonales = () => (
    <div className="datos-personales-section">
      <div className="section-header">
        <h3>Datos Personales</h3>
        <button className="btn-primary">
          <Save size={18} />
          <span>Guardar Cambios</span>
        </button>
      </div>

      <div className="datos-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input
              type="text"
              id="name"
              value={medicalHistory.name}
              onChange={(e) => setMedicalHistory({...medicalHistory, name: e.target.value})}
              placeholder="Nombre"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Apellido *</label>
            <input
              type="text"
              id="lastname"
              value={medicalHistory.lastname}
              onChange={(e) => setMedicalHistory({...medicalHistory, lastname: e.target.value})}
              placeholder="Apellido"
            />
          </div>
          <div className="form-group">
            <label htmlFor="birthDate">Fecha de Nacimiento *</label>
            <input
              type="date"
              id="birthDate"
              value={medicalHistory.birthDate}
              onChange={(e) => setMedicalHistory({...medicalHistory, birthDate: e.target.value})}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Teléfono *</label>
            <div className="input-with-icon">
              <Phone size={16} />
              <input
                type="tel"
                id="phone"
                value={medicalHistory.phone}
                onChange={(e) => setMedicalHistory({...medicalHistory, phone: e.target.value})}
                placeholder="+1 234 567 890"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <div className="input-with-icon">
              <Mail size={16} />
              <input
                type="email"
                id="email"
                value={medicalHistory.email}
                onChange={(e) => setMedicalHistory({...medicalHistory, email: e.target.value})}
                placeholder="email@ejemplo.com"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address">Dirección *</label>
            <div className="input-with-icon">
              <Home size={16} />
              <input
                type="text"
                id="address"
                value={medicalHistory.address}
                onChange={(e) => setMedicalHistory({...medicalHistory, address: e.target.value})}
                placeholder="Calle y número"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="occupation">Ocupación *</label>
            <div className="input-with-icon">
              <Briefcase size={16} />
              <input
                type="text"
                id="occupation"
                value={medicalHistory.occupation}
                onChange={(e) => setMedicalHistory({...medicalHistory, occupation: e.target.value})}
                placeholder="Profesión u oficio"
              />
            </div>
          </div>
        </div>

        <div className="insurance-section">
          <h4>Datos de Obra Social</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="insuranceNumber">Número de Afiliado *</label>
              <input
                type="text"
                id="insuranceNumber"
                value={medicalHistory.healthInsurance.number}
                onChange={(e) => setMedicalHistory({
                  ...medicalHistory, 
                  healthInsurance: {...medicalHistory.healthInsurance, number: e.target.value}
                })}
                placeholder="Número de afiliado"
              />
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={medicalHistory.healthInsurance.isHolder}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    healthInsurance: {...medicalHistory.healthInsurance, isHolder: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Titular
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="elements">Número de Elementos</label>
              <input
                type="number"
                id="elements"
                value={medicalHistory.healthInsurance.elements}
                onChange={(e) => setMedicalHistory({
                  ...medicalHistory,
                  healthInsurance: {...medicalHistory.healthInsurance, elements: e.target.value}
                })}
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="observations">Observaciones</label>
            <textarea
              id="observations"
              value={medicalHistory.healthInsurance.observations}
              onChange={(e) => setMedicalHistory({
                ...medicalHistory,
                healthInsurance: {...medicalHistory.healthInsurance, observations: e.target.value}
              })}
              placeholder="Observaciones sobre la obra social..."
              rows="3"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsentimiento = () => (
    <div className="consentimiento-section">
      <div className="section-header">
        <h3>Acta de Consentimiento</h3>
        <button className="btn-primary">
          <Save size={18} />
          <span>Firmar y Guardar</span>
        </button>
      </div>

      <div className="consent-form">
        <div className="consent-text">
          <p>
            En este acto, yo __________ DNI __________ autorizo a Od ______ M.P. _____ 
            y/o asociados o ayudantes a realizar el tratamiento informado, conversado 
            con el profesional sobre la naturaleza y propósito del tratamiento, sobre 
            la posibilidad de complicaciones, los riesgos y administración de anestesia 
            local, práctica, radiografías y otros métodos de diagnóstico.
          </p>
        </div>

        <div className="consent-fields">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="consentDni">DNI *</label>
              <input
                type="text"
                id="consentDni"
                value={medicalHistory.consent.dni}
                onChange={(e) => setMedicalHistory({
                  ...medicalHistory,
                  consent: {...medicalHistory.consent, dni: e.target.value}
                })}
                placeholder="Ingrese su DNI"
              />
            </div>
            <div className="form-group">
              <label htmlFor="consentDate">Fecha *</label>
              <input
                type="date"
                id="consentDate"
                value={medicalHistory.consent.date}
                onChange={(e) => setMedicalHistory({
                  ...medicalHistory,
                  consent: {...medicalHistory.consent, date: e.target.value}
                })}
                readOnly
              />
            </div>
          </div>

          <div className="consent-acceptance">
            <label className="checkbox-label large">
              <input
                type="checkbox"
                checked={medicalHistory.consent.readAccepted}
                onChange={(e) => setMedicalHistory({
                  ...medicalHistory,
                  consent: {...medicalHistory.consent, readAccepted: e.target.checked}
                })}
              />
              <span className="checkmark large"></span>
              <div className="acceptance-text">
                <h4>He leído y acepto</h4>
                <p>Declaro que he leído y comprendido la información anterior</p>
              </div>
            </label>
          </div>

          <div className="signature-pad">
            <h4>Firma del Paciente</h4>
            <div className="signature-area">
              <p>Espacio para firma digital</p>
              <button className="btn-outline">
                <FileText size={16} />
                <span>Capturar Firma</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnamnesis = () => (
    <div className="anamnesis-section">
      <div className="section-header">
        <h3>Historia Clínica - Anamnesis</h3>
        <button className="btn-primary">
          <Save size={18} />
          <span>Guardar Historia</span>
        </button>
      </div>

      <div className="anamnesis-form">
        {/* Sección 1 */}
        <div className="anamnesis-part">
          <h4>(1) Datos Médicos Generales</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="primaryDoctor">Médico de Cabecera</label>
              <input
                type="text"
                id="primaryDoctor"
                value={medicalHistory.primaryDoctor}
                onChange={(e) => setMedicalHistory({...medicalHistory, primaryDoctor: e.target.value})}
                placeholder="Nombre del médico"
              />
            </div>
            <div className="form-group">
              <label htmlFor="primaryDoctorPhone">Teléfono</label>
              <input
                type="tel"
                id="primaryDoctorPhone"
                value={medicalHistory.primaryDoctorPhone}
                onChange={(e) => setMedicalHistory({...medicalHistory, primaryDoctorPhone: e.target.value})}
                placeholder="Teléfono del médico"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="primaryService">Servicio de Cabecera</label>
            <input
              type="text"
              id="primaryService"
              value={medicalHistory.primaryService}
              onChange={(e) => setMedicalHistory({...medicalHistory, primaryService: e.target.value})}
              placeholder="Hospital o clínica"
            />
          </div>

          <div className="yes-no-group">
            <h5>¿Es alérgico a algún medicamento, antibiótico, polen, picadura de insecto, etc.?</h5>
            <div className="yes-no-buttons">
              <button
                className={`yes-no-btn ${medicalHistory.allergies.hasAllergies ? 'active' : ''}`}
                onClick={() => setMedicalHistory({
                  ...medicalHistory,
                  allergies: {...medicalHistory.allergies, hasAllergies: true}
                })}
              >
                <CheckCircle size={16} />
                SI
              </button>
              <button
                className={`yes-no-btn ${!medicalHistory.allergies.hasAllergies ? 'active' : ''}`}
                onClick={() => setMedicalHistory({
                  ...medicalHistory,
                  allergies: {...medicalHistory.allergies, hasAllergies: false}
                })}
              >
                <X size={16} />
                NO
              </button>
            </div>
            {medicalHistory.allergies.hasAllergies && (
              <div className="form-group">
                <label htmlFor="allergiesDescription">¿A qué?</label>
                <input
                  type="text"
                  id="allergiesDescription"
                  value={medicalHistory.allergies.description}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    allergies: {...medicalHistory.allergies, description: e.target.value}
                  })}
                  placeholder="Describa las alergias"
                />
              </div>
            )}
          </div>

          <div className="yes-no-group">
            <h5>¿Está bajo tratamiento médico?</h5>
            <div className="yes-no-buttons">
              <button
                className={`yes-no-btn ${medicalHistory.currentTreatment.underTreatment ? 'active' : ''}`}
                onClick={() => setMedicalHistory({
                  ...medicalHistory,
                  currentTreatment: {...medicalHistory.currentTreatment, underTreatment: true}
                })}
              >
                <CheckCircle size={16} />
                SI
              </button>
              <button
                className={`yes-no-btn ${!medicalHistory.currentTreatment.underTreatment ? 'active' : ''}`}
                onClick={() => setMedicalHistory({
                  ...medicalHistory,
                  currentTreatment: {...medicalHistory.currentTreatment, underTreatment: false}
                })}
              >
                <X size={16} />
                NO
              </button>
            </div>
            {medicalHistory.currentTreatment.underTreatment && (
              <div className="form-group">
                <label htmlFor="treatmentDescription">¿Cuál/Cuáles?</label>
                <input
                  type="text"
                  id="treatmentDescription"
                  value={medicalHistory.currentTreatment.description}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    currentTreatment: {...medicalHistory.currentTreatment, description: e.target.value}
                  })}
                  placeholder="Describa el tratamiento"
                />
              </div>
            )}
          </div>

          <div className="yes-no-group">
            <h5>¿Fue hospitalizado el último año?</h5>
            <div className="yes-no-buttons">
              <button
                className={`yes-no-btn ${medicalHistory.hospitalization.wasHospitalized ? 'active' : ''}`}
                onClick={() => setMedicalHistory({
                  ...medicalHistory,
                  hospitalization: {...medicalHistory.hospitalization, wasHospitalized: true}
                })}
              >
                <CheckCircle size={16} />
                SI
              </button>
              <button
                className={`yes-no-btn ${!medicalHistory.hospitalization.wasHospitalized ? 'active' : ''}`}
                onClick={() => setMedicalHistory({
                  ...medicalHistory,
                  hospitalization: {...medicalHistory.hospitalization, wasHospitalized: false}
                })}
              >
                <X size={16} />
                NO
              </button>
            </div>
            {medicalHistory.hospitalization.wasHospitalized && (
              <div className="form-group">
                <label htmlFor="hospitalizationReason">¿Por qué razón?</label>
                <input
                  type="text"
                  id="hospitalizationReason"
                  value={medicalHistory.hospitalization.reason}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    hospitalization: {...medicalHistory.hospitalization, reason: e.target.value}
                  })}
                  placeholder="Razón de la hospitalización"
                />
              </div>
            )}
          </div>
        </div>

        {/* Sección 2 */}
        <div className="anamnesis-part">
          <h4>(2) Historial Médico</h4>
          
          <div className="yes-no-group">
            <h5>¿Tiene o tuvo alguna vez problemas para cicatrizar?</h5>
            <div className="yes-no-buttons">
              <button
                className={`yes-no-btn ${medicalHistory.healingProblems ? 'active' : ''}`}
                onClick={() => setMedicalHistory({...medicalHistory, healingProblems: true})}
              >
                <CheckCircle size={16} />
                SI
              </button>
              <button
                className={`yes-no-btn ${!medicalHistory.healingProblems ? 'active' : ''}`}
                onClick={() => setMedicalHistory({...medicalHistory, healingProblems: false})}
              >
                <X size={16} />
                NO
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bloodType">Grupo Sanguíneo</label>
              <select
                id="bloodType"
                value={medicalHistory.bloodType}
                onChange={(e) => setMedicalHistory({...medicalHistory, bloodType: e.target.value})}
              >
                <option value="">Seleccionar</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="bloodRh">RH</label>
              <select
                id="bloodRh"
                value={medicalHistory.bloodRh}
                onChange={(e) => setMedicalHistory({...medicalHistory, bloodRh: e.target.value})}
              >
                <option value="">Seleccionar</option>
                <option value="+">+ (Positivo)</option>
                <option value="-">- (Negativo)</option>
              </select>
            </div>
          </div>

          <div className="yes-no-group">
            <h5>¿Toma algún medicamento?</h5>
            <div className="yes-no-buttons">
              <button
                className={`yes-no-btn ${medicalHistory.takesMedication ? 'active' : ''}`}
                onClick={() => setMedicalHistory({...medicalHistory, takesMedication: true})}
              >
                <CheckCircle size={16} />
                SI
              </button>
              <button
                className={`yes-no-btn ${!medicalHistory.takesMedication ? 'active' : ''}`}
                onClick={() => setMedicalHistory({...medicalHistory, takesMedication: false})}
              >
                <X size={16} />
                NO
              </button>
            </div>
            {medicalHistory.takesMedication && (
              <div className="form-group">
                <label htmlFor="medication">¿Cuál/Cuáles?</label>
                <input
                  type="text"
                  id="medication"
                  value={medicalHistory.medication}
                  onChange={(e) => setMedicalHistory({...medicalHistory, medication: e.target.value})}
                  placeholder="Nombre del medicamento"
                />
              </div>
            )}
          </div>

          <div className="yes-no-group">
            <h5>¿Está Ud. embarazada?</h5>
            <div className="yes-no-buttons">
              <button
                className={`yes-no-btn ${medicalHistory.isPregnant ? 'active' : ''}`}
                onClick={() => setMedicalHistory({...medicalHistory, isPregnant: true})}
              >
                <CheckCircle size={16} />
                SI
              </button>
              <button
                className={`yes-no-btn ${!medicalHistory.isPregnant ? 'active' : ''}`}
                onClick={() => setMedicalHistory({...medicalHistory, isPregnant: false})}
              >
                <X size={16} />
                NO
              </button>
            </div>
            {medicalHistory.isPregnant && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pregnancyTime">Tiempo gestacional</label>
                  <input
                    type="text"
                    id="pregnancyTime"
                    value={medicalHistory.pregnancyTime}
                    onChange={(e) => setMedicalHistory({...medicalHistory, pregnancyTime: e.target.value})}
                    placeholder="Ej: 12 semanas"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="obstetrician">Obstetra</label>
                  <input
                    type="text"
                    id="obstetrician"
                    value={medicalHistory.obstetrician}
                    onChange={(e) => setMedicalHistory({...medicalHistory, obstetrician: e.target.value})}
                    placeholder="Nombre del obstetra"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="obstetricianPhone">Teléfono</label>
                  <input
                    type="tel"
                    id="obstetricianPhone"
                    value={medicalHistory.obstetricianPhone}
                    onChange={(e) => setMedicalHistory({...medicalHistory, obstetricianPhone: e.target.value})}
                    placeholder="Teléfono del obstetra"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sección 3 - Enfermedades */}
        <div className="anamnesis-part">
          <h4>(3) Antecedentes Patológicos</h4>
          <p className="section-subtitle">Marcar con una X aquellas opciones que resulten positivas</p>
          
          <div className="diseases-grid">
            {/* Columna 1 */}
            <div className="disease-column">
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.diabetes}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, diabetes: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Diabetes
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.hypertension}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, hypertension: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Hipertensión arterial
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.rheumaticFever}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, rheumaticFever: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Fiebre Reumática
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.boneDiseases}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, boneDiseases: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Enfermedades de los huesos
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.arthritis}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, arthritis: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Artritis - Artrosis
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.muscleDiseases}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, muscleDiseases: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Enfermedades musculares
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.asthma}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, asthma: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Asma
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.respiratoryDiseases}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, respiratoryDiseases: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Enfermedades respiratorias
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.sinusitis}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, sinusitis: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Sinusitis - Otitis - Anginas
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.jointDiseases}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, jointDiseases: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Enfermedades articulares
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.hepatitis}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, hepatitis: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Hepatitis
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.kidneyDiseases}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, kidneyDiseases: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Enfermedades renales
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.liverDiseases}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, liverDiseases: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Enf. del hígado
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.congenitalDiseases}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, congenitalDiseases: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Enfermedades congénitas
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.chagas}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, chagas: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Chagas
              </label>
            </div>

            {/* Columna 2 */}
            <div className="disease-column">
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.headaches}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, headaches: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Dolores de cabeza - Mareos
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.epilepsy}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, epilepsy: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Convulsiones - Epilepsia
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.psychiatric}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, psychiatric: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Enfermedades psiquiátricas
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.unconsciousness}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, unconsciousness: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Pérdida de conocimiento
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.heartDiseases}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, heartDiseases: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Enfermedades cardíacas
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.consumesAlcohol}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, consumesAlcohol: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Consume alcohol
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.bloodDiseases}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, bloodDiseases: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Enfermedades de la sangre
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.consumesTobacco}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, consumesTobacco: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Consume Tabaco
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.lymphDiseases}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, lymphDiseases: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Enfermedades de ganglios
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.surgeries}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, surgeries: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Intervenciones quirúrgicas
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.skinDiseases}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, skinDiseases: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Enfermedades de la piel
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.receivedTransfusions}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, receivedTransfusions: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Recibió transfusiones
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.std}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, std: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Enf. de transmisión sexual
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.receivedDialysis}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, receivedDialysis: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Recibió hemodiálisis
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.chronicInfections}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, chronicInfections: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Infecciones crónicas
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.operations}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, operations: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Operaciones
              </label>
              <label className="checkbox-label disease">
                <input
                  type="checkbox"
                  checked={medicalHistory.diseases.glandularDiseases}
                  onChange={(e) => setMedicalHistory({
                    ...medicalHistory,
                    diseases: {...medicalHistory.diseases, glandularDiseases: e.target.checked}
                  })}
                />
                <span className="checkmark"></span>
                Enfermedades glandulares
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="observationsGeneral">Observaciones</label>
            <textarea
              id="observationsGeneral"
              value={medicalHistory.observations}
              onChange={(e) => setMedicalHistory({...medicalHistory, observations: e.target.value})}
              placeholder="Observaciones adicionales sobre el historial médico..."
              rows="3"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'odontograma':
        return renderOdontograma();
      case 'datos':
        return renderDatosPersonales();
      case 'consentimiento':
        return renderConsentimiento();
      case 'anamnesis':
        return renderAnamnesis();
      default:
        return renderOdontograma();
    }
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

  return (
    <div className="app">
      <Navigation 
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />

      <main className="main-content">
        <div className="patient-record-container">
          <div className="content-header">
            <div className="patient-header">
              <h1>Ficha del Paciente</h1>
              <div className="patient-subtitle">
                <span className="patient-name">{medicalHistory.name} {medicalHistory.lastname}</span>
                <span className="patient-id">ID: #P-{medicalHistory.healthInsurance.number.slice(0, 6)}</span>
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
                  style={{width: `${((tabs.findIndex(tab => tab.id === activeTab) + 1) / tabs.length) * 100}%`}}
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