import { useState } from "react";

import type { SesionEntrenamiento } from "../types/seguimiento";
import type { SerieRealizada } from "../types/registroEjercicio";
import { ChevronDown } from "lucide-react";

import { Badge, Button } from "../../../../shared/ui";

type Props = {
  sesiones: SesionEntrenamiento[];
  onEliminarSesion: (id: string) => Promise<void>;
};

const mejorPeso = (series: SerieRealizada[]) =>
  Math.max(0, ...series.map((s) => s.peso));

const mejorE1RM = (series: SerieRealizada[]) =>
  Math.max(
    0,
    ...series
      .filter((s) => s.peso > 0 && s.reps > 0)
      .map((s) => s.peso * (1 + s.reps / 30)),
  );

const redondear = (n: number) => Math.round(n * 10) / 10;

function Variacion({ actual, anterior }: { actual: number; anterior?: number }) {
  if (anterior === undefined) {
    return <span className="text-muted">sin registro previo</span>;
  }
  const diff = redondear(actual - anterior);
  if (diff === 0) return <span className="text-muted">= igual</span>;
  return (
    <span className={diff > 0 ? "text-success" : "text-danger"}>
      {diff > 0 ? "▲ +" : "▼ "}
      {diff} kg
    </span>
  );
}

export default function RegistroSesiones({ sesiones, onEliminarSesion }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [detalle, setDetalle] = useState<Set<string>>(new Set());

  async function eliminar(id: string) {
    const confirmar = window.confirm("¿Eliminar esta sesión de entrenamiento?");
    if (!confirmar) return;
    await onEliminarSesion(id);
  }

  function alternarDetalle(id: string) {
    setDetalle((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Registro previo de un ejercicio: busca en las sesiones más antiguas de la lista
  function registroPrevio(indice: number, ejercicioId: string) {
    for (let i = indice + 1; i < sesiones.length; i++) {
      const previo = sesiones[i].bloquesRealizados?.find(
        (e) => e.ejercicioId === ejercicioId,
      );
      if (previo) return previo;
    }
    return undefined;
  }

  return (
    <section className="border-t border-border/30 py-4">
      <button
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        className="group flex w-full items-center justify-between gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-text group-hover:text-primary transition-colors">
              Historial de sesiones
            </h3>
            <span className="rounded-full bg-surfaceSoft/65 px-2 py-0.5 text-[10px] font-semibold text-muted">
              {sesiones.length}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            Consultá los detalles de cada entrenamiento.
          </p>
        </div>

        <ChevronDown className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${abierto ? "rotate-180" : ""}`} strokeWidth={1.8} aria-hidden="true" />
      </button>

      {abierto && (
        <div className="mt-4 animate-fadeIn">
          {sesiones.length === 0 ? (
            <p className="text-xs text-muted font-medium py-2 text-center">
              No hay sesiones registradas en este período.
            </p>
          ) : (
            <div className="divide-y divide-border/30">
              {sesiones.map((sesion, indice) => {
                const realizados = sesion.bloquesRealizados ?? [];
                const asignados = (sesion.bloques ?? []).flatMap((b) =>
                  b.ejercicios.map((e) => ({ ...e, bloque: b.nombre })),
                );
                const idsRealizados = new Set(realizados.map((r) => r.ejercicioId));
                const sinCarga = asignados.filter(
                  (a) => !idsRealizados.has(a.ejercicioId),
                );

                const tieneDetalle =
                  realizados.length > 0 ||
                  asignados.length > 0 ||
                  !!sesion.objetivo ||
                  !!sesion.observaciones;
                const expandido = detalle.has(sesion.id);

                return (
                  <div key={sesion.id} className="py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surfaceSoft/30 -mx-2 px-2 rounded-lg transition-colors">
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-text truncate">
                            {sesion.libroNombre || "Entrenamiento General"}
                          </span>
                          <span className="text-[10px] font-mono text-muted/70 bg-surfaceSoft px-1.5 py-0.2 rounded border border-border/20">
                            {sesion.fecha.toLocaleDateString("es-AR")}
                          </span>
                        </div>

                        {(sesion.gruposMusculares ?? []).length > 0 && (
                          <p className="text-[11px] text-muted truncate">
                            {(sesion.gruposMusculares ?? []).join(" · ")}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <Badge variant="neutral" className="text-[10px] px-1.5 py-0">
                            {sesion.duracion} min
                            {sesion.duracionPlanificada &&
                            sesion.duracionPlanificada !== sesion.duracion
                              ? ` (plan ${sesion.duracionPlanificada})`
                              : ""}
                          </Badge>

                          <Badge variant="info" className="text-[10px] px-1.5 py-0 font-bold">
                            RPE {sesion.rpe}
                          </Badge>

                          <Badge variant="warning" className="text-[10px] px-1.5 py-0 font-bold">
                            {sesion.carga} UA
                          </Badge>
                        </div>
                      </div>

                      <div className="shrink-0 self-end sm:self-center flex items-center gap-2">
                        {tieneDetalle && (
                          <Button
                            variant="secondary"
                            className="!min-h-0 !h-7 !px-2.5 text-[11px] font-semibold"
                            onClick={() => alternarDetalle(sesion.id)}
                          >
                            {expandido ? "Ocultar detalle" : "Ver detalle"}
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          className="!min-h-0 !h-7 !px-2.5 text-[11px] font-semibold opacity-70 hover:opacity-100"
                          onClick={() => eliminar(sesion.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>

                    {/* DETALLE */}
                    {expandido && (
                      <div className="mt-3 space-y-3 rounded-lg border border-border/40 bg-surfaceSoft/30 p-3">
                        {sesion.objetivo && (
                          <p className="text-[11px] text-muted">
                            <strong className="text-text">Objetivo:</strong>{" "}
                            {sesion.objetivo}
                          </p>
                        )}

                        {realizados.length === 0 && (
                          <p className="text-[11px] text-muted italic">
                            El atleta no registró series en esta sesión.
                          </p>
                        )}

                        {realizados.map((ej) => {
                          const plan = asignados.find(
                            (a) => a.ejercicioId === ej.ejercicioId,
                          );
                          const previo = registroPrevio(indice, ej.ejercicioId);
                          const peso = mejorPeso(ej.series);
                          const e1rm = redondear(mejorE1RM(ej.series));

                          return (
                            <div
                              key={ej.ejercicioId}
                              className="space-y-1.5 border-b border-border/20 pb-2 last:border-0 last:pb-0"
                            >
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <p className="text-xs font-bold text-text">
                                  {ej.nombre}
                                </p>
                                {plan?.repeticiones && (
                                  <span className="text-[10px] text-muted">
                                    Plan: {plan.repeticiones} · Hecho:{" "}
                                    {ej.series.length} serie(s)
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                {ej.series.map((s, i) => (
                                  <span
                                    key={i}
                                    className="text-[11px] font-mono bg-surface border border-border/40 rounded px-1.5 py-0.5 text-text"
                                  >
                                    {s.reps} × {s.peso} kg
                                  </span>
                                ))}
                              </div>

                              <p className="text-[11px] text-muted flex flex-wrap gap-x-3">
                                <span>
                                  Mejor peso: <strong className="text-text">{peso} kg</strong>{" "}
                                  <Variacion
                                    actual={peso}
                                    anterior={
                                      previo ? mejorPeso(previo.series) : undefined
                                    }
                                  />
                                </span>
                                {e1rm > 0 && (
                                  <span>
                                    e1RM: <strong className="text-text">{e1rm} kg</strong>{" "}
                                    <Variacion
                                      actual={e1rm}
                                      anterior={
                                        previo
                                          ? redondear(mejorE1RM(previo.series))
                                          : undefined
                                      }
                                    />
                                  </span>
                                )}
                              </p>
                            </div>
                          );
                        })}

                        {sinCarga.length > 0 && (
                          <p className="text-[11px] text-muted">
                            <strong className="text-text">Asignados sin carga registrada:</strong>{" "}
                            {sinCarga.map((e) => e.nombre).join(", ")}
                          </p>
                        )}

                        {sesion.observaciones && (
                          <p className="text-[11px] text-muted">
                            <strong className="text-text">Comentario del atleta:</strong>{" "}
                            {sesion.observaciones}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
