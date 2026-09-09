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
          <h2 className="text-xl font-bold text-text">
            Registrar pago
          </h2>
          <p className="text-sm text-muted mt-1 capitalize">
            Cuota de {cuota.mes} {cuota.anio}
          </p>
        </div>

        <div className="rounded-card border border-border bg-surfaceSoft/30 p-4">
          <p className="text-xs text-muted font-medium uppercase tracking-wider">
            Monto a registrar
          </p>
          <p className="mt-1 text-3xl font-bold font-mono text-primary">
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
            disabled={guardando}
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