import React, { useState } from 'react';
import '../../styles/Odontograma.css';

// 1. CONFIGURACIÓN Y CONSTANTES (Fuera para que no se re-creen)
const CONSTANTS = {
  TOOTH_SIZE: 40,
  CELL_SIZE: 40 / 3,
  GAP: 12, 
  ROW_GAP: 80, 
  COLORS: {
    RED: '#d32f2f',
    BLUE: '#1976d2',
    BLACK: '#333333',
    WHITE: '#ffffff',
    HOVER: 'rgba(0,0,0,0.08)'
  }
};

const teethUpper = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const teethLower = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const facesMap = {
  top: { x: 1, y: 0 },
  left: { x: 0, y: 1 },
  center: { x: 1, y: 1 },
  right: { x: 2, y: 1 },
  bottom: { x: 1, y: 2 }
};

// 2. COMPONENTES AUXILIARES (Definidos fuera del render principal)
const ToolGroup = ({ title, tools, selectedTool, onSelect }) => (
  <div className="tool-group">
    <h4>{title}</h4>
    <div className="button-row">
      {tools.map(t => (
        <button 
          key={t.id} 
          className={`tool-btn ${selectedTool === t.id ? 'active' : ''} ${t.className || ''}`}
          onClick={() => onSelect(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  </div>
);

const SingleTooth = ({ id, x, y, data, onInteraction, isSelected }) => {
  const [hover, setHover] = useState(false);
  const { faces = {}, attributes = {} } = data;
  const getColor = (state) => state === 'red' ? CONSTANTS.COLORS.RED : CONSTANTS.COLORS.BLUE;

  return (
    <g 
      transform={`translate(${x}, ${y})`} 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: 'pointer' }}
      onClick={(e) => onInteraction(e, id)}
    >
      <rect 
        x={-2} y={-2} 
        width={CONSTANTS.TOOTH_SIZE + 4} height={CONSTANTS.TOOTH_SIZE + 4}
        fill={isSelected ? 'rgba(255, 235, 59, 0.4)' : (hover ? CONSTANTS.COLORS.HOVER : 'transparent')}
        rx="4"
      />

      {Object.entries(facesMap).map(([face, coords]) => (
        <rect
          key={face}
          id={`face-${id}-${face}`}
          x={coords.x * CONSTANTS.CELL_SIZE}
          y={coords.y * CONSTANTS.CELL_SIZE}
          width={CONSTANTS.CELL_SIZE}
          height={CONSTANTS.CELL_SIZE}
          stroke={CONSTANTS.COLORS.BLACK}
          strokeWidth="0.5"
          fill={faces[face] ? getColor(faces[face]) : CONSTANTS.COLORS.WHITE}
          pointerEvents="all"
        />
      ))}

      <g pointerEvents="none">
        {attributes.crown && (
          <circle 
            cx={CONSTANTS.TOOTH_SIZE / 2} cy={CONSTANTS.TOOTH_SIZE / 2} 
            r={CONSTANTS.TOOTH_SIZE / 2 + 3}
            fill="none" stroke={getColor(attributes.crown)} strokeWidth="2.5"
          />
        )}
        {attributes.missing && (
          <g stroke={getColor(attributes.missing)} strokeWidth="3">
             <line x1={0} y1={0} x2={CONSTANTS.TOOTH_SIZE} y2={CONSTANTS.TOOTH_SIZE} />
             <line x1={CONSTANTS.TOOTH_SIZE} y1={0} x2={0} y2={CONSTANTS.TOOTH_SIZE} />
          </g>
        )}
        {attributes.implant && (
          <text x={CONSTANTS.TOOTH_SIZE / 2} y={CONSTANTS.TOOTH_SIZE + 18} textAnchor="middle" fill={getColor(attributes.implant)} fontWeight="bold" fontSize="16">I</text>
        )}
        {attributes.endodontics && (
          <text x={CONSTANTS.TOOTH_SIZE / 2} y={-8} textAnchor="middle" fill={getColor(attributes.endodontics)} fontWeight="bold" fontSize="14">Tc</text>
        )}
      </g>

      <text x={CONSTANTS.TOOTH_SIZE / 2} y={CONSTANTS.TOOTH_SIZE + 32} textAnchor="middle" fontSize="11" fill="#444" fontWeight="bold" pointerEvents="none">
        {id}
      </text>
    </g>
  );
};

// 3. COMPONENTE PRINCIPAL
const Odontograma = () => {
  const [teethState, setTeethState] = useState({});
  const [connections, setConnections] = useState([]);
  const [selectedTool, setSelectedTool] = useState('cursor');
  const [interactionStep, setInteractionStep] = useState(null);

  const getCoords = (id) => {
    const isUpper = teethUpper.includes(id);
    const index = isUpper ? teethUpper.indexOf(id) : teethLower.indexOf(id);
    // Margen izquierdo aumentado (60) para que el 18 no esté pegado al borde
    const x = 60 + index * (CONSTANTS.TOOTH_SIZE + CONSTANTS.GAP);
    const y = isUpper ? 60 : 60 + CONSTANTS.TOOTH_SIZE + CONSTANTS.ROW_GAP;
    return { x, y, isUpper };
  };

  const handleToolSelect = (toolId) => {
    setSelectedTool(toolId);
    setInteractionStep(null);
  };

  const handleToothInteraction = (e, id) => {
    const targetId = e.target.id;
    
    // Caras
    if (selectedTool.startsWith('face_') && targetId.startsWith('face-')) {
      const face = targetId.split('-')[2];
      const color = selectedTool.split('_')[1];
      setTeethState(prev => {
        const tooth = prev[id] || { faces: {}, attributes: {} };
        const newFaceState = tooth.faces[face] === color ? null : color;
        return { ...prev, [id]: { ...tooth, faces: { ...tooth.faces, [face]: newFaceState } } };
      });
      return;
    }

    // Atributos
    const toolPrefix = selectedTool.split('_')[0];
    const attrMap = { crown: 'crown', missing: 'missing', tc: 'endodontics', imp: 'implant' };
    if (attrMap[toolPrefix]) {
      const color = selectedTool.split('_')[1];
      const attrKey = attrMap[toolPrefix];
      setTeethState(prev => {
        const tooth = prev[id] || { faces: {}, attributes: {} };
        const newVal = tooth.attributes[attrKey] === color ? null : color;
        return { ...prev, [id]: { ...tooth, attributes: { ...tooth.attributes, [attrKey]: newVal } } };
      });
      return;
    }

    // Puentes
    if (selectedTool.startsWith('bridge')) {
      if (!interactionStep) {
        setInteractionStep({ startId: id });
      } else {
        if (interactionStep.startId !== id) {
          const parts = selectedTool.split('_');
          const type = parts[1]; // fixed o removable
          const color = parts[2]; // red o blue
          setConnections(prev => [...prev, { start: interactionStep.startId, end: id, type, color }]);
          setInteractionStep(null);
        }
      }
    }
  };

  return (
    <div className="odontograma-app">
      <div className="controls-panel">
        <ToolGroup title="Básico" tools={[{id: 'cursor', label: 'Cursor'}]} selectedTool={selectedTool} onSelect={handleToolSelect} />
        <ToolGroup title="Caras" tools={[{id: 'face_red', label: '●', className: 'text-red'}, {id: 'face_blue', label: '●', className: 'text-blue'}]} selectedTool={selectedTool} onSelect={handleToolSelect} />
        <ToolGroup title="Corona" tools={[{id: 'crown_red', label: '○', className: 'text-red'}, {id: 'crown_blue', label: '○', className: 'text-blue'}]} selectedTool={selectedTool} onSelect={handleToolSelect} />
        <ToolGroup title="Extracción" tools={[{id: 'missing_red', label: 'X', className: 'text-red'}, {id: 'missing_blue', label: 'X', className: 'text-blue'}]} selectedTool={selectedTool} onSelect={handleToolSelect} />
        <ToolGroup title="Endodoncia" tools={[{id: 'tc_red', label: 'Tc', className: 'text-red'}, {id: 'tc_blue', label: 'Tc', className: 'text-blue'}]} selectedTool={selectedTool} onSelect={handleToolSelect} />
        <ToolGroup title="Implante" tools={[{id: 'imp_red', label: 'I', className: 'text-red'}, {id: 'imp_blue', label: 'I', className: 'text-blue'}]} selectedTool={selectedTool} onSelect={handleToolSelect} />
        <ToolGroup title="Fija" tools={[{id: 'bridge_fixed_red', label: '⟷', className: 'text-red'}, {id: 'bridge_fixed_blue', label: '⟷', className: 'text-blue'}]} selectedTool={selectedTool} onSelect={handleToolSelect} />
        <ToolGroup title="Removible" tools={[{id: 'bridge_removable_red', label: '[--]', className: 'text-red'}, {id: 'bridge_removable_blue', label: '[--]', className: 'text-blue'}]} selectedTool={selectedTool} onSelect={handleToolSelect} />
      </div>

      <div className="svg-container">
        {/* Ancho 1000 para asegurar que el 28 y 38 no se corten */}
        <svg viewBox="0 0 1000 320" className="odontograma-svg">
          {connections.map((conn, i) => {
            const start = getCoords(conn.start);
            const end = getCoords(conn.end);
            const x1 = start.x + CONSTANTS.TOOTH_SIZE / 2;
            const x2 = end.x + CONSTANTS.TOOTH_SIZE / 2;
            const yBase = start.y + (start.isUpper ? 0 : CONSTANTS.TOOTH_SIZE);
            const yLine = yBase + (start.isUpper ? -35 : 35);
            const colorHex = conn.color === 'red' ? CONSTANTS.COLORS.RED : CONSTANTS.COLORS.BLUE;
            return (
              <g key={i} onClick={() => setConnections(prev => prev.filter((_, idx) => idx !== i))}>
                {conn.type === 'fixed' ? (
                  <g stroke={colorHex} strokeWidth="3">
                    <line x1={x1} y1={yLine} x2={x2} y2={yLine} />
                    <line x1={x1} y1={yLine} x2={x1} y2={yBase} />
                    <line x1={x2} y1={yLine} x2={x2} y2={yBase} />
                  </g>
                ) : (
                  <path d={`M ${x1} ${yBase} L ${x1} ${yLine} L ${x2} ${yLine} L ${x2} ${yBase}`} stroke={colorHex} strokeWidth="2" fill="none" strokeDasharray="5,3" />
                )}
                <circle cx={(x1+x2)/2} cy={yLine} r="7" fill="#444" style={{cursor:'pointer'}} />
                <text x={(x1+x2)/2} y={yLine+3} textAnchor="middle" fill="white" fontSize="9" pointerEvents="none">x</text>
              </g>
            );
          })}
          {teethUpper.map(id => <SingleTooth key={id} id={id} {...getCoords(id)} data={teethState[id] || {}} isSelected={interactionStep?.startId === id} onInteraction={handleToothInteraction} />)}
          <line x1="40" y1="150" x2="960" y2="150" stroke="#ddd" strokeWidth="1" />
          {teethLower.map(id => <SingleTooth key={id} id={id} {...getCoords(id)} data={teethState[id] || {}} isSelected={interactionStep?.startId === id} onInteraction={handleToothInteraction} />)}
        </svg>
      </div>

      <div className="json-output">
        <pre>{JSON.stringify({ teethState, connections }, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Odontograma;