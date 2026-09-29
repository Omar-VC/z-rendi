import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";
import { useAuth } from "../../../../auth/useAuth";
import { useBarreras } from "../../../admin/seguimiento/hooks/useBarreras";
import { TrendingUp, ArrowRight, Activity, Award } from "lucide-react";

export default function ProgresoCard() {
  const { user } = useAuth();
  const { barreras, loading } = useBarreras(user?.uid ?? "");

  if (loading) {
    return (
      <Card className="animate-pulse space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="h-6 w-1/3 bg-surfaceSoft rounded-md" />
          <div className="h-6 w-16 bg-surfaceSoft rounded-full" />
        </div>
        <div className="h-16 w-full bg-surfaceSoft/50 rounded-xl" />
        <div className="h-16 w-full bg-surfaceSoft/50 rounded-xl" />
      </Card>
    );
  }

  const conHistorial = barreras.filter(
    (barrera) => barrera.historial && barrera.historial.length > 0
  );

  return (
    <Card hover className="relative overflow-hidden p-5 bg-surface/95 backdrop-blur-md border border-white/10 shadow-xl">
      {/* Luz ambiental difusa */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Ícono decorativo de agua en la esquina superior derecha */}
      <div className="absolute top-0 right-0 w-36 h-36 pointer-events-none overflow-hidden opacity-5">
        <TrendingUp className="absolute -top-4 -right-4 w-32 h-32 text-primary -rotate-12" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-[0_0_12px_rgba(255,85,0,0.15)]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-text tracking-tight">
              Evolución & Pruebas
            </h3>
          </div>

          <Badge variant="info">
            {conHistorial.length} {conHistorial.length === 1 ? "prueba" : "pruebas"}
          </Badge>
        </div>

        {/* CONTENIDO */}
        {conHistorial.length === 0 ? (
          <div className="p-6 rounded-xl border border-white/5 bg-surfaceSoft/30 text-center flex flex-col items-center justify-center space-y-2">
            <Activity className="w-8 h-8 text-muted/50" />
            <p className="text-xs text-muted font-medium">
              Sin evaluaciones o pruebas registradas aún.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conHistorial.slice(0, 3).map((barrera) => {
              const historial = barrera.historial!;
              const primero = historial[0];
              const ultimo = historial[historial.length - 1];
              const tieneEvolucion = historial.length > 1;

              return (
                <div
                  key={barrera.id}
                  className="group p-3.5 rounded-xl border border-white/10 bg-surfaceSoft/40 hover:border-primary/30 hover:bg-surfaceSoft/70 transition-all duration-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-text group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-primary/80 shrink-0" />
                      {barrera.nombre}
                    </p>
                  </div>

                  {tieneEvolucion ? (
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      {/* Valor Inicial */}
                      <div className="text-left">
                        <span className="block text-[10px] font-semibold text-muted uppercase tracking-wider">
                          Inicial
                        </span>
                        <span className="text-xs font-bold text-text/70">
                          {primero.resultado}
                        </span>
                      </div>

                      {/* Flecha indicadora */}
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 border border-primary/20 text-primary shadow-[0_0_10px_rgba(255,85,0,0.2)]">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>

                      {/* Valor Actual */}
                      <div className="text-right">
                        <span className="block text-[10px] font-bold text-primary uppercase tracking-wider">
                          Actual
                        </span>
                        <span className="text-sm font-black text-primary">
                          {ultimo.resultado}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[11px] font-medium text-muted">
                        Marca actual:
                      </span>
                      <span className="text-sm font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                        {ultimo.resultado}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}