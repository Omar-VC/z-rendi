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
RECIBO DE PAGO

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

    <Card className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Recibo de pago
        </h2>

        <p className="text-muted mt-1">
          Comprobante del pago registrado.
        </p>

      </div>


      <div className="space-y-4">

        <div className="flex justify-between items-center">

          <span className="text-muted">
            Cliente
          </span>

          <span className="font-semibold">
            {clienteNombre}
          </span>

        </div>


        <div className="flex justify-between items-center">

          <span className="text-muted">
            Período
          </span>

          <Badge variant="info">
            {cuota.mes} {cuota.anio}
          </Badge>

        </div>


        <div className="flex justify-between items-center">

          <span className="text-muted">
            Monto
          </span>

          <span className="text-2xl font-bold text-accent">
            ${cuota.monto}
          </span>

        </div>


        <div className="flex justify-between items-center">

          <span className="text-muted">
            Método
          </span>

          <Badge variant="success">
            {cuota.metodoPago ?? "-"}
          </Badge>

        </div>


        <div className="flex justify-between items-center">

          <span className="text-muted">
            Fecha de pago
          </span>

          <span>
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

    </Card>

  );

}
