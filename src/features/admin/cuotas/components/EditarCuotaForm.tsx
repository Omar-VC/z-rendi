import { useState } from "react";

import type { Cuota } from "../types";
import { editarCuota } from "../services/cuotas.service";

import { Card, Input, Label, Select, Button } from "../../../../shared/ui";

interface EditarCuotaFormProps {
  cuota: Cuota;
  onGuardado: () => void;
  onCancelar: () => void;
}

export default function EditarCuotaForm({
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
      const datos = {
        monto: Number(form.monto),
        fechaVencimiento: form.fechaVencimiento,
        estado: form.estado,
        metodoPago: form.metodoPago as "efectivo" | "transferencia",
        ...(form.estado === "pagada" && form.fechaPago
          ? { fechaPago: form.fechaPago }
          : {}),
      };

      await editarCuota(cuota.id, datos);
      onGuardado();
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-text">Editar cuota</h2>
          <p className="text-sm text-muted mt-1 capitalize">
            Cuota de {cuota.mes} {cuota.anio}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Monto</Label>
            <Input
              type="number"
              value={form.monto}
              onChange={(e) =>
                setForm({
                  ...form,
                  monto: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Fecha de vencimiento</Label>
            <Input
              type="date"
              value={form.fechaVencimiento}
              onChange={(e) =>
                setForm({
                  ...form,
                  fechaVencimiento: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Estado</Label>
            <Select
              value={form.estado}
              onChange={(e) =>
                setForm({
                  ...form,
                  estado: e.target.value as "pendiente" | "pagada",
                })
              }
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagada">Pagada</option>
            </Select>
          </div>

          <div>
            <Label>Método de pago</Label>
            <Select
              value={form.metodoPago}
              onChange={(e) =>
                setForm({
                  ...form,
                  metodoPago: e.target.value as "efectivo" | "transferencia",
                })
              }
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
            </Select>
          </div>
        </div>

        {form.estado === "pagada" && (
          <div>
            <Label>Fecha de pago</Label>
            <Input
              type="date"
              value={form.fechaPago}
              onChange={(e) =>
                setForm({
                  ...form,
                  fechaPago: e.target.value,
                })
              }
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </Button>

          <Button variant="accent" type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </Card>
  );
}