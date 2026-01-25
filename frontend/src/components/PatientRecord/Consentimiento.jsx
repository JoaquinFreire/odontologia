// components/PatientRecord/Consentimiento.jsx
import React from 'react';
import { Save, FileText } from 'lucide-react';
const Consentimiento = ({ patientData, setPatientData }) => {
  const handleConsentChange = (field, value) => {
    setPatientData(prev => ({
      ...prev,
      consent: {
        ...prev.consent,
        [field]: value
      }
    }));
  };

  return (
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
                value={patientData.consent?.dni || ''}
                onChange={(e) => handleConsentChange('dni', e.target.value)}
                placeholder="Ingrese su DNI"
              />
            </div>
            <div className="form-group">
              <label htmlFor="consentDate">Fecha *</label>
              <input
                type="date"
                id="consentDate"
                value={patientData.consent?.date || new Date().toISOString().split('T')[0]}
                onChange={(e) => handleConsentChange('date', e.target.value)}
                readOnly
              />
            </div>
          </div>

          <div className="consent-acceptance">
            <label className="checkbox-label large">
              <input
                type="checkbox"
                checked={patientData.consent?.readAccepted || false}
                onChange={(e) => handleConsentChange('readAccepted', e.target.checked)}
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
};

export default Consentimiento;