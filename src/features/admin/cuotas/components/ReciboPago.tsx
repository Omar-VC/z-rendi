import type { Cuota } from "../types";

import {
  Card,
  Button,
  Badge,
} from "../../../../shared/ui";

interface ReciboPagoProps {
  cuota: Cuota;
  clienteNombre: string;
  onCerrar: () => void;
}

export default function ReciboPago({
  cuota,
  clienteNombre,
  onCerrar,
}: ReciboPagoProps) {
  const compartirWhatsApp = () => {
    const mensaje = `
RECIBO DE PAGO - Z-RENDI

Cliente: ${clienteNombre}
Período: ${cuota.mes}${cuota.anio ? ` ${cuota.anio}` : ""}
Monto: $${cuota.monto}
Método: ${cuota.metodoPago ?? "-"}
Fecha de pago: ${cuota.fechaPago ?? "-"}
    `.trim();

    const url = `https://wa.me/?text=${encodeURIComponent(
      mensaje,
    )}`;

    window.open(url, "_blank");
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-text">
            Recibo de pago
          </h2>
          <p className="text-sm text-muted mt-1">
            Comprobante oficial del pago registrado.
          </p>
        </div>

        <div className="rounded-card border border-border bg-surfaceSoft/20 p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-border/40">
            <span className="text-sm text-muted">Cliente</span>
            <span className="font-semibold text-text">
              {clienteNombre}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-border/40">
            <span className="text-sm text-muted">Período</span>
            <Badge variant="info">
              {cuota.mes} {cuota.anio}
            </Badge>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-border/40">
            <span className="text-sm text-muted">Monto</span>
            <span className="text-2xl font-bold font-mono text-primary">
              ${cuota.monto}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-border/40">
            <span className="text-sm text-muted">Método de pago</span>
            <Badge variant="success" className="capitalize">
              {cuota.metodoPago ?? "-"}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Fecha de pago</span>
            <span className="font-mono text-sm text-text">
              {cuota.fechaPago ?? "-"}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={onCerrar}
          >
            Cerrar
          </Button>

          <Button
            variant="accent"
            onClick={compartirWhatsApp}
          >
            Compartir por WhatsApp
          </Button>
        </div>
      </div>
    </Card>
  );
}
