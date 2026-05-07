import { useState } from "react";

import { useSesiones } from "../hooks/useSesiones";

import SesionList from "./SesionList";
import SesionDetail from "./SesionDetail";
import HistorialSesiones from "./HistorialSesiones";

const SesionesCliente = ({
  clienteId,
}: {
  clienteId: string;
}) => {
  const {
    sesiones,
    addSesion,
    updateSesion,
    deleteSesion,
  } = useSesiones(clienteId);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [formData, setFormData] = useState({
    fecha: "",
    duracionEstimada: "",
    bloques: "",
  });

  const selectedSesion = sesiones.find(
    (s) => s.id === selectedId
  );

  const handleCreate = async () => {
    await addSesion(formData);

    setIsModalOpen(false);

    setFormData({
      fecha: "",
      duracionEstimada: "",
      bloques: "",
    });
  };

  const sesionesPendientes = sesiones.filter(
    (s) => s.estado !== "completada"
  );

  const sesionesCompletadas = sesiones.filter(
    (s) => s.estado === "completada"
  );

  const handleClearHistorial = async () => {
    for (const sesion of sesionesCompletadas) {
      await deleteSesion(sesion.id);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary"
      >
        Asignar sesión
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="card w-full max-w-md">
            <h3 className="font-semibold mb-4 text-white">
              Nueva sesión
            </h3>

            <input
              type="date"
              value={formData.fecha}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fecha: e.target.value,
                })
              }
              className="input mb-3"
            />

            <input
              type="text"
              placeholder="Duración estimada"
              value={formData.duracionEstimada}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duracionEstimada: e.target.value,
                })
              }
              className="input mb-3"
            />

            <textarea
              placeholder="Bloques de trabajo"
              value={formData.bloques}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bloques: e.target.value,
                })
              }
              className="input mb-3"
            />

            <div className="flex space-x-2">
              <button
                onClick={handleCreate}
                className="btn btn-success"
              >
                Guardar
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-bold text-white mb-2">
          Sesiones pendientes
        </h3>

        <SesionList
          sesiones={sesionesPendientes}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
        />
      </div>

      <HistorialSesiones
        historial={sesionesCompletadas}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
        onClear={handleClearHistorial}
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