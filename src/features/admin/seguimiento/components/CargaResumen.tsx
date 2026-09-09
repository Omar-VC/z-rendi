import type { SesionEntrenamiento } from "../types/seguimiento";

import { Badge, Card } from "../../../../shared/ui";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* TARJETA CARGA SEMANAL */}
      <Card className="!p-4 bg-surface/70 border-border/60 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl pointer-events-none" />
        
        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted">
                Carga Semanal
              </span>
              <span className="text-[10px] font-bold text-muted/70 bg-surfaceSoft px-1.5 py-0.5 rounded">
                {obtenerTextoSemanaActual()}
              </span>
            </div>
            <Badge variant={estadoCarga.variant} className="text-[10px] px-2 py-0.5 font-bold">
              {estadoCarga.texto}
            </Badge>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-text tracking-tight">
              {cargaSemanal}
            </span>
            <span className="text-xs font-black text-primary uppercase tracking-wider">
              UA
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted font-medium">
          <div>
            Sesiones: <span className="font-extrabold text-text">{cantidadSesionesSemana}</span>
          </div>
          <div>
            Promedio: <span className="font-extrabold text-text">{promedioSemanal} UA</span>
          </div>
        </div>
      </Card>

      {/* TARJETA CARGA MENSUAL */}
      <Card className="!p-4 bg-surface/70 border-border/60 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted">
              Carga Mensual
            </span>
            <span className="text-[10px] font-extrabold text-muted capitalize bg-surfaceSoft px-2 py-0.5 rounded">
              {nombreMes}
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-text tracking-tight">
              {cargaMensual}
            </span>
            <span className="text-xs font-black text-primary uppercase tracking-wider">
              UA
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted font-medium">
          <div>
            Sesiones: <span className="font-extrabold text-text">{cantidadSesionesMes}</span>
          </div>
          <div>
            Promedio: <span className="font-extrabold text-text">{promedioMensual} UA</span>
          </div>
        </div>
      </Card>
    </div>
  );
}