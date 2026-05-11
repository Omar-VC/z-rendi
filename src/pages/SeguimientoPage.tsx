// src/pages/SeguimientoPage.tsx
import React, { useState } from "react";
import { useSeguimiento } from "../features/seguimiento/hooks/useSeguimiento";
import PlanillaCard from "../features/seguimiento/components/PlanillaCard";

const SeguimientoPage = () => {
  const { planillas, crearPlanilla, eliminarPlanilla, loading } = useSeguimiento();
  const [nombreNueva, setNombreNueva] = useState("");

  const handleCrear = () => {
    if (!nombreNueva.trim()) {
      alert("Ingresá un nombre para la planilla");
      return;
    }

    crearPlanilla(nombreNueva);
    setNombreNueva("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Seguimiento</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nombre de la planilla"
          value={nombreNueva}
          onChange={(e) => setNombreNueva(e.target.value)}
          className="input"
          disabled={loading}
        />
        <button
          type="button"
          onClick={handleCrear}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear planilla"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {planillas.map((p) => (
          <PlanillaCard
            key={p.id}
            planillaId={p.id}
            nombre={p.nombre}
            onDeletePlanilla={eliminarPlanilla}
          />
        ))}
      </div>
    </div>
  );
};

export default SeguimientoPage;