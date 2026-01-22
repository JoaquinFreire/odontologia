import { useState } from "react";
import "../styles/pruebajoa.css";
import { Diente } from "./ZonaDiente";
import { ESTADOS } from "./EstadosOdontograma";

// genera dientes 11 a 28
const crearDientes = () => {
  const dientes = [];
  for (let i = 11; i <= 28; i++) {
    dientes.push({
      id: i,
      zonas: { v: null, l: null, m: null, d: null, o: null },
    });
  }
  return dientes;
};

export default function Pruebajoa() {
  const [odontograma, setOdontograma] = useState(crearDientes);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("caries");

  const aplicarEstado = (dienteId, zona) => {
    setOdontograma((prev) =>
      prev.map((d) =>
        d.id === dienteId
          ? {
              ...d,
              zonas: {
                ...d.zonas,
                [zona]: estadoSeleccionado,
              },
            }
          : d
      )
    );
  };

  return (
    <div>
      <h2>Odontograma (cuadrados)</h2>

      {/* Selector de estados */}
      <div className="selector">
        {Object.keys(ESTADOS).map((estado) => (
          <button
            key={estado}
            onClick={() => setEstadoSeleccionado(estado)}
            className={estadoSeleccionado === estado ? "activo" : ""}
          >
            {estado}
          </button>
        ))}
      </div>

      {/* Odontograma */}
      <div className="odontograma">
        {odontograma.map((diente) => (
          <Diente
            key={diente.id}
            diente={diente}
            onZonaClick={aplicarEstado}
          />
        ))}
      </div>

      {/* Debug (lo podés borrar después) */}
      <pre>{JSON.stringify(odontograma, null, 2)}</pre>
    </div>
  );
}
