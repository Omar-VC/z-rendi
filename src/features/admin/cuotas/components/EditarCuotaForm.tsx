import { useState } from "react";

import type { Cuota } from "../types";
import { editarCuota } from "../services/cuotas.service";

import {
  Card,
  Input,
  Label,
  Select,
  Button,
} from "../../../../shared/ui";

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

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {

    e.preventDefault();

    setGuardando(true);

    try {

      await editarCuota(cuota.id, {
        monto: Number(form.monto),
        fechaVencimiento: form.fechaVencimiento,
        fechaPago: form.fechaPago || undefined,
        estado: form.estado,
        metodoPago: form.metodoPago as
          | "efectivo"
          | "transferencia",
      });

      onGuardado();

    } finally {

      setGuardando(false);

    }

  };

  return (

    <Card>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>

          <h2 className="text-xl font-semibold">
            Editar cuota
          </h2>

          <p className="text-sm text-muted mt-1">
            {cuota.mes} {cuota.anio}
          </p>

        </div>


        <div>

          <Label>
            Monto
          </Label>

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

          <Label>
            Fecha de vencimiento
          </Label>

          <Input
            type="date"
            value={form.fechaVencimiento}
            onChange={(e) =>
              setForm({
                ...form,
                fechaVencimiento:
                  e.target.value,
              })
            }
          />

        </div>


        <div>

          <Label>
            Fecha de pago
          </Label>

          <Input
            type="date"
            value={form.fechaPago}
            onChange={(e) =>
              setForm({
                ...form,
                fechaPago:
                  e.target.value,
              })
            }
          />

        </div>


        <div>

          <Label>
            Estado
          </Label>

          <Select
            value={form.estado}
            onChange={(e) =>
              setForm({
                ...form,
                estado:
                  e.target.value as
                    | "pendiente"
                    | "pagada",
              })
            }
          >

            <option value="pendiente">
              Pendiente
            </option>

            <option value="pagada">
              Pagada
            </option>

          </Select>

        </div>


        <div>

          <Label>
            Método de pago
          </Label>

          <Select
            value={form.metodoPago}
            onChange={(e) =>
              setForm({
                ...form,
                metodoPago:
                  e.target.value as
                    | "efectivo"
                    | "transferencia",
              })
            }
          >

            <option value="efectivo">
              Efectivo
            </option>

            <option value="transferencia">
              Transferencia
            </option>

          </Select>

        </div>


        <div className="flex justify-end gap-3 pt-2">

          <Button
            variant="secondary"
            type="button"
            onClick={onCancelar}
          >
            Cancelar
          </Button>

          <Button
            variant="accent"
            type="submit"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Guardar cambios"}
          </Button>

        </div>

      </form>

    </Card>

  );

}
