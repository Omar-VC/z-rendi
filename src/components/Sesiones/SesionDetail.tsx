// src/components/sesiones/SesionDetail.tsx
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
      <div className="card text-center text-sm text-gray-300">
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

  const handleMarkCompleted = () => {
    if (onUpdate) {
      onUpdate(sesion.id, { estado: "completada" });
    }
    setIsEditing(false);
    if (onClose) onClose();
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4 text-white">Detalle de sesión</h3>

      {!isEditing ? (
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">Fecha:</span> {sesion.fecha}</p>
          <p><span className="font-semibold">Duración estimada:</span> {sesion.duracionEstimada}</p>
          <p><span className="font-semibold">Bloques:</span> {sesion.bloques}</p>
          <p><span className="font-semibold">Estado:</span> {sesion.estado ?? "pendiente"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="date"
            defaultValue={sesion.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            className="input"
          />
          <input
            type="text"
            defaultValue={sesion.duracionEstimada}
            onChange={(e) => setFormData({ ...formData, duracionEstimada: e.target.value })}
            className="input"
          />
          <textarea
            defaultValue={sesion.bloques}
            onChange={(e) => setFormData({ ...formData, bloques: e.target.value })}
            className="input"
          />
        </div>
      )}

      {/* Botones de acción */}
      <div className="mt-4 flex flex-wrap gap-2">
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary">
            Editar
          </button>
        )}
        {isEditing && (
          <button onClick={handleSave} className="btn btn-success">
            Guardar cambios
          </button>
        )}
        {sesion.estado !== "completada" && (
          <button onClick={handleMarkCompleted} className="btn btn-success">
            Marcar como completada
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(sesion.id)} className="btn btn-danger">
            Eliminar sesión
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="btn btn-secondary">
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};

export default SesionDetail;

