import type { SesionEntrenamiento } from "../types/seguimiento";

import {
  Card,
  Badge,
} from "../../../../shared/ui";

type Props = {
  sesion?: SesionEntrenamiento;
};

export default function UltimaSesionCard({
  sesion,
}: Props) {

  if (!sesion) {
    return (
      <Card className="!p-4 bg-surface/60 border-border/50 backdrop-blur-sm">
        <h3 className="text-xs font-black uppercase tracking-wider text-muted">
          Última Sesión
        </h3>
        <p className="mt-2 text-xs font-medium text-muted/70">
          Aún no hay sesiones registradas para este atleta.
        </p>
      </Card>
    );
  }

  return (
    <Card className="!p-4 bg-surface/70 border-border/60 relative overflow-hidden backdrop-blur-sm">
      {/* GLOW DE FONDO SUTIL */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />

      {/* CABECERA: TÍTULO, RUTINA Y FECHA */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/40">
        <div className="min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted block">
            Última Sesión Registrada
          </span>
          <h3 className="text-sm font-extrabold text-text truncate mt-0.5">
            {sesion.libroNombre || "Entrenamiento General"}
          </h3>
        </div>

        <span className="text-[11px] font-mono font-bold text-muted bg-surfaceSoft/60 px-2 py-0.5 rounded border border-border/30 shrink-0">
          {sesion.fecha.toLocaleDateString("es-AR")}
        </span>
      </div>

      {/* METRICAS CLAVE EN BADGES Y BLOQUES COMPACTOS */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center bg-surfaceSoft/40 p-2.5 rounded-xl border border-border/30">
        <div>
          <span className="text-[9px] font-black uppercase tracking-wider text-muted block">
            Carga
          </span>
          <span className="text-xs font-black text-text">
            {sesion.carga} <span className="text-[10px] text-primary">UA</span>
          </span>
        </div>

        <div className="border-x border-border/40">
          <span className="text-[9px] font-black uppercase tracking-wider text-muted block">
            Esfuerzo
          </span>
          <div className="mt-0.5 inline-block">
            <Badge variant="info" className="text-[10px] px-1.5 py-0 font-extrabold">
              RPE {sesion.rpe}
            </Badge>
          </div>
        </div>

        <div>
          <span className="text-[9px] font-black uppercase tracking-wider text-muted block">
            Duración
          </span>
          <span className="text-xs font-extrabold text-text">
            {sesion.duracion} <span className="text-[10px] text-muted">min</span>
          </span>
        </div>
      </div>

      {/* GRUPOS MUSCULARES */}
      {(sesion.gruposMusculares ?? []).length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-black text-muted uppercase tracking-wider">
            Enfoque Muscular
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {(sesion.gruposMusculares ?? []).map((grupo, index) => (
              <span
                key={index}
                className="text-[10px] font-bold text-text bg-surfaceSoft/80 border border-border/40 px-2 py-0.5 rounded-md"
              >
                {grupo}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* OBSERVACIONES */}
      {sesion.observaciones && (
        <div className="mt-3 pt-2 border-t border-border/30">
          <p className="text-[10px] font-black text-muted uppercase tracking-wider">
            Notas del Entrenador / Atleta
          </p>
          <p className="mt-0.5 text-xs text-text/80 font-medium leading-relaxed italic">
            "{sesion.observaciones}"
          </p>
        </div>
      )}
    </Card>
  );
}