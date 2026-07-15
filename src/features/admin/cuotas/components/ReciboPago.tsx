import type { Cuota } from "../types";

interface ReciboPagoProps {
  cuota: Cuota;
  clienteNombre: string;
  onCerrar: () => void;
}

function ReciboPago({ cuota, clienteNombre, onCerrar }: ReciboPagoProps) {
  const compartirWhatsApp = () => {
    const mensaje = `
RECIBO DE PAGO

Cliente: ${clienteNombre}
Período: ${cuota.mes}${cuota.anio ? ` ${cuota.anio}` : ""}
Monto: $${cuota.monto}
Método: ${cuota.metodoPago ?? "-"}
Fecha de pago: ${cuota.fechaPago ?? "-"}
    `.trim();

    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
  };

  return (
    <section className="p-6 rounded-xl border border-white/10">
      <h2 className="text-xl font-bold mb-6">Recibo de pago</h2>

      <div className="space-y-2">
        <p>
          <strong>Cliente:</strong> {clienteNombre}
        </p>

        <p>
          <strong>Período:</strong> {cuota.mes}
          {cuota.anio ? ` ${cuota.anio}` : ""}
        </p>

        <p>
          <strong>Monto:</strong> ${cuota.monto}
        </p>

        <p className="capitalize">
          <strong>Método:</strong> {cuota.metodoPago ?? "-"}
        </p>

        <p>
          <strong>Fecha de pago:</strong> {cuota.fechaPago ?? "-"}
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={compartirWhatsApp} className="px-4 py-2 rounded-lg">
          Compartir por WhatsApp
        </button>

        <button onClick={onCerrar} className="px-4 py-2 rounded-lg">
          Cerrar
        </button>
      </div>
    </section>
  );
}

export default ReciboPago;
