import { useState } from "react";

import { useBarreras } from "../hooks/useBarreras";

import NuevaBarreraModal from "./NuevaBarreraModal";
import EvaluarBarreraModal from "./EvaluarBarreraModal";
import NuevoObjetivoModal from "./NuevoObjetivoModal";
import HistorialBarrera from "./HistorialBarrera";

import type { Barrera } from "../types/barrera";

import { eliminarBarrera } from "../services/barrerasService";

import {
  Card,
  Button,
  Badge,
} from "../../../../shared/ui";

type Props = {
  clienteId: string;
};

export default function BarrerasPanel({
  clienteId,
}: Props) {
  const {
    barreras,
    loading,
    recargar,
  } = useBarreras(clienteId);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [barreraSeleccionada, setBarreraSeleccionada] = useState<Barrera | null>(null);
  const [barreraNuevoObjetivo, setBarreraNuevoObjetivo] = useState<Barrera | null>(null);
  const [barreraAbierta, setBarreraAbierta] = useState<string | null>(null);

  async function borrarBarrera(id: string) {
    const confirmar = window.confirm("¿Eliminar esta barrera?");
    if (!confirmar) return;

    try {
      await eliminarBarrera(id);
      recargar();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la barrera.");
    }
  }

  function estadoVariant(estado: Barrera["estado"]) {
    return estado === "superada" ? ("success" as const) : ("warning" as const);
  }

  function alternarBarrera(id: string) {
    setBarreraAbierta((actual) => (actual === id ? null : id));
  }

  return (
    <Card className="!p-4 bg-surface/70 border-border/60">
      {/* CABECERA CON ACCIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-text">
              Barreras de Progreso
            </h3>
            <span className="text-[10px] font-bold text-muted bg-surfaceSoft px-2 py-0.5 rounded-full border border-border/40">
              {barreras.length}
            </span>
          </div>
          <p className="text-xs text-muted font-medium mt-0.5">
            Pruebas y objetivos de evolución técnica y física
          </p>
        </div>

        <Button
          variant="accent"
          className="!min-h-0 h-8 !px-3 text-xs font-bold shadow-[0_0_12px_rgba(255,85,0,0.2)] shrink-0 self-start sm:self-auto"
          onClick={() => setMostrarModal(true)}
        >
          + Nueva Prueba
        </Button>
      </div>

      {/* ESTADOS DE CARGA Y VACÍO */}
      {loading && (
        <div className="py-6 space-y-2 animate-pulse">
          <div className="h-12 bg-surfaceSoft/50 rounded-lg border border-border/30" />
        </div>
      )}

      {!loading && barreras.length === 0 && (
        <p className="py-6 text-center text-xs text-muted font-medium">
          No hay pruebas registradas para este atleta.
        </p>
      )}

      {/* LISTADO DE BARRERAS */}
      {!loading && barreras.length > 0 && (
        <div className="mt-3 divide-y divide-border/30">
          {barreras.map((barrera) => {
            const abierta = barreraAbierta === barrera.id;
            const evaluaciones = barrera.historial?.length ?? 0;

            return (
              <div key={barrera.id} className="py-3">
                {/* BOTÓN REPLEGABLE / HEADER DE LA BARRERA */}
                <button
                  type="button"
                  onClick={() => alternarBarrera(barrera.id)}
                  className="w-full text-left group focus:outline-none"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    {/* INFORMACIÓN PRINCIPAL */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-text group-hover:text-primary transition-colors">
                          {barrera.nombre}
                        </span>

                        <Badge
                          variant={estadoVariant(barrera.estado)}
                          className="text-[10px] px-1.5 py-0 font-bold uppercase tracking-wider"
                        >
                          {barrera.estado}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted font-medium">
                        {barrera.categoria && (
                          <>
                            <span className="text-text/80 font-semibold">
                              {barrera.categoria}
                            </span>
                            <span className="text-border">·</span>
                          </>
                        )}
                        <span>Objetivo: <strong className="text-text/90 font-semibold">{barrera.objetivo}</strong></span>
                      </div>
                    </div>

                    {/* INDICADOR DERECHO */}
                    <div className="flex items-center gap-3 shrink-0 text-xs text-muted self-end sm:self-center">
                      <span className="text-[11px] font-mono bg-surfaceSoft px-2 py-0.5 rounded border border-border/30">
                        {evaluaciones} {evaluaciones === 1 ? "evaluación" : "evaluaciones"}
                      </span>

                      <div className="w-6 h-6 rounded-md bg-surfaceSoft border border-border/30 flex items-center justify-center text-[10px] group-hover:text-text transition-all">
                        <span className={`transform transition-transform duration-200 ${abierta ? "rotate-180" : ""}`}>
                          ▼
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* DETALLE Y HISTORIAL CUANDO ESTÁ ABIERTO */}
                {abierta && (
                  <div className="mt-3 pt-3 border-t border-border/20 animate-fadeIn space-y-4">
                    <HistorialBarrera historial={barrera.historial} />

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/20">
                      {barrera.estado === "pendiente" ? (
                        <Button
                          variant="success"
                          className="!min-h-0 !h-7 !px-3 text-xs font-bold"
                          onClick={() => setBarreraSeleccionada(barrera)}
                        >
                          Evaluar
                        </Button>
                      ) : (
                        <Button
                          variant="accent"
                          className="!min-h-0 !h-7 !px-3 text-xs font-bold"
                          onClick={() => setBarreraNuevoObjetivo(barrera)}
                        >
                          Nuevo objetivo
                        </Button>
                      )}

                      <Button
                        variant="danger"
                        className="!min-h-0 !h-7 !px-2.5 text-xs font-semibold opacity-70 hover:opacity-100"
                        onClick={() => borrarBarrera(barrera.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODALES */}
      {mostrarModal && (
        <NuevaBarreraModal
          clienteId={clienteId}
          onClose={() => setMostrarModal(false)}
          onGuardado={() => {
            recargar();
            setMostrarModal(false);
          }}
        />
      )}

      {barreraSeleccionada && (
        <EvaluarBarreraModal
          barrera={barreraSeleccionada}
          onClose={() => setBarreraSeleccionada(null)}
          onGuardado={() => {
            recargar();
            setBarreraSeleccionada(null);
          }}
        />
      )}

      {barreraNuevoObjetivo && (
        <NuevoObjetivoModal
          barrera={barreraNuevoObjetivo}
          onClose={() => setBarreraNuevoObjetivo(null)}
          onGuardado={() => {
            recargar();
            setBarreraNuevoObjetivo(null);
          }}
        />
      )}
    </Card>
  );
}