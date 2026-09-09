import BarrerasPanel from "./BarrerasPanel";
import IndicadoresPanel from "./IndicadoresPanel";

type Props = {
  clienteId: string;
};

export default function ProgresionPanel({ clienteId }: Props) {
  return (
    <div className="space-y-6 text-left">
      {/* ENCABEZADO DE SECCIÓN CON ACENTO VISUAL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-5 bg-accent rounded-full shadow-[0_0_8px_rgba(255,85,0,0.4)]" />
            <h2 className="text-lg font-extrabold text-text tracking-tight">
              Evolución y Progresión
            </h2>
          </div>
          <p className="text-xs text-muted font-medium mt-1 pl-4">
            Monitoreo continuo de barreras superadas e indicadores métricos del atleta
          </p>
        </div>
      </div>

      {/* CONTENEDORES DE PANELES */}
      <div className="space-y-6">
        <BarrerasPanel clienteId={clienteId} />
        <IndicadoresPanel clienteId={clienteId} />
      </div>
    </div>
  );
}