import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { useBarreras } from "../hooks/useBarreras";

import NuevaBarreraModal from "./NuevaBarreraModal";
import EvaluarBarreraModal from "./EvaluarBarreraModal";
import NuevoObjetivoModal from "./NuevoObjetivoModal";
import ConfigurarBarreraFuerzaModal from "./ConfigurarBarreraFuerzaModal";
import HistorialBarrera from "./HistorialBarrera";

import type { Barrera } from "../types/barrera";

import { eliminarBarrera } from "../services/barrerasService";

import {
  Button,
  Badge,
} from "../../../../shared/ui";

type Props = {
  clienteId: string;
};

type GrupoBarrera = {
  id: string;
  etapas: Barrera[];
  actual: Barrera;
};

function obtenerGrupoId(barrera: Barrera): string {
  if (barrera.grupoProgresionId) return barrera.grupoProgresionId;
  let id = barrera.id;
  while (id.startsWith("auto_")) id = id.slice("auto_".length);
  return id;
}

function tiempoCreacion(barrera: Barrera): number {
  const fecha = barrera.createdAt;
  if (!fecha) return 0;
  if (fecha instanceof Date) return fecha.getTime();
  return "toDate" in fecha ? fecha.toDate().getTime() : 0;
}

function profundidadProgresion(barrera: Barrera): number {
  let profundidad = 0;
  let id = barrera.id;
  while (id.startsWith("auto_")) {
    profundidad += 1;
    id = id.slice("auto_".length);
  }
  return profundidad;
}

function agruparBarreras(barreras: Barrera[]): GrupoBarrera[] {
  const grupos = new Map<string, Barrera[]>();
  barreras.forEach((barrera) => {
    const grupoId = obtenerGrupoId(barrera);
    grupos.set(grupoId, [...(grupos.get(grupoId) ?? []), barrera]);
  });

  return Array.from(grupos, ([id, etapas]) => {
    etapas.sort(
      (a, b) =>
        profundidadProgresion(a) - profundidadProgresion(b) ||
        tiempoCreacion(a) - tiempoCreacion(b),
    );
    const actual = [...etapas].reverse().find((etapa) => etapa.estado === "pendiente") ?? etapas[etapas.length - 1];
    return { id, etapas, actual };
  });
}

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
  const [barreraFuerzaPorConfigurar, setBarreraFuerzaPorConfigurar] = useState<Barrera | null>(null);
  const [barreraAbierta, setBarreraAbierta] = useState<string | null>(null);
  const grupos = agruparBarreras(barreras);

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
    <section className="pt-1">
      <div className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-text">Barreras de progreso</h3>
            <span className="rounded-full bg-surfaceSoft/65 px-2 py-0.5 text-[10px] font-semibold text-muted">
              {grupos.length}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            Pruebas y objetivos de evolución física y técnica.
          </p>
        </div>

        <Button
          variant="accent"
          className="!min-h-0 h-9 !px-3 text-xs font-semibold shrink-0 self-start sm:self-auto"
          onClick={() => setMostrarModal(true)}
        >
          + Nueva prueba
        </Button>
      </div>

      {/* ESTADOS DE CARGA Y VACÍO */}
      {loading && (
        <div className="py-6 space-y-2 animate-pulse">
          <div className="h-12 bg-surfaceSoft/50 rounded-lg border border-border/30" />
        </div>
      )}

      {!loading && grupos.length === 0 && (
        <p className="py-6 text-center text-xs text-muted font-medium">
          No hay pruebas registradas para este atleta.
        </p>
      )}

      {/* LISTADO DE BARRERAS */}
      {!loading && grupos.length > 0 && (
        <div className="mt-3 divide-y divide-border/30">
          {grupos.map((grupo) => {
            const barrera = grupo.actual;
            const abierta = barreraAbierta === grupo.id;
            const historialGrupo = grupo.etapas
              .flatMap((etapa) => etapa.historial ?? [])
              .sort((a, b) => a.fecha.localeCompare(b.fecha));

            return (
              <div key={grupo.id} className="py-3">
                {/* BOTÓN REPLEGABLE / HEADER DE LA BARRERA */}
                <button
                  type="button"
                  onClick={() => alternarBarrera(grupo.id)}
                  aria-expanded={abierta}
                  className="group w-full rounded-lg py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    {/* INFORMACIÓN PRINCIPAL */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-text group-hover:text-primary transition-colors">
                          {barrera.ejercicioNombre || barrera.nombre}
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
                        {barrera.ejercicioId && (
                          <Badge variant="info" className="text-[9px] px-1.5 py-0 uppercase">Auto +10%</Badge>
                        )}
                        <span>Objetivo: <strong className="text-text/90 font-semibold">{barrera.objetivo}</strong></span>
                      </div>
                    </div>

                    {/* INDICADOR DERECHO */}
                    <div className="flex items-center gap-3 shrink-0 text-xs text-muted self-end sm:self-center">
                      <span className="text-[11px] text-muted">
                          {grupo.etapas.length} {grupo.etapas.length === 1 ? "objetivo" : "etapas"}
                      </span>

                      <ChevronDown className={`h-4 w-4 text-muted transition-transform duration-200 ${abierta ? "rotate-180" : ""}`} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                  </div>
                </button>

                {/* DETALLE Y HISTORIAL CUANDO ESTÁ ABIERTO */}
                {abierta && (
                  <div className="mt-3 border-t border-border/20 pt-3 animate-fadeIn space-y-4">
                    <HistorialBarrera historial={historialGrupo} />

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      {barrera.ejercicioId ? (
                        <span className="text-[11px] text-muted">
                          {barrera.estado === "pendiente"
                            ? "Se actualizará al alcanzar la marca"
                            : "Siguiente objetivo generado automáticamente"}
                        </span>
                      ) : barrera.estado === "pendiente" && barrera.categoria === "Fuerza" ? (
                        <Button
                          variant="accent"
                          className="!min-h-0 !h-7 !px-3 text-xs font-bold"
                          onClick={() => setBarreraFuerzaPorConfigurar(barrera)}
                        >
                          Activar automatización
                        </Button>
                      ) : barrera.estado === "pendiente" ? (
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

      {barreraFuerzaPorConfigurar && (
        <ConfigurarBarreraFuerzaModal
          barrera={barreraFuerzaPorConfigurar}
          onClose={() => setBarreraFuerzaPorConfigurar(null)}
          onGuardado={() => {
            recargar();
            setBarreraFuerzaPorConfigurar(null);
          }}
        />
      )}
    </section>
  );
}
