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
      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">
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

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">Detalle de cuota</h3>

      {!isEditing ? (
        <div className="mt-3 space-y-2 text-sm text-slate-700">
          <p><span className="font-semibold">Monto:</span> ${cuota.monto}</p>
          <p><span className="font-semibold">Fecha de vencimiento:</span> {cuota.fechaVencimiento}</p>
          <p><span className="font-semibold">Estado:</span> {cuota.estado}</p>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <input
            type="number"
            placeholder="Monto"
            defaultValue={cuota.monto}
            onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
            className="border p-1 mb-2 w-full"
          />
          <input
            type="date"
            defaultValue={cuota.fechaVencimiento}
            onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
            className="border p-1 mb-2 w-full"
          />
          <select
            defaultValue={cuota.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            className="border p-1 mb-2 w-full"
          >
            <option value="pendiente">Pendiente</option>
            <option value="pagada">Pagada</option>
          </select>
        </div>
      )}

      {/* Botones de acción */}
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
            onClick={() => onDelete(cuota.id)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Eliminar cuota
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

export default CuotaDetail;
