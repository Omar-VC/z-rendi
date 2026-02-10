import React from "react";
import SesionList from "../components/Sesiones/SesionList";

const SesionesPage: React.FC = () => {
  const sesiones = [
    { id: "1", tipo: "fuerza", fecha: "2026-02-10", atleta: "Juan Pérez", observaciones: "Buen rendimiento" },
    { id: "2", tipo: "resistencia", fecha: "2026-02-09", atleta: "María Gómez" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Sesiones</h2>
      <SesionList sesiones={sesiones} />
    </div>
  );
};

export default SesionesPage;
