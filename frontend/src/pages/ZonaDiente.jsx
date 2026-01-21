import React from "react";
import { ESTADOS } from "./estadosOdontograma";

export function Zona({ estado, onClick }) {
  const { color, simbolo } = ESTADOS[estado] || ESTADOS.sano;

  return (
    <div
      className="zona"
      onClick={onClick}
      style={{ backgroundColor: color }}
    >
      {simbolo && <span className="simbolo">{simbolo}</span>}
    </div>
  );
}

export function Diente({ diente, onZonaClick }) {
  const { id, zonas } = diente;

  return (
    <div className="diente">
      <div className="fila">
        <Zona estado={zonas.v} onClick={() => onZonaClick(id, "v")} />
      </div>

      <div className="fila">
        <Zona estado={zonas.m} onClick={() => onZonaClick(id, "m")} />
        <Zona estado={zonas.o} onClick={() => onZonaClick(id, "o")} />
        <Zona estado={zonas.d} onClick={() => onZonaClick(id, "d")} />
      </div>

      <div className="fila">
        <Zona estado={zonas.l} onClick={() => onZonaClick(id, "l")} />
      </div>

      <small>{id}</small>
    </div>
  );
}
