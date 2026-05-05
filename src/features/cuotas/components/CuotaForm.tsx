import { useState } from "react";
import type { Cuota } from "../types";

type Props = {
  onSave: (data: Omit<Cuota, "id" | "clienteId">) => void;
  onCancel: () => void;
};

const initialState: Omit<Cuota, "id" | "clienteId"> = {
  mes: "",
  fechaVencimiento: "",
  monto: 0,
  estado: "pendiente",
};

const CuotaForm = ({ onSave, onCancel }: Props) => {
  const [formData, setFormData] = useState(initialState);

  const handleSubmit = () => {
    if (!formData.mes || !formData.fechaVencimiento || formData.monto <= 0) {
      return;
    }

    onSave(formData);
    setFormData(initialState);
  };

  return (
    <div className="card">
      <h3 className="font-semibold mb-4">Nueva cuota</h3>

      <input
        type="text"
        placeholder="Mes (ej: Marzo)"
        value={formData.mes}
        onChange={(e) => setFormData({ ...formData, mes: e.target.value })}
        className="input mb-3"
      />

      <input
        type="date"
        value={formData.fechaVencimiento}
        onChange={(e) =>
          setFormData({ ...formData, fechaVencimiento: e.target.value })
        }
        className="input mb-3"
      />

      <input
        type="number"
        placeholder="Monto"
        value={formData.monto}
        onChange={(e) =>
          setFormData({ ...formData, monto: Number(e.target.value) })
        }
        className="input mb-3"
      />

      <select
        value={formData.estado}
        onChange={(e) =>
          setFormData({
            ...formData,
            estado: e.target.value as Cuota["estado"],
          })
        }
        className="input mb-4"
      >
        <option value="pendiente">Pendiente</option>
        <option value="pagada">Pagada</option>
      </select>

      <div className="flex space-x-2">
        <button onClick={handleSubmit} className="btn btn-success">
          Guardar
        </button>
        <button onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CuotaForm;