// components/PatientRecord/Odontograma.jsx
import React, { useState } from 'react';
import { Download, Printer, Save, Plus, Trash2 } from 'lucide-react';
const Odontograma = ({ patientData, setPatientData }) => {
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState('healthy');
  
  // Condiciones dentales como en la imagen
  const conditions = [
    { id: 'caries', label: 'Caries', color: '#ff6b6b' },
    { id: 'obturation', label: 'Obturación', color: '#4ecdc4' },
    { id: 'crown', label: 'Corona', color: '#45b7d1' },
    { id: 'crown-temp', label: 'Corona (Temp)', color: '#96ceb4' },
    { id: 'absent', label: 'Ausente', color: '#999999' },
    { id: 'fracture', label: 'Fractura', color: '#feca57' },
    { id: 'diastema', label: 'Diastema', color: '#ff9ff3' },
    { id: 'prosthesis-rem', label: 'Prótesis Rem', color: '#54a0ff' },
    { id: 'migration', label: 'Migración', color: '#5f27cd' },
    { id: 'rotation', label: 'Rotación', color: '#00d2d3' },
    { id: 'fusion', label: 'Fusión', color: '#ff9f43' },
    { id: 'remnant', label: 'Remanente', color: '#c8d6e5' },
    { id: 'eruption', label: 'Erupción', color: '#1dd1a1' },
    { id: 'transposition', label: 'Transposición', color: '#f368e0' },
    { id: 'supernumerary', label: 'Supernumerario', color: '#ff9ff3' },
    { id: 'pulpar', label: 'Pulpar', color: '#ee5a24' },
    { id: 'prosthesis', label: 'Prótesis', color: '#1289A7' },
    { id: 'perno', label: 'Perno', color: '#A3CB38' },
    { id: 'ortho-fixed', label: 'Ortodoncia Fija', color: '#D980FA' },
    { id: 'prosthesis-fixed', label: 'Prótesis Fija', color: '#FDA7DF' },
    { id: 'implant', label: 'Implante', color: '#5758BB' },
    { id: 'macrodontia', label: 'Macrodoncia', color: '#12CBC4' },
    { id: 'microdontia', label: 'Microdoncia', color: '#C4E538' },
    { id: 'dyschromia', label: 'Discromía', color: '#ED4C67' },
    { id: 'worn', label: 'Desgastado', color: '#B53471' },
    { id: 'semi-impacted', label: 'Semi-impactado', color: '#006266' },
    { id: 'intrusion', label: 'Intrusión', color: '#6F1E51' },
    { id: 'edentulism', label: 'Edentulismo', color: '#1B1464' },
    { id: 'ectopic', label: 'Ectópico', color: '#009432' },
    { id: 'impacted', label: 'Impactado', color: '#0652DD' },
    { id: 'ortho-rem', label: 'Ortodoncia Rem', color: '#9980FA' },
    { id: 'extrusion', label: 'Extrusión', color: '#833471' },
    { id: 'post', label: 'Poste', color: '#ED4C67' },
  ];

  // Sistema de numeración dental
  const adultTeeth = {
    upper: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    lower: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
  };

  const childTeeth = {
    upper: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
    lower: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75]
  };

  const [dentalChart, setDentalChart] = useState(
    adultTeeth.upper.concat(adultTeeth.lower).map(number => ({
      number,
      condition: 'healthy',
      notes: ''
    }))
  );

  const handleToothClick = (toothNumber) => {
    setSelectedTooth(toothNumber);
    const tooth = dentalChart.find(t => t.number === toothNumber);
    if (tooth) {
      setSelectedCondition(tooth.condition);
    }
  };

  const applyCondition = () => {
    if (!selectedTooth) return;
    
    setDentalChart(prev => 
      prev.map(tooth => 
        tooth.number === selectedTooth 
          ? { ...tooth, condition: selectedCondition }
          : tooth
      )
    );
  };

  const clearAll = () => {
    setDentalChart(prev => 
      prev.map(tooth => ({ ...tooth, condition: 'healthy' }))
    );
    setSelectedTooth(null);
  };

  const getToothColor = (conditionId) => {
    const condition = conditions.find(c => c.id === conditionId);
    return condition ? condition.color : '#e0e0e0';
  };

  return (
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
          <button className="btn-outline small" onClick={clearAll}>
            <Trash2 size={16} />
            <span>Limpiar Todo</span>
          </button>
        </div>
      </div>

      <div className="odontograma-container">
        {/* Panel de condiciones */}
        <div className="conditions-panel">
          <h4>Condiciones Dentales</h4>
          <div className="conditions-grid">
            {conditions.map(condition => (
              <button
                key={condition.id}
                className={`condition-btn ${selectedCondition === condition.id ? 'active' : ''}`}
                onClick={() => setSelectedCondition(condition.id)}
                style={{ 
                  backgroundColor: condition.color,
                  borderColor: selectedCondition === condition.id ? '#1a237e' : condition.color
                }}
              >
                {condition.label}
              </button>
            ))}
          </div>
        </div>

        {/* Diagrama dental */}
        <div className="dental-diagram">
          {/* Arcada superior - Adulto */}
          <div className="jaw-section">
            <div className="jaw-label adult">Adulto - Arcada Superior</div>
            <div className="teeth-row upper">
              {adultTeeth.upper.map(number => {
                const tooth = dentalChart.find(t => t.number === number);
                return (
                  <div
                    key={`adult-upper-${number}`}
                    className={`tooth ${selectedTooth === number ? 'selected' : ''}`}
                    onClick={() => handleToothClick(number)}
                    style={{ backgroundColor: getToothColor(tooth?.condition) }}
                  >
                    <span className="tooth-number">{number}</span>
                    <span className="tooth-condition">
                      {conditions.find(c => c.id === tooth?.condition)?.label || 'Sano'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arcada inferior - Adulto */}
          <div className="jaw-section">
            <div className="jaw-label adult">Adulto - Arcada Inferior</div>
            <div className="teeth-row lower">
              {adultTeeth.lower.map(number => {
                const tooth = dentalChart.find(t => t.number === number);
                return (
                  <div
                    key={`adult-lower-${number}`}
                    className={`tooth ${selectedTooth === number ? 'selected' : ''}`}
                    onClick={() => handleToothClick(number)}
                    style={{ backgroundColor: getToothColor(tooth?.condition) }}
                  >
                    <span className="tooth-number">{number}</span>
                    <span className="tooth-condition">
                      {conditions.find(c => c.id === tooth?.condition)?.label || 'Sano'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagrama infantil */}
          <div className="child-diagram">
            <h4>Diagrama Infantil (Dentición Temporal)</h4>
            <div className="teeth-row upper">
              {childTeeth.upper.map(number => (
                <div key={`child-upper-${number}`} className="tooth child">
                  <span className="tooth-number">{number}</span>
                </div>
              ))}
            </div>
            <div className="teeth-row lower">
              {childTeeth.lower.map(number => (
                <div key={`child-lower-${number}`} className="tooth child">
                  <span className="tooth-number">{number}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botón de aplicar */}
          {selectedTooth && (
            <div className="apply-section">
              <p>Aplicar condición a diente {selectedTooth}:</p>
              <div className="apply-actions">
                <span className="selected-condition" style={{ backgroundColor: getToothColor(selectedCondition) }}>
                  {conditions.find(c => c.id === selectedCondition)?.label}
                </span>
                <button className="btn-primary small" onClick={applyCondition}>
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Observaciones y número de elementos */}
      <div className="odontograma-notes">
        <div className="notes-section">
          <h4>Observaciones Odontológicas</h4>
          <textarea
            className="notes-textarea"
            value={patientData.dentalObservations}
            onChange={(e) => setPatientData({
              ...patientData,
              dentalObservations: e.target.value
            })}
            placeholder="Ingrese observaciones sobre el estado dental del paciente..."
            rows="4"
          />
        </div>

        <div className="elements-section">
          <h4>Número de Elementos</h4>
          <div className="elements-input">
            <input
              type="number"
              min="1"
              max="32"
              value={patientData.elements}
              onChange={(e) => setPatientData({
                ...patientData,
                elements: e.target.value
              })}
            />
            <span className="elements-hint">(Máx. 32 dientes)</span>
          </div>
          <div className="elements-summary">
            <p>Elementos presentes: <strong>{dentalChart.filter(t => t.condition !== 'absent').length}</strong></p>
            <p>Elementos ausentes: <strong>{dentalChart.filter(t => t.condition === 'absent').length}</strong></p>
          </div>
        </div>
      </div>

      <div className="treatment-plan">
        <h4>Plan de Tratamiento</h4>
        <div className="plan-items">
          {dentalChart
            .filter(tooth => tooth.condition === 'caries' || tooth.condition === 'fracture')
            .map(tooth => (
              <div key={`plan-${tooth.number}`} className="plan-item">
                <div className="plan-info">
                  <span className="plan-tooth">Diente {tooth.number}</span>
                  <span className="plan-treatment">
                    {tooth.condition === 'caries' ? 'Tratamiento de caries' : 'Reparación de fractura'}
                  </span>
                </div>
                <span className="plan-status pending">Pendiente</span>
              </div>
            ))}
        </div>
        <button className="btn-outline">
          <Plus size={16} />
          <span>Agregar Tratamiento</span>
        </button>
        <div className="notes-actions">
          <button className="btn-primary">
            <Save size={16} />
            <span>Guardar Odontograma</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Odontograma;