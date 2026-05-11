import { useState } from "react";
import { useCuotas } from "../hooks/useCuotas";
import type { Cuota } from "../types";

import CuotaList from "./CuotaList";
import CuotaDetail from "./CuotaDetail";
import CuotaForm from "./CuotaForm";
import HistorialCuotas from "./HistorialCuotas";

const CuotasCliente = ({
  clienteId,
  adminMode = false,
}: {
  clienteId: string;
  adminMode?: boolean;
}) => {
  const { cuotas, addCuota, updateCuota, deleteCuota } = useCuotas(clienteId);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedCuota = cuotas.find((c) => c.id === selectedId);

  const handleCreate = async (data: Omit<Cuota, "id" | "clienteId">) => {
    await addCuota(data);
    setIsModalOpen(false);
  };

  const cuotasPendientes = cuotas.filter((c) => c.estado === "pendiente");
  const cuotasPagadas = cuotas.filter((c) => c.estado === "pagada");

  const handleClearHistorial = async () => {
    await Promise.all(cuotasPagadas.map((c) => deleteCuota(c.id)));
  };

  return (
    <div className="space-y-6">
      {adminMode && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          Asignar cuota
        </button>
      )}  

      {isModalOpen && (
        <CuotaForm
          onSave={handleCreate}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

      <div>
        <h3 className="font-bold text-white mb-2">Cuotas pendientes</h3>
        <CuotaList
          cuotas={cuotasPendientes}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      <CuotaDetail
        cuota={selectedCuota}
        onDelete={deleteCuota}
        onUpdate={updateCuota}
        onClose={() => setSelectedId(null)}
        showActions={adminMode}
      />

      <HistorialCuotas
        historial={cuotasPagadas}
        onClear={handleClearHistorial}
        showActions={adminMode}
      />
    </div>
  );
};

export default CuotasCliente;