import { useState } from "react";
import { useSesiones } from "../../hooks/useSesiones";
import SesionList from "./SesionList";
import SesionDetail from "./SesionDetail";

const SesionesCliente = ({ clienteId }: { clienteId: string }) => {
  const { sesiones, addSesion, updateSesion, deleteSesion } = useSesiones(clienteId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fecha: "",
    duracionEstimada: "",
    bloques: "",
  });

  const selectedSesion = sesiones.find((s) => s.id === selectedId);

  const handleCreate = async () => {
    await addSesion(formData);
    setIsModalOpen(false);
    setFormData({ fecha: "", duracionEstimada: "", bloques: "" });
  };

  return (
    <div className="space-y-4">
      {/* Botón para abrir formulario */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Asignar sesión
      </button>

      {/* Formulario modal */}
      {isModalOpen && (
        <div className="border p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Nueva sesión</h3>
          <input
            type="date"
            placeholder="Fecha"
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            className="border p-1 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Duración estimada"
            value={formData.duracionEstimada}
            onChange={(e) => setFormData({ ...formData, duracionEstimada: e.target.value })}
            className="border p-1 mb-2 w-full"
          />
          <textarea
            placeholder="Bloques de trabajo"
            value={formData.bloques}
            onChange={(e) => setFormData({ ...formData, bloques: e.target.value })}
            className="border p-1 mb-2 w-full"
          />

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

      <SesionList
        sesiones={sesiones}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
      />
      <SesionDetail
        sesion={selectedSesion}
        onDelete={deleteSesion}
        onUpdate={updateSesion}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
};

export default SesionesCliente;
