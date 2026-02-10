import React from "react";
import CuotaList from "../components/Cuotas/CuotaList";

const CuotasPage: React.FC = () => {
  const cuotas = [
    { id: "1", atleta: "Juan Pérez", estado: "pendiente", fechaVencimiento: "2026-02-15" },
    { id: "2", atleta: "María Gómez", estado: "pagado", fechaVencimiento: "2026-02-01" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Cuotas</h2>
      <CuotaList cuotas={cuotas} />
    </div>
  );
};

export default CuotasPage;
