import { useState } from "react";
import { useCuotas } from "../../hooks/useCuotas";
import CuotaList from "./CuotaList";
import CuotaDetail from "./CuotaDetail";

const CuotasCliente = ({ clienteId }: { clienteId: string }) => {
  const { cuotas, addCuota, updateCuota, deleteCuota } = useCuotas(clienteId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    monto: 0,
    fechaVencimiento: "",
    estado: "pendiente",
  });

  const selectedCuota = cuotas.find((c) => c.id === selectedId);

  const handleCreate = async () => {
    await addCuota(formData);
    setIsModalOpen(false);
    setFormData({ monto: 0, fechaVencimiento: "", estado: "pendiente" });
  };

  return (
    <div className="space-y-4">
      {/* Botón para abrir formulario */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Asignar cuota
      </button>

      {/* Formulario modal */}
      {isModalOpen && (
        <div className="border p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Nueva cuota</h3>
          <input
            type="number"
            placeholder="Monto"
            value={formData.monto}
            onChange={(e) =>
              setFormData({ ...formData, monto: Number(e.target.value) })
            }
            className="border p-1 mb-2 w-full"
          />
          <input
            type="date"
            placeholder="Fecha de vencimiento"
            value={formData.fechaVencimiento}
            onChange={(e) =>
              setFormData({ ...formData, fechaVencimiento: e.target.value })
            }
            className="border p-1 mb-2 w-full"
          />
          <select
            value={formData.estado}
            onChange={(e) =>
              setFormData({ ...formData, estado: e.target.value })
            }
            className="border p-1 mb-2 w-full"
          >
            <option value="pendiente">Pendiente</option>
            <option value="pagada">Pagada</option>
          </select>

          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-3 py-1 rounded mr-2"
          >
            Guardar
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            Cancelar
          </button>
        </div>
      )}

      <CuotaList
        cuotas={cuotas}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
      />
      <CuotaDetail cuota={selectedCuota} 
      onDelete={deleteCuota} 
      onUpdate={updateCuota} 
      onClose={() => setSelectedId(null)}
      />
    </div>
  );
};

export default CuotasCliente;
