import React from "react";

type Sesion = {
  id: string;
  tipo: "fuerza" | "resistencia" | "tecnica" | "recuperacion";
  fecha: string;
  atleta: string;
  observaciones?: string;
};

const SesionList: React.FC<{ sesiones: Sesion[] }> = ({ sesiones }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sesiones de entrenamiento</h2>
      <ul className="space-y-2">
        {sesiones.map((sesion) => (
          <li key={sesion.id} className="border p-2 rounded shadow">
            <p>Tipo: {sesion.tipo}</p>
            <p>Fecha: {sesion.fecha}</p>
            <p>Atleta: {sesion.atleta}</p>
            {sesion.observaciones && <p>Notas: {sesion.observaciones}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SesionList;
