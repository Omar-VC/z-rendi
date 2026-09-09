import type { SesionPendiente } from "../../../admin/seguimiento/types/sesionPendiente";
import { Card, Button, Badge } from "../../../../shared/ui";

type Props = {
  sesion: SesionPendiente;
  onAbrir: () => void;
};

export default function SesionDeHoyCard({ sesion, onAbrir }: Props) {
  const fecha = sesion.fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
  });

  return (
    <Card className="bg-surface/80 backdrop-blur-sm border-none p-6">
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Sesión del día
              </p>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              {sesion.libroNombre}
            </h2>

            <p className="text-xs font-medium text-muted capitalize">
              {fecha}
            </p>
          </div>

          <Badge variant="warning" className="self-start sm:self-auto">
            Pendiente
          </Badge>
        </div>

        {/* Objetivo */}
        <div className="p-3.5 bg-surfaceSoft/50 rounded-xl border border-white/5">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted">
            Objetivo principal
          </p>
          <p className="mt-1 text-sm font-medium text-text">
            {sesion.objetivo}
          </p>
        </div>

        {/* Grupos musculares */}
        {sesion.gruposMusculares.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider font-semibold text-muted">
              Grupos musculares
            </p>
            <div className="flex flex-wrap gap-2">
              {sesion.gruposMusculares.map((grupo, index) => (
                <span
                  key={`${grupo}-${index}`}
                  className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary tracking-wide"
                >
                  {String(grupo)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Indicaciones del Preparador */}
        {sesion.observacionesPreparador && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-surfaceSoft to-transparent border-l-4 border-primary">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Indicaciones del Coach
            </p>
            <p className="mt-1.5 text-sm text-text/90 italic leading-relaxed whitespace-pre-line">
              "{sesion.observacionesPreparador}"
            </p>
          </div>
        )}

        {/* Botón de Acción Principal */}
        <div className="pt-2 flex justify-end">
          <Button
            variant="primary"
            className="w-full sm:w-auto px-8 py-3 text-base shadow-[0_0_25px_rgba(255,85,0,0.35)]"
            onClick={onAbrir}
          >
            Iniciar y Registrar Sesión
          </Button>
        </div>
      </div>
    </Card>
  );
}
