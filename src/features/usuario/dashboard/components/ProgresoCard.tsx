import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";

import { useAuth } from "../../../../auth/useAuth";
import { useBarreras } from "../../../admin/seguimiento/hooks/useBarreras";

export default function ProgresoCard() {
  const { user } = useAuth();
  const { barreras, loading } = useBarreras(user?.uid ?? "");

  if (loading) {
    return (
      <Card className="animate-pulse space-y-4">
        <div className="h-6 w-1/3 bg-surfaceSoft rounded-md" />
        <div className="h-16 w-full bg-surfaceSoft/50 rounded-xl" />
        <div className="h-16 w-full bg-surfaceSoft/50 rounded-xl" />
      </Card>
    );
  }

  const conHistorial = barreras.filter(
    (barrera) => barrera.historial && barrera.historial.length > 0
  );

  return (
    <Card hover className="relative overflow-hidden">
      {/* Luz ambiental difusa */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-xs">
            📈
          </span>
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
        <div className="p-4 rounded-xl border border-border/50 bg-surfaceSoft/20 text-center">
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
                className="p-3.5 rounded-xl border border-border/60 bg-surfaceSoft/30 hover:border-white/10 transition-colors"
              >
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                  {barrera.nombre}
                </p>

                {tieneEvolucion ? (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    {/* Valor Inicial */}
                    <div className="text-left">
                      <span className="block text-[10px] text-muted">Inicial</span>
                      <span className="text-sm font-bold text-text/80">
                        {primero.resultado}
                      </span>
                    </div>

                    {/* Flecha con resplandor */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-black text-xs shadow-[0_0_10px_rgba(255,85,0,0.2)]">
                      →
                    </div>

                    {/* Valor Actual */}
                    <div className="text-right">
                      <span className="block text-[10px] text-primary font-semibold">Actual</span>
                      <span className="text-base font-extrabold text-primary">
                        {ultimo.resultado}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className="text-xs text-muted">Marca actual:</span>
                    <span className="text-base font-extrabold text-primary">
                      {ultimo.resultado}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}