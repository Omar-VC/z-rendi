import { useBarreras } from "../hooks/useBarreras";
import { Card, Badge } from "../../../../shared/ui";

type Props = {
  clienteId: string;
};

export default function IndicadoresPanel({ clienteId }: Props) {
  const { barreras, loading } = useBarreras(clienteId);

  function obtenerIndicador(categoria: string) {
    return barreras.find(
      (b) => b.categoria === categoria && b.estado === "superada",
    );
  }

  const indicadores = [
    {
      titulo: "Fuerza Superior",
      icono: "💪",
      categoria: "Fuerza",
    },
    {
      titulo: "Fuerza Inferior",
      icono: "🦵",
      categoria: "Fuerza Inferior",
    },
    {
      titulo: "Velocidad",
      icono: "⚡",
      categoria: "Velocidad",
    },
    {
      titulo: "Resistencia",
      icono: "🏃",
      categoria: "Resistencia",
    },
    {
      titulo: "Potencia",
      icono: "🦘",
      categoria: "Potencia",
    },
  ];

  if (loading) {
    return (
      <Card className="!p-5 bg-surfaceSoft/40 border-border/40 rounded-xl space-y-4 text-left">
        <div className="h-4 w-40 bg-surfaceSoft animate-pulse rounded" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-24 bg-surfaceSoft/60 animate-pulse rounded-xl border border-border/30"
            />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="!p-5 bg-surfaceSoft/40 border-border/40 rounded-xl space-y-4 text-left">
      {/* ENCABEZADO DE LA SECCIÓN */}
      <div className="flex items-center justify-between gap-2 border-b border-border/30 pb-3">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-text">
            Indicadores de Rendimiento Físico
          </h3>
          <p className="text-[11px] text-muted font-medium mt-0.5">
            Marcas máximas registradas por categoría en pruebas superadas
          </p>
        </div>
      </div>

      {/* GRID DE INDICADORES */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {indicadores.map((item) => {
          const indicador = obtenerIndicador(item.categoria);

          return (
            <div
              key={item.titulo}
              className={`p-3.5 rounded-xl border transition-all ${
                indicador
                  ? "bg-surface/80 border-border/60 shadow-sm"
                  : "bg-surfaceSoft/20 border-border/30 opacity-70"
              }`}
            >
              {/* TITULO E ICONO */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-text flex items-center gap-1.5">
                  <span className="text-sm">{item.icono}</span> {item.titulo}
                </span>

                <Badge
                  variant={indicador ? "success" : "neutral"}
                  className="text-[9px] px-1.5 py-0.5 font-mono uppercase"
                >
                  {indicador ? "Registrado" : "Pendiente"}
                </Badge>
              </div>

              {/* CONTENIDO DEL INDICADOR */}
              {indicador ? (
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-muted truncate">
                    {indicador.nombre}
                  </p>

                  <div className="text-base font-extrabold text-accent font-mono tracking-tight">
                    {indicador.resultado}{" "}
                    <span className="text-xs font-medium text-muted font-sans">
                      {indicador.unidad}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-2 text-center">
                  <p className="text-[11px] text-muted/70 font-medium italic">
                    Sin indicador registrado
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}