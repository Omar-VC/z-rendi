import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";
import { useAuth } from "../../../../auth/useAuth";
import { useAsistencia } from "../../../admin/asistencia/hooks/useAsistencia";

export default function AsistenciaCard() {
  const { user, usuario } = useAuth();

  const { porcentaje, presentes, cargando } = useAsistencia(
    user?.uid,
    usuario?.frecuenciaSemanal
  );

  if (cargando) {
    return (
      <Card className="animate-pulse space-y-4">
        <div className="h-6 w-1/3 bg-surfaceSoft rounded-md" />
        <div className="h-12 w-1/2 bg-surfaceSoft/60 rounded-lg" />
        <div className="h-3 w-full bg-surfaceSoft/40 rounded-full" />
      </Card>
    );
  }

  // Selección de dinamismo según rendimiento
  const getProgressColor = (pct: number) => {
    if (pct >= 90) return "bg-success shadow-[0_0_12px_rgba(16,185,129,0.4)]";
    if (pct >= 70) return "bg-warning shadow-[0_0_12px_rgba(245,158,11,0.4)]";
    return "bg-danger shadow-[0_0_12px_rgba(239,68,68,0.4)]";
  };

  const getBadgeVariant = (pct: number) => {
    if (pct >= 90) return "success";
    if (pct >= 70) return "warning";
    return "danger";
  };

  return (
    <Card hover className="relative overflow-hidden">
      {/* Luz ambiental difusa */}
      <div className="absolute -top-10 -left-10 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      {/* ENCABEZADO */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-xs">
            📅
          </span>
          <h3 className="text-lg font-bold text-text tracking-tight">
            Asistencia & Adherencia
          </h3>
        </div>

        <span className="text-xs font-semibold text-muted bg-surfaceSoft px-2.5 py-1 rounded-md">
          Este mes
        </span>
      </div>

      {/* MÉTRICA PRINCIPAL */}
      <div className="mt-5 flex items-baseline justify-between">
        <div>
          <p className="text-4xl font-black text-text tracking-tight">
            {porcentaje}%
          </p>
          <p className="mt-1 text-xs text-muted font-medium">
            <strong className="text-text font-bold">{presentes}</strong> entrenamientos realizados
          </p>
        </div>

        <Badge variant={getBadgeVariant(porcentaje)}>
          {porcentaje >= 90 ? "Alta Constancia" : porcentaje >= 70 ? "Regular" : "Atención"}
        </Badge>
      </div>

      {/* BARRA DE PROGRESO */}
      <div className="mt-4">
        <div className="h-2.5 w-full rounded-full bg-surfaceSoft/60 p-0.5 overflow-hidden border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(
              porcentaje
            )}`}
            style={{
              width: `${Math.min(porcentaje, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* FEEDBACK AUTOMÁTICO */}
      <div className="mt-4 p-2.5 rounded-xl border border-border/40 bg-surfaceSoft/20 flex items-center gap-2">
        <span className="text-xs">
          {porcentaje >= 90 ? "💪" : porcentaje >= 70 ? "⚡" : "🎯"}
        </span>
        <p className="text-xs font-semibold text-text/90">
          {porcentaje >= 90
            ? "¡Excelente constancia! Estás cumpliendo el plan."
            : porcentaje >= 70
            ? "Buen ritmo, mantené la regularidad."
            : "Seguí trabajando para recuperar el ritmo proyectado."}
        </p>
      </div>
    </Card>
  );
}