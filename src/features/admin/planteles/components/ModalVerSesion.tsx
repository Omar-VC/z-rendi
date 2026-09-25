import type { SesionEntrenamiento } from "../types/plantel";

interface Props {
  sesion: SesionEntrenamiento | null;
  onClose: () => void;
}

export default function ModalVerSesion({ sesion, onClose }: Props) {
  if (!sesion) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surfaceSoft border border-background/80 w-full max-w-lg rounded-2xl p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
        {/* HEADER MODAL */}
        <div className="flex items-start justify-between border-b border-background/60 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-primary">
              {sesion.microciclo || "Sesión Registrada"} • {sesion.fecha}
            </span>
            <h3 className="text-base font-bold text-text">{sesion.objetivo}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-text text-sm p-1"
          >
            ✕
          </button>
        </div>

        {/* DETALLE Y BLOQUES DE LA SESIÓN */}
        <div className="overflow-y-auto space-y-3 flex-1 pr-1">
          <div className="flex items-center justify-between text-xs text-muted font-mono bg-background/50 p-2 rounded-xl">
            <span>⏱️ Duración total:</span>
            <span className="font-bold text-text">{sesion.duracionTotalMinutos} min</span>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-muted font-semibold">
              Bloques Trabajados ({sesion.bloques?.length || 0})
            </span>

            {sesion.bloques?.length === 0 ? (
              <p className="text-xs text-muted italic">Sin bloques registrados.</p>
            ) : (
              sesion.bloques?.map((b, i) => (
                <div key={i} className="p-3 rounded-xl bg-background/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold uppercase text-primary">{b.categoria.replace("_", " ")}</span>
                    <span className="text-muted">{b.duracionMinutos} min</span>
                  </div>
                  <h4 className="text-xs font-bold text-text">{b.titulo}</h4>
                  {b.descripcion && (
                    <p className="text-[11px] text-muted whitespace-pre-line">{b.descripcion}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="w-full h-10 text-xs font-bold rounded-xl bg-background text-text hover:bg-background/80 transition-all active:scale-95"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}