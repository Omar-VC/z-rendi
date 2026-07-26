import { useState } from "react";

import { registrarPago } from "../services/cuotas.service";
import type { Cuota } from "../types";

import {
  Card,
  Label,
  Select,
  Button,
} from "../../../../shared/ui";

interface RegistrarPagoFormProps {
  cuota: Cuota;
  onGuardado: () => void;
  onCancelar: () => void;
}

export default function RegistrarPagoForm({
  cuota,
  onGuardado,
  onCancelar,
}: RegistrarPagoFormProps) {

  const [metodoPago, setMetodoPago] = useState<
    "efectivo" | "transferencia"
  >("efectivo");

  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {

    e.preventDefault();

    setGuardando(true);

    try {

      await registrarPago(
        cuota,
        metodoPago,
      );

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
            Registrar pago
          </h2>

          <p className="text-sm text-muted mt-1">
            {cuota.mes} {cuota.anio}
          </p>

        </div>


        <div className="rounded-xl border border-border bg-surface p-4">

          <p className="text-sm text-muted">
            Monto a registrar
          </p>

          <p className="mt-1 text-3xl font-bold text-accent">
            ${cuota.monto}
          </p>

        </div>


        <div>

          <Label>
            Método de pago
          </Label>

          <Select
            value={metodoPago}
            onChange={(e) =>
              setMetodoPago(
                e.target.value as
                  | "efectivo"
                  | "transferencia",
              )
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
              ? "Registrando..."
              : "Confirmar pago"}
          </Button>

        </div>

      </form>

    </Card>

  );

}
