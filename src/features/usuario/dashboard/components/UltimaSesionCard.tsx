import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";
import { useAuth } from "../../../../auth/useAuth";
import { useUltimaSesion } from "../hooks/useUltimaSesion";

export default function UltimaSesionCard() {
  const { user } = useAuth();
  const { sesion: ultimaSesion, loading } = useUltimaSesion(user?.uid);

  // Skeleton de carga
  if (loading) {
    return (
      <Card className="animate-pulse space-y-4">
        <div className="h-6 w-1/2 bg-surfaceSoft rounded-md" />
        <div className="h-4 w-1/3 bg-surfaceSoft/60 rounded-md" />
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-16 bg-surfaceSoft/40 rounded-xl" />
          <div className="h-16 bg-surfaceSoft/40 rounded-xl" />
        </div>
      </Card>
    );
  }

  // Estado sin registros
  if (!ultimaSesion) {
    return (
      <Card hover className="relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-xs">
            🏋️
          </span>
          <h3 className="text-lg font-bold text-text tracking-tight">
            Último Entrenamiento
          </h3>
        </div>
        <div className="p-4 rounded-xl border border-border/50 bg-surfaceSoft/20 text-center">
          <p className="text-xs text-muted font-medium">
            Todavía no registradas sesiones completadas.
          </p>
        </div>
      </Card>
    );
  }

  const ejercicios = ultimaSesion.ejercicios ?? [];
  const rpeCalculado = ultimaSesion.duracion > 0 
    ? Math.round(ultimaSesion.carga / ultimaSesion.duracion) 
    : null;

  return (
    <Card hover className="relative overflow-hidden">
      {/* Luz ambiental difusa */}
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      {/* ENCABEZADO */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-xs">
            🏋️
          </span>
          <h3 className="text-lg font-bold text-text tracking-tight">
            Último Entrenamiento
          </h3>
        </div>

        <Badge variant="success">Completado</Badge>
      </div>

      {/* DETALLES PRINCIPALES */}
      <div className="mt-4">
        <h4 className="text-base font-extrabold text-text tracking-tight">
          {ultimaSesion.libroNombre}
        </h4>
        <p className="text-xs text-muted capitalize">
          {ultimaSesion.fecha.toLocaleDateString("es-AR", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </p>
      </div>

      {/* TAGS DE EJERCICIOS */}
      {ejercicios.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">
            Ejercicios ejecutados
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ejercicios.slice(0, 4).map((ejercicio, index) => (
              <span
                key={`${ejercicio}-${index}`}
                className="px-2.5 py-1 rounded-lg bg-surfaceSoft/60 border border-border/60 text-xs font-semibold text-text"
              >
                {ejercicio}
              </span>
            ))}
            {ejercicios.length > 4 && (
              <span className="px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                +{ejercicios.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      {/* MÉTRICAS DE DESEMPEÑO */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {/* DURACIÓN Y RPE ESTIMADO */}
        <div className="rounded-xl bg-surfaceSoft/40 border border-border/60 p-3 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Tiempo & RPE
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-black text-text">
              {ultimaSesion.duracion} <span className="text-xs font-normal text-muted">min</span>
            </span>
            {rpeCalculado && (
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-surface border border-white/10 text-primary">
                RPE {rpeCalculado}
              </span>
            )}
          </div>
        </div>

        {/* CARGA TOTAL */}
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 flex flex-col justify-between shadow-[0_0_15px_rgba(255,85,0,0.05)]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Carga ($sRPE$)
          </span>
          <span className="mt-1 text-lg font-black text-primary">
            {ultimaSesion.carga} <span className="text-xs font-normal text-muted">UA</span>
          </span>
        </div>
      </div>

      {/* OBSERVACIONES DEL ATLETA */}
      {ultimaSesion.observaciones && (
        <div className="mt-4 p-3 rounded-xl border border-white/5 bg-surfaceSoft/20">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Feedback registrado
          </p>
          <p className="mt-1 text-xs text-text italic line-clamp-2">
            "{ultimaSesion.observaciones}"
          </p>
        </div>
      )}
    </Card>
  );
}