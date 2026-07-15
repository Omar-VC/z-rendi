import { useState } from "react";

import { registrarPago } from "../services/cuotas.service";

import type { Cuota } from "../types";

interface RegistrarPagoFormProps {
  cuota: Cuota;

  onGuardado: () => void;

  onCancelar: () => void;
}

function RegistrarPagoForm({
  cuota,
  onGuardado,
  onCancelar,
}: RegistrarPagoFormProps) {
  const [metodoPago, setMetodoPago] = useState<"efectivo" | "transferencia">(
    "efectivo",
  );

  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setGuardando(true);

    try {
      await registrarPago(cuota, metodoPago);

      onGuardado();
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="p-6 rounded-xl border border-white/10">
      <h2 className="text-xl font-bold mb-4">Registrar pago</h2>

      <p>Cuota: {cuota.mes}</p>

      <p>Monto: ${cuota.monto}</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <select
          value={metodoPago}
          onChange={(e) =>
            setMetodoPago(e.target.value as "efectivo" | "transferencia")
          }
          className="p-3 rounded-lg bg-white/10"
        >
          <option value="efectivo">Efectivo</option>

          <option value="transferencia">Transferencia</option>
        </select>

        <div className="flex gap-3">
          <button disabled={guardando} className="px-4 py-2 rounded-lg">
            Confirmar pago
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

export default RegistrarPagoForm;
