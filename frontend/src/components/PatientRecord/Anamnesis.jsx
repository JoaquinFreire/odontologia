// components/PatientRecord/Anamnesis.jsx
import React, { useState } from 'react';
import { Save, CheckCircle, X } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
const Anamnesis = ({ patientData, setPatientData }) => {
  const [anamnesisData, setAnamnesisData] = useState({
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

  const handleDiseaseChange = (disease, value) => {
    setAnamnesisData(prev => ({
      ...prev,
      diseases: {
        ...prev.diseases,
        [disease]: value
      }
    }));
  };

  const renderYesNoGroup = (title, stateKey, state) => {
    const isYes = state[stateKey];
    
    return (
      <div className="yes-no-group">
        <h5>{title}</h5>
        <div className="yes-no-buttons">
          <button
            className={`yes-no-btn ${isYes ? 'active' : ''}`}
            onClick={() => {
              if (stateKey.includes('.')) {
                const [parent, child] = stateKey.split('.');
                setAnamnesisData(prev => ({
                  ...prev,
                  [parent]: { ...prev[parent], [child]: true }
                }));
              } else {
                setAnamnesisData(prev => ({ ...prev, [stateKey]: true }));
              }
            }}
          >
            <CheckCircle size={16} />
            SI
          </button>
          <button
            className={`yes-no-btn ${!isYes ? 'active' : ''}`}
            onClick={() => {
              if (stateKey.includes('.')) {
                const [parent, child] = stateKey.split('.');
                setAnamnesisData(prev => ({
                  ...prev,
                  [parent]: { ...prev[parent], [child]: false }
                }));
              } else {
                setAnamnesisData(prev => ({ ...prev, [stateKey]: false }));
              }
            }}
          >
            <X size={16} />
            NO
          </button>
        </div>
      </div>
    );
  };

  return (
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
                value={anamnesisData.primaryDoctor}
                onChange={(e) => setAnamnesisData({...anamnesisData, primaryDoctor: e.target.value})}
                placeholder="Nombre del médico"
              />
            </div>
            <div className="form-group">
              <label htmlFor="primaryDoctorPhone">Teléfono</label>
              <input
                type="tel"
                id="primaryDoctorPhone"
                value={anamnesisData.primaryDoctorPhone}
                onChange={(e) => setAnamnesisData({...anamnesisData, primaryDoctorPhone: e.target.value})}
                placeholder="Teléfono del médico"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="primaryService">Servicio de Cabecera</label>
            <input
              type="text"
              id="primaryService"
              value={anamnesisData.primaryService}
              onChange={(e) => setAnamnesisData({...anamnesisData, primaryService: e.target.value})}
              placeholder="Hospital o clínica"
            />
          </div>

          {renderYesNoGroup('¿Es alérgico a algún medicamento, antibiótico, polen, picadura de insecto, etc.?', 'allergies.hasAllergies', anamnesisData)}
          
          {anamnesisData.allergies.hasAllergies && (
            <div className="form-group">
              <label htmlFor="allergiesDescription">¿A qué?</label>
              <input
                type="text"
                id="allergiesDescription"
                value={anamnesisData.allergies.description}
                onChange={(e) => setAnamnesisData({
                  ...anamnesisData,
                  allergies: {...anamnesisData.allergies, description: e.target.value}
                })}
                placeholder="Describa las alergias"
              />
            </div>
          )}

          {renderYesNoGroup('¿Está bajo tratamiento médico?', 'currentTreatment.underTreatment', anamnesisData)}
          
          {anamnesisData.currentTreatment.underTreatment && (
            <div className="form-group">
              <label htmlFor="treatmentDescription">¿Cuál/Cuáles?</label>
              <input
                type="text"
                id="treatmentDescription"
                value={anamnesisData.currentTreatment.description}
                onChange={(e) => setAnamnesisData({
                  ...anamnesisData,
                  currentTreatment: {...anamnesisData.currentTreatment, description: e.target.value}
                })}
                placeholder="Describa el tratamiento"
              />
            </div>
          )}

          {renderYesNoGroup('¿Fue hospitalizado el último año?', 'hospitalization.wasHospitalized', anamnesisData)}
          
          {anamnesisData.hospitalization.wasHospitalized && (
            <div className="form-group">
              <label htmlFor="hospitalizationReason">¿Por qué razón?</label>
              <input
                type="text"
                id="hospitalizationReason"
                value={anamnesisData.hospitalization.reason}
                onChange={(e) => setAnamnesisData({
                  ...anamnesisData,
                  hospitalization: {...anamnesisData.hospitalization, reason: e.target.value}
                })}
                placeholder="Razón de la hospitalización"
              />
            </div>
          )}
        </div>

        {/* Sección 2 */}
        <div className="anamnesis-part">
          <h4>(2) Historial Médico</h4>
          
          {renderYesNoGroup('¿Tiene o tuvo alguna vez problemas para cicatrizar?', 'healingProblems', anamnesisData)}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bloodType">Grupo Sanguíneo</label>
              <select
                id="bloodType"
                value={anamnesisData.bloodType}
                onChange={(e) => setAnamnesisData({...anamnesisData, bloodType: e.target.value})}
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
                value={anamnesisData.bloodRh}
                onChange={(e) => setAnamnesisData({...anamnesisData, bloodRh: e.target.value})}
              >
                <option value="">Seleccionar</option>
                <option value="+">+ (Positivo)</option>
                <option value="-">- (Negativo)</option>
              </select>
            </div>
          </div>

          {renderYesNoGroup('¿Toma algún medicamento?', 'takesMedication', anamnesisData)}
          
          {anamnesisData.takesMedication && (
            <div className="form-group">
              <label htmlFor="medication">¿Cuál/Cuáles?</label>
              <input
                type="text"
                id="medication"
                value={anamnesisData.medication}
                onChange={(e) => setAnamnesisData({...anamnesisData, medication: e.target.value})}
                placeholder="Nombre del medicamento"
              />
            </div>
          )}

          {renderYesNoGroup('¿Está Ud. embarazada?', 'isPregnant', anamnesisData)}
          
          {anamnesisData.isPregnant && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pregnancyTime">Tiempo gestacional</label>
                <input
                  type="text"
                  id="pregnancyTime"
                  value={anamnesisData.pregnancyTime}
                  onChange={(e) => setAnamnesisData({...anamnesisData, pregnancyTime: e.target.value})}
                  placeholder="Ej: 12 semanas"
                />
              </div>
              <div className="form-group">
                <label htmlFor="obstetrician">Obstetra</label>
                <input
                  type="text"
                  id="obstetrician"
                  value={anamnesisData.obstetrician}
                  onChange={(e) => setAnamnesisData({...anamnesisData, obstetrician: e.target.value})}
                  placeholder="Nombre del obstetra"
                />
              </div>
              <div className="form-group">
                <label htmlFor="obstetricianPhone">Teléfono</label>
                <input
                  type="tel"
                  id="obstetricianPhone"
                  value={anamnesisData.obstetricianPhone}
                  onChange={(e) => setAnamnesisData({...anamnesisData, obstetricianPhone: e.target.value})}
                  placeholder="Teléfono del obstetra"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sección 3 - Enfermedades */}
        <div className="anamnesis-part">
          <h4>(3) Antecedentes Patológicos</h4>
          <p className="section-subtitle">Marcar con una X aquellas opciones que resulten positivas</p>
          
          <div className="diseases-grid">
            {/* Columna 1 */}
            <div className="disease-column">
              {[
                'diabetes', 'hypertension', 'rheumaticFever', 'boneDiseases', 'arthritis',
                'muscleDiseases', 'asthma', 'respiratoryDiseases', 'sinusitis', 'jointDiseases',
                'hepatitis', 'kidneyDiseases', 'liverDiseases', 'congenitalDiseases', 'chagas'
              ].map(disease => (
                <label key={disease} className="checkbox-label disease">
                  <input
                    type="checkbox"
                    checked={anamnesisData.diseases[disease]}
                    onChange={(e) => handleDiseaseChange(disease, e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  {disease === 'diabetes' ? 'Diabetes' :
                   disease === 'hypertension' ? 'Hipertensión arterial' :
                   disease === 'rheumaticFever' ? 'Fiebre Reumática' :
                   disease === 'boneDiseases' ? 'Enfermedades de los huesos' :
                   disease === 'arthritis' ? 'Artritis - Artrosis' :
                   disease === 'muscleDiseases' ? 'Enfermedades musculares' :
                   disease === 'asthma' ? 'Asma' :
                   disease === 'respiratoryDiseases' ? 'Enfermedades respiratorias' :
                   disease === 'sinusitis' ? 'Sinusitis - Otitis - Anginas' :
                   disease === 'jointDiseases' ? 'Enfermedades articulares' :
                   disease === 'hepatitis' ? 'Hepatitis' :
                   disease === 'kidneyDiseases' ? 'Enfermedades renales' :
                   disease === 'liverDiseases' ? 'Enf. del hígado' :
                   disease === 'congenitalDiseases' ? 'Enfermedades congénitas' :
                   'Chagas'}
                </label>
              ))}
            </div>

            {/* Columna 2 */}
            <div className="disease-column">
              {[
                'headaches', 'epilepsy', 'psychiatric', 'unconsciousness', 'heartDiseases',
                'consumesAlcohol', 'bloodDiseases', 'consumesTobacco', 'lymphDiseases',
                'surgeries', 'skinDiseases', 'receivedTransfusions', 'std', 'receivedDialysis',
                'chronicInfections', 'operations', 'glandularDiseases'
              ].map(disease => (
                <label key={disease} className="checkbox-label disease">
                  <input
                    type="checkbox"
                    checked={anamnesisData.diseases[disease]}
                    onChange={(e) => handleDiseaseChange(disease, e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  {disease === 'headaches' ? 'Dolores de cabeza - Mareos' :
                   disease === 'epilepsy' ? 'Convulsiones - Epilepsia' :
                   disease === 'psychiatric' ? 'Enfermedades psiquiátricas' :
                   disease === 'unconsciousness' ? 'Pérdida de conocimiento' :
                   disease === 'heartDiseases' ? 'Enfermedades cardíacas' :
                   disease === 'consumesAlcohol' ? 'Consume alcohol' :
                   disease === 'bloodDiseases' ? 'Enfermedades de la sangre' :
                   disease === 'consumesTobacco' ? 'Consume Tabaco' :
                   disease === 'lymphDiseases' ? 'Enfermedades de ganglios' :
                   disease === 'surgeries' ? 'Intervenciones quirúrgicas' :
                   disease === 'skinDiseases' ? 'Enfermedades de la piel' :
                   disease === 'receivedTransfusions' ? 'Recibió transfusiones' :
                   disease === 'std' ? 'Enf. de transmisión sexual' :
                   disease === 'receivedDialysis' ? 'Recibió hemodiálisis' :
                   disease === 'chronicInfections' ? 'Infecciones crónicas' :
                   disease === 'operations' ? 'Operaciones' :
                   'Enfermedades glandulares'}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="observationsGeneral">Observaciones</label>
            <textarea
              id="observationsGeneral"
              value={anamnesisData.observations}
              onChange={(e) => setAnamnesisData({...anamnesisData, observations: e.target.value})}
              placeholder="Observaciones adicionales sobre el historial médico..."
              rows="3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Anamnesis;