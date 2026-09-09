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

export default function CuotaResumen({
  cuotas,
  onCrear,
  onRegistrarPago,
  onEditar,
  onVerRecibo,
  onRevertido,
}: CuotaResumenProps) {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const cuotasPendientes = cuotas.filter(
    (cuota) => cuota.estado === "pendiente"
  );

  const cuotasPagadas = cuotas.filter((cuota) => cuota.estado === "pagada");

  async function handleEliminarCuota(cuota: Cuota) {
    const confirmar = window.confirm(
      `¿Eliminar la cuota de ${cuota.mes} ${cuota.anio}? Esta acción no se puede deshacer.`
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
        {cuotasPendientes.length === 0 ? (
          <div className="p-4 bg-surfaceSoft/40 border border-border/50 rounded-card text-center">
            <p className="text-sm text-muted">No hay cuotas pendientes registradas.</p>
          </div>
        ) : (
          cuotasPendientes.map((cuota) => (
            <div
              key={cuota.id}
              className="rounded-card border border-border bg-surfaceSoft/20 p-5 transition-all hover:border-border/80"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-5">
                <div>
                  <h3 className="font-semibold text-lg capitalize text-text">
                    {cuota.mes} {cuota.anio}
                  </h3>

                  <p className="text-sm text-muted mt-1">
                    Vencimiento: <span className="font-mono">{cuota.fechaVencimiento}</span>
                  </p>

                  <div className="mt-3">
                    <Badge variant="warning">Pendiente</Badge>
                  </div>
                </div>

                <div className="md:text-right flex flex-col md:items-end justify-between">
                  <p className="text-xl font-bold font-mono text-text">
                    ${cuota.monto}
                  </p>

                  <div className="flex flex-wrap md:justify-end gap-2 mt-4">
                    <Button
                      variant="accent"
                      className="!h-9 !px-3 text-xs"
                      onClick={() => onRegistrarPago(cuota)}
                    >
                      Registrar pago
                    </Button>
                    <Button
                      variant="secondary"
                      className="!h-9 !px-3 text-xs"
                      onClick={() => onEditar(cuota)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* HISTORIAL */}
        {cuotasPagadas.length > 0 && (
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setMostrarHistorial(!mostrarHistorial)}
              className="
                w-full
                flex
                items-center
                justify-between
                py-3
                px-4
                bg-surfaceSoft/30
                rounded-card
                text-sm
                font-semibold
                text-text
                border
                border-border/60
                hover:bg-surfaceSoft/60
                transition-all
              "
            >
              <span>Historial de cuotas pagadas ({cuotasPagadas.length})</span>
              <span className="text-muted">{mostrarHistorial ? "▲" : "▼"}</span>
            </button>

            {mostrarHistorial && (
              <div className="divide-y divide-border/60 mt-3 bg-surfaceSoft/10 rounded-card border border-border/40 px-4">
                {cuotasPagadas.map((cuota) => (
                  <div
                    key={cuota.id}
                    className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-text capitalize">
                        {cuota.mes} {cuota.anio}
                        <span className="font-mono text-primary ml-2 font-bold">
                          ${cuota.monto}
                        </span>
                      </p>
                      <p className="text-xs text-muted">
                        Pagada el <span className="font-mono">{cuota.fechaPago ?? "-"}</span>
                        {" · Método: "}
                        <span className="text-text font-medium">{cuota.metodoPago ?? "-"}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="secondary"
                        className="!h-8 !px-3 text-xs"
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
                        className="!h-8 !px-3 text-xs"
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