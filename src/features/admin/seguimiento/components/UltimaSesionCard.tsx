import type { SesionEntrenamiento } from "../types/seguimiento";

import { Badge, Card } from "../../../../shared/ui";

type Props = {
  sesion?: SesionEntrenamiento;
};

export default function UltimaSesionCard({ sesion }: Props) {
  if (!sesion) {
    return (
      <div className="rounded-xl bg-surface/35 px-4 py-3 text-sm text-muted">
        Todavía no hay sesiones registradas para este atleta.
      </div>
    );
  }

  const gruposMusculares = sesion.gruposMusculares ?? [];
  const tieneDetalles = gruposMusculares.length > 0 || Boolean(sesion.observaciones);

  return (
    <Card className="!p-4 bg-surface/45 border-border/30 shadow-none sm:!p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-muted">Última sesión</p>
          <h3 className="mt-0.5 truncate text-sm font-bold text-text">
            {sesion.libroNombre || "Entrenamiento General"}
          </h3>
        </div>
        <span className="shrink-0 pt-0.5 text-xs text-muted">
          {sesion.fecha.toLocaleDateString("es-AR")}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 divide-x divide-border/30">
        <div className="px-2 first:pl-0">
          <span className="block text-[10px] text-muted">Carga</span>
          <span className="mt-0.5 block text-sm font-bold text-text">
            {sesion.carga} <span className="text-xs font-semibold text-primary">UA</span>
          </span>
        </div>
        <div className="px-3">
          <span className="block text-[10px] text-muted">Esfuerzo</span>
          <div className="mt-0.5"><Badge variant="info" className="text-[10px] px-1.5 py-0 font-semibold">RPE {sesion.rpe}</Badge></div>
        </div>
        <div className="px-3 last:pr-0">
          <span className="block text-[10px] text-muted">Duración</span>
          <span className="mt-0.5 block text-sm font-bold text-text">
            {sesion.duracion} <span className="text-xs font-medium text-muted">min</span>
          </span>
        </div>
      </div>

      {tieneDetalles && (
        <details className="mt-4 border-t border-border/25 pt-3">
          <summary className="cursor-pointer text-xs font-semibold text-muted transition hover:text-text">
            Ver enfoque y observaciones
          </summary>
          <div className="mt-3 space-y-3">
            {gruposMusculares.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-muted">Enfoque muscular</p>
                <p className="mt-1 text-xs text-text/85">{gruposMusculares.join(" · ")}</p>
              </div>
            )}
            {sesion.observaciones && (
              <div>
                <p className="text-[10px] font-semibold text-muted">Observaciones</p>
                <p className="mt-1 text-xs leading-relaxed text-text/80">{sesion.observaciones}</p>
              </div>
            )}
          </div>
        </details>
      )}
    </Card>
  );
}
