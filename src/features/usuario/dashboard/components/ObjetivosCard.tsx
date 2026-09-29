import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";
import { useAuth } from "../../../../auth/useAuth";
import { useBarreras } from "../../../admin/seguimiento/hooks/useBarreras";
import { Target, Flag, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ObjetivosCard() {
  const { user } = useAuth();
  const { barreras, loading } = useBarreras(user?.uid ?? "");

  // Skeleton de carga
  if (loading) {
    return (
      <Card className="animate-pulse space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="h-6 w-1/3 bg-surfaceSoft rounded-md" />
          <div className="h-6 w-8 bg-surfaceSoft rounded-full" />
        </div>
        <div className="h-20 w-full bg-surfaceSoft/50 rounded-xl" />
        <div className="h-20 w-full bg-surfaceSoft/50 rounded-xl" />
      </Card>
    );
  }

  const objetivosActivos = barreras.filter(
    (barrera) => barrera.estado !== "superada"
  );

  return (
    <Card hover className="relative overflow-hidden p-5 bg-surface/95 backdrop-blur-md border border-white/10 shadow-xl">
      {/* Ícono decorativo de agua en la esquina superior derecha */}
      <div className="absolute top-0 right-0 w-36 h-36 pointer-events-none overflow-hidden opacity-5">
        <Target className="absolute -top-4 -right-4 w-32 h-32 text-primary -rotate-12" />
      </div>

      <div className="relative z-10">
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-[0_0_12px_rgba(255,85,0,0.15)]">
              <Target className="w-5 h-5" />
            </div>
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
          <div className="p-6 rounded-xl border border-white/5 bg-surfaceSoft/30 text-center flex flex-col items-center justify-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-success/60" />
            <p className="text-xs text-muted font-medium">
              ¡Sin objetivos pendientes! Estás al día con tu plan.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {objetivosActivos.slice(0, 3).map((barrera) => (
              <div
                key={barrera.id}
                className="group p-3.5 rounded-xl border border-white/10 bg-surfaceSoft/40 hover:border-primary/30 hover:bg-surfaceSoft/70 transition-all duration-200 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-bold text-text group-hover:text-primary transition-colors flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-warning shrink-0" />
                    {barrera.nombre}
                  </p>

                  <Badge variant="warning" className="shrink-0">
                    En progreso
                  </Badge>
                </div>

                {barrera.objetivo && (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                      <Flag className="w-3 h-3 text-primary" />
                      Meta proyectada:
                    </span>
                    <span className="text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                      {barrera.objetivo}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}