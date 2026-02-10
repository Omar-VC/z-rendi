import React from "react";

type Cuota = {
  id: string;
  atleta: string;
  estado: "pagado" | "pendiente";
  fechaVencimiento: string;
};

const CuotaList: React.FC<{ cuotas: Cuota[] }> = ({ cuotas }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de cuotas</h2>
      <ul className="space-y-2">
        {cuotas.map((cuota) => (
          <li key={cuota.id} className="border p-2 rounded shadow">
            <p>Cliente: {cuota.atleta}</p>
            <p>Estado: {cuota.estado}</p>
            <p>Vencimiento: {cuota.fechaVencimiento}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CuotaList;
