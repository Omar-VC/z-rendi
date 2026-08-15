import { useState } from "react";
import type { Cuota } from "../types";

import RevertirPagoButton from "./RevertirPagoButton";

import { Card, Button, Badge, SectionTitle } from "../../../../shared/ui";
import { eliminarCuota } from "../services/cuotas.service";

interface CuotaResumenProps {
  cuotas: Cuota[];
  onCrear: () => void;
  onRegistrarPago: (cuota: Cuota) => void;
  onEditar: (cuota: Cuota) => void;
  onRevertido: () => void;
  onVerRecibo: (cuota: Cuota) => void;
}

function CuotaResumen({
  cuotas,
  onCrear,
  onRegistrarPago,
  onEditar,
  onVerRecibo,
  onRevertido,
}: CuotaResumenProps) {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const cuotasPendientes = cuotas.filter(
    (cuota) => cuota.estado === "pendiente",
  );

  const cuotasPagadas = cuotas.filter((cuota) => cuota.estado === "pagada");

  async function handleEliminarCuota(cuota: Cuota) {
    const confirmar = window.confirm(
      `¿Eliminar la cuota de ${cuota.mes} ${cuota.anio}? Esta acción no se puede deshacer.`,
    );

    if (!confirmar) return;

    try {
      await eliminarCuota(cuota.id);
      onRevertido();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la cuota.");
    }
  }

  return (
    <Card>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <SectionTitle
          title="Cuotas"
          description="Historial de pagos y vencimientos."
        />

        <Button variant="accent" onClick={onCrear}>
          Nueva cuota
        </Button>
      </div>

      <div className="space-y-4 mt-6">
        {/* CUOTAS PENDIENTES */}

        {cuotasPendientes.map((cuota) => (
          <div
            key={cuota.id}
            className="
        rounded-xl
        border
        border-border
        bg-surface
        p-5
      "
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-5">
              <div>
                <h3 className="font-semibold text-lg capitalize">
                  {cuota.mes} {cuota.anio}
                </h3>

                <p className="text-sm text-muted mt-2">
                  Vencimiento: {cuota.fechaVencimiento}
                </p>

                <div className="mt-3">
                  <Badge variant="warning">Pendiente</Badge>
                </div>
              </div>

              <div className="md:text-right">
                <p className="text-xl font-bold">${cuota.monto}</p>

                <Button
                  variant="accent"
                  className="mt-4"
                  onClick={() => onRegistrarPago(cuota)}
                >
                  Registrar pago
                </Button>

                <div className="flex md:justify-end gap-2 mt-4">
                  <Button variant="secondary" onClick={() => onEditar(cuota)}>
                    Editar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* HISTORIAL */}

        {cuotasPagadas.length > 0 && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setMostrarHistorial(!mostrarHistorial)}
              className="
          w-full
          flex
          items-center
          justify-between
          py-3
          text-sm
          font-semibold
          text-text
          border-b
          border-border
        "
            >
              <span>Historial de cuotas</span>

              <span>{mostrarHistorial ? "▲" : "▼"}</span>
            </button>

            {mostrarHistorial && (
              <div className="divide-y divide-border">
                {cuotasPagadas.map((cuota) => (
                  <div
                    key={cuota.id}
                    className="
                py-4
                text-sm
                text-muted
              "
                  >
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-text capitalize">
                        {cuota.mes} {cuota.anio}
                        {" · "}${cuota.monto}
                      </p>

                      <p>
                        Pagada · {cuota.fechaPago ?? "-"}
                        {" · "}
                        {cuota.metodoPago ?? "-"}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="secondary"
                        className="!h-8 !px-3 !py-1 text-xs"
                        onClick={() => onVerRecibo(cuota)}
                      >
                        Recibo
                      </Button>

                      <RevertirPagoButton
                        cuotaId={cuota.id}
                        onRevertido={onRevertido}
                      />

                      <Button
                        variant="danger"
                        className="!h-8 !px-3 !py-1 text-xs"
                        onClick={() => handleEliminarCuota(cuota)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default CuotaResumen;
