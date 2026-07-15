import { useState } from "react";

import type { Cuota } from "../types";
import { editarCuota } from "../services/cuotas.service";

interface EditarCuotaFormProps {
  cuota: Cuota;
  onGuardado: () => void;
  onCancelar: () => void;
}

function EditarCuotaForm({
  cuota,
  onGuardado,
  onCancelar,
}: EditarCuotaFormProps) {
  const [form, setForm] = useState({
    monto: cuota.monto.toString(),

    fechaVencimiento: cuota.fechaVencimiento,

    fechaPago: cuota.fechaPago ?? "",

    estado: cuota.estado,

    metodoPago: cuota.metodoPago ?? "efectivo",
  });

  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setGuardando(true);

    try {
      await editarCuota(cuota.id, {
        monto: Number(form.monto),

        fechaVencimiento: form.fechaVencimiento,

        fechaPago: form.fechaPago || undefined,

        estado: form.estado,

        metodoPago: form.metodoPago as "efectivo" | "transferencia",
      });

      onGuardado();
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="p-6 rounded-xl border border-white/10">
      <h2 className="text-xl font-bold mb-4">Editar cuota</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold">Monto de la cuota</label>

          <input
            type="number"
            value={form.monto}
            onChange={(e) =>
              setForm({
                ...form,
                monto: e.target.value,
              })
            }
            className="p-3 rounded-lg bg-white/10 text-white"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Fecha de vencimiento
          </label>

          <p className="text-sm opacity-70 mb-2">
            Día límite para pagar la cuota.
          </p>

          <input
            type="date"
            value={form.fechaVencimiento}
            onChange={(e) =>
              setForm({
                ...form,
                fechaVencimiento: e.target.value,
              })
            }
            className="p-3 rounded-lg bg-white/10 text-white"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Fecha de pago</label>

          <p className="text-sm opacity-70 mb-2">
            Día en que el cliente realizó el pago.
          </p>

          <input
            type="date"
            value={form.fechaPago}
            onChange={(e) =>
              setForm({
                ...form,
                fechaPago: e.target.value,
              })
            }
            className="p-3 rounded-lg bg-white/10 text-white"
          />
        </div>

        <select
          value={form.estado}
          onChange={(e) =>
            setForm({
              ...form,
              estado: e.target.value as "pendiente" | "pagada",
            })
          }
          className="p-3 rounded-lg bg-white/10 text-white"
        >
          <option value="pendiente">Pendiente</option>

          <option value="pagada">Pagada</option>
        </select>

        <select
          value={form.metodoPago}
          onChange={(e) =>
            setForm({
              ...form,
              metodoPago: e.target.value as "efectivo" | "transferencia",
            })
          }
          className="p-3 rounded-lg bg-white/10 text-white"
        >
          <option value="efectivo">Efectivo</option>

          <option value="transferencia">Transferencia</option>
        </select>

        <div className="flex gap-3">
          <button disabled={guardando} className="px-4 py-2 rounded-lg">
            Guardar cambios
          </button>

          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditarCuotaForm;
