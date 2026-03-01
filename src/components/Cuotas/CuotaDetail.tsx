// src/components/cuotas/CuotaDetail.tsx
import type { Cuota } from "../../types";
import { useState } from "react";

type Props = { 
  cuota: Cuota | undefined; 
  onDelete?: (id: string) => void; 
  onClose?: () => void; 
  onUpdate?: (id: string, data: Partial<Cuota>) => void;
};

const CuotaDetail = ({ cuota, onDelete, onClose, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Cuota>>({});

  if (!cuota) {
    return (
      <div className="card text-center text-sm text-gray-300">
        Seleccioná una cuota para ver su detalle.
      </div>
    );
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(cuota.id, formData);
    }
    setIsEditing(false);
  };

  const handleMarkPaid = () => {
    if (onUpdate) {
      onUpdate(cuota.id, { estado: "pagada" });
    }
    setIsEditing(false);
    if (onClose) onClose();
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">Detalle de cuota</h3>

      {!isEditing ? (
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">Mes:</span> {cuota.mes}</p>
          <p><span className="font-semibold">Monto:</span> ${cuota.monto}</p>
          <p><span className="font-semibold">Vencimiento:</span> {cuota.fechaVencimiento}</p>
          <p><span className="font-semibold">Estado:</span> {cuota.estado}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Mes"
            defaultValue={cuota.mes}
            onChange={(e) => setFormData({ ...formData, mes: e.target.value })}
            className="input"
          />
          <input
            type="number"
            placeholder="Monto"
            defaultValue={cuota.monto}
            onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
            className="input"
          />
          <input
            type="date"
            defaultValue={cuota.fechaVencimiento}
            onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
            className="input"
          />
          <select
            defaultValue={cuota.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            className="input"
          >
            <option value="pendiente">Pendiente</option>
            <option value="pagada">Pagada</option>
          </select>
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
        {cuota.estado === "pendiente" && (
          <button onClick={handleMarkPaid} className="btn btn-success">
            Marcar como pagada
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(cuota.id)} className="btn btn-danger">
            Eliminar cuota
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

export default CuotaDetail;
