import type { Sesion } from "../../types";
import { useState } from "react";

type Props = {
  sesion: Sesion | undefined;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, data: Partial<Sesion>) => void;
  onClose?: () => void;
};

const SesionDetail = ({ sesion, onDelete, onUpdate, onClose }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Sesion>>({});

  if (!sesion) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">
        Seleccioná una sesión para ver su detalle.
      </div>
    );
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(sesion.id, formData);
    }
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">Detalle de sesión</h3>

      {!isEditing ? (
        <div className="mt-3 space-y-2 text-sm text-slate-700">
          <p><span className="font-semibold">Fecha:</span> {sesion.fecha}</p>
          <p><span className="font-semibold">Duración estimada:</span> {sesion.duracionEstimada}</p>
          <p><span className="font-semibold">Bloques:</span> {sesion.bloques}</p>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <input
            type="date"
            defaultValue={sesion.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            className="border p-1 mb-2 w-full"
          />
          <input
            type="text"
            defaultValue={sesion.duracionEstimada}
            onChange={(e) => setFormData({ ...formData, duracionEstimada: e.target.value })}
            className="border p-1 mb-2 w-full"
          />
          <textarea
            defaultValue={sesion.bloques}
            onChange={(e) => setFormData({ ...formData, bloques: e.target.value })}
            className="border p-1 mb-2 w-full"
          />
        </div>
      )}

      <div className="mt-4 flex space-x-2">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Editar
          </button>
        )}
        {isEditing && (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Guardar cambios
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(sesion.id)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Eliminar sesión
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};

export default SesionDetail;
