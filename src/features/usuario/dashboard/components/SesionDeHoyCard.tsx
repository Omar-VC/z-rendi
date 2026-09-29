import type { SesionPendiente } from "../../../admin/seguimiento/types/sesionPendiente";
import { Card, Button, Badge } from "../../../../shared/ui";
import { Dumbbell } from "lucide-react";

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
    <Card className="relative overflow-hidden bg-surface/95 backdrop-blur-md border border-white/10 p-6 shadow-xl">
      {/* Ícono decorativo acotado a la esquina superior derecha con degradado para no invadir el contenido */}
      <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none overflow-hidden opacity-10">
        <Dumbbell className="absolute -top-6 -right-6 w-40 h-40 text-primary -rotate-12" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Encabezado con ícono destacado */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Ícono grande contenedor de entrenamiento */}
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary shrink-0 shadow-[0_0_15px_rgba(255,85,0,0.15)]">
              <Dumbbell className="w-7 h-7" />
            </div>

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
          </div>

          <Badge variant="warning" className="self-start sm:self-auto">
            Pendiente
          </Badge>
        </div>

        {/* Objetivo */}
        <div className="p-3.5 bg-surfaceSoft/60 rounded-xl border border-white/5">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted">
            Objetivo principal
          </p>
          <p className="mt-1 text-sm font-medium text-text">
            {sesion.objetivo}
          </p>
        </div>

        {/* Grupos musculares con badges opacos y bien definidos */}
        {sesion.gruposMusculares.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider font-semibold text-muted">
              Grupos musculares
            </p>
            <div className="flex flex-wrap gap-2">
              {sesion.gruposMusculares.map((grupo, index) => (
                <span
                  key={`${grupo}-${index}`}
                  className="rounded-lg border border-primary/30 bg-surfaceSoft text-primary px-3 py-1 text-xs font-bold tracking-wide shadow-sm"
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