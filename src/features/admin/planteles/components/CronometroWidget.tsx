import { useCronometro } from "../hooks/useCronometro";

export default function CronometroWidget() {
  const { activo, iniciar, pausar, reiniciar, formatearTiempo } = useCronometro();

  return (
    <div className="p-6 rounded-2xl bg-surfaceSoft shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-3.5 h-3.5 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted block font-semibold">
            Tiempo de Sesión
          </span>
          <span className="text-3xl font-mono font-black tracking-wider text-text">
            {formatearTiempo()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!activo ? (
          <button
            onClick={iniciar}
            className="h-10 px-6 text-xs font-bold rounded-xl bg-primary text-black hover:bg-primary/90 transition-all shadow-md shadow-primary/25"
          >
            ▶ Iniciar
          </button>
        ) : (
          <button
            onClick={pausar}
            className="h-10 px-6 text-xs font-bold rounded-xl bg-background text-text hover:bg-background/80 transition-all shadow-sm"
          >
            ⏸ Pausar
          </button>
        )}
        <button
          onClick={reiniciar}
          className="h-10 px-4 text-xs font-semibold text-muted hover:text-text transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}