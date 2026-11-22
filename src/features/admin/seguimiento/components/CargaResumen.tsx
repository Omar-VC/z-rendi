import type { SesionEntrenamiento } from "../types/seguimiento";

import { Badge } from "../../../../shared/ui";

import { obtenerEstadoCargaSemanal } from "../utils/cargaUtils";

import {
  estaEnSemanaActual,
  obtenerTextoSemanaActual,
} from "../utils/fechaUtils";

type Props = {
  sesiones: SesionEntrenamiento[];
};

export default function CargaResumen({ sesiones }: Props) {
  const hoy = new Date();

  // -----------------------------
  // CARGA SEMANAL
  // -----------------------------
  const sesionesSemana = sesiones.filter((sesion) =>
    estaEnSemanaActual(sesion.fecha),
  );

  const cargaSemanal = sesionesSemana.reduce(
    (total, sesion) => total + sesion.carga,
    0,
  );

  const cantidadSesionesSemana = sesionesSemana.length;

  const promedioSemanal =
    cantidadSesionesSemana === 0
      ? 0
      : Math.round(cargaSemanal / cantidadSesionesSemana);

  const estadoCarga = obtenerEstadoCargaSemanal(cargaSemanal);

  // -----------------------------
  // CARGA MENSUAL
  // -----------------------------
  const sesionesMes = sesiones.filter(
    (sesion) =>
      sesion.fecha.getMonth() === hoy.getMonth() &&
      sesion.fecha.getFullYear() === hoy.getFullYear(),
  );

  const cargaMensual = sesionesMes.reduce(
    (total, sesion) => total + sesion.carga,
    0,
  );

  const cantidadSesionesMes = sesionesMes.length;

  const promedioMensual =
    cantidadSesionesMes === 0
      ? 0
      : Math.round(cargaMensual / cantidadSesionesMes);

  const nombreMes = hoy.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="overflow-hidden rounded-2xl bg-surface/45">
      <div className="grid divide-y divide-white/[0.06] sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:divide-white/[0.06]">
        <section className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-muted">Esta semana</p>
              <p className="mt-0.5 text-[10px] text-muted/70">{obtenerTextoSemanaActual()}</p>
            </div>
            <Badge variant={estadoCarga.variant} className="text-[10px] px-2 py-0.5 font-semibold">
              {estadoCarga.texto}
            </Badge>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tracking-tight text-text">{cargaSemanal}</span>
            <span className="text-xs font-semibold text-primary">UA</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            {cantidadSesionesSemana} {cantidadSesionesSemana === 1 ? "sesión" : "sesiones"}
            <span className="mx-1.5 text-muted/50">·</span>
            Promedio {promedioSemanal} UA
          </p>
        </section>

        <section className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-muted">Este mes</p>
            <span className="text-[10px] font-medium capitalize text-muted/70">{nombreMes}</span>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tracking-tight text-text">{cargaMensual}</span>
            <span className="text-xs font-semibold text-primary">UA</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            {cantidadSesionesMes} {cantidadSesionesMes === 1 ? "sesión" : "sesiones"}
            <span className="mx-1.5 text-muted/50">·</span>
            Promedio {promedioMensual} UA
          </p>
        </section>
      </div>
    </div>
  );
}
