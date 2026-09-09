import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";
import { useAuth } from "../../../../auth/useAuth";
import { useBarreras } from "../../../admin/seguimiento/hooks/useBarreras";

export default function ObjetivosCard() {
  const { user } = useAuth();
  const { barreras, loading } = useBarreras(user?.uid ?? "");

  // Skeleton de carga
  if (loading) {
    return (
      <Card className="animate-pulse space-y-4">
        <div className="h-6 w-1/3 bg-surfaceSoft rounded-md" />
        <div className="h-20 w-full bg-surfaceSoft/50 rounded-xl" />
        <div className="h-20 w-full bg-surfaceSoft/50 rounded-xl" />
      </Card>
    );
  }

  const objetivosActivos = barreras.filter(
    (barrera) => barrera.estado !== "superada"
  );

  return (
    <Card hover className="relative overflow-hidden">
      {/* Luz ambiental difusa */}
      <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      {/* ENCABEZADO */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-xs">
            🎯
          </span>
          <h3 className="text-lg font-bold text-text tracking-tight">
            Objetivos Activos
          </h3>
        </div>

        <Badge variant="info">
          {objetivosActivos.length}
        </Badge>
      </div>

      {/* CONTENIDO */}
      {objetivosActivos.length === 0 ? (
        <div className="p-4 rounded-xl border border-border/50 bg-surfaceSoft/20 text-center">
          <p className="text-xs text-muted font-medium">
            No hay objetivos pendientes por el momento.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {objetivosActivos.slice(0, 3).map((barrera) => (
            <div
              key={barrera.id}
              className="p-3.5 rounded-xl border border-border/60 bg-surfaceSoft/30 hover:border-white/10 transition-colors space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold text-text">
                  {barrera.nombre}
                </p>

                <Badge variant="warning">
                  En progreso
                </Badge>
              </div>

              {barrera.objetivo && (
                <div className="pt-1 border-t border-white/5">
                  <span className="block text-[10px] font-semibold text-muted uppercase tracking-wider">
                    Meta proyectada
                  </span>
                  <p className="text-sm font-extrabold text-primary">
                    {barrera.objetivo}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}