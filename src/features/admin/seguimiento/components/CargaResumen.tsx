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
    <div className="rounded-xl border border-border bg-surface px-4 py-4">
      <p className="text-sm font-semibold text-text">
        Carga
      </p>

      <div className="mt-3 space-y-3 text-sm">

        {/* SEMANAL */}

        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-text">
              Semanal
            </span>

            <span className="text-muted">
              {obtenerTextoSemanaActual()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
            <span>
              {cargaSemanal} UA
            </span>

            <span>·</span>

            <span>
              {cantidadSesionesSemana} sesiones
            </span>

            <span>·</span>

            <span>
              promedio {promedioSemanal} UA
            </span>

            <Badge variant={estadoCarga.variant}>
              {estadoCarga.texto}
            </Badge>
          </div>
        </div>

        {/* MENSUAL */}

        <div className="flex flex-col gap-1 border-t border-border pt-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-text">
              Mensual
            </span>

            <span className="text-muted capitalize">
              {nombreMes}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
            <span>
              {cargaMensual} UA
            </span>

            <span>·</span>

            <span>
              {cantidadSesionesMes} sesiones
            </span>

            <span>·</span>

            <span>
              promedio {promedioMensual} UA
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}