import { useState } from "react";
import type { SesionPendiente } from "../../../admin/seguimiento/types/sesionPendiente";
import { Modal, Textarea, Button, Label } from "../../../../shared/ui";
import {
  Clock,
  Flame,
  Dumbbell,
  Timer,
  MessageSquare,
  CheckCircle2,
  Info,
} from "lucide-react";

type Props = {
  sesion: SesionPendiente;
  onClose: () => void;
  onGuardar: (datos: {
    duracion: number;
    rpe: number;
    observaciones: string;
  }) => Promise<void>;
};

export default function CompletarSesionModal({
  sesion,
  onClose,
  onGuardar,
}: Props) {
  const [rpeSeleccionado, setRpeSeleccionado] = useState<number | null>(null);
  const [observaciones, setObservaciones] = useState("");
  const [guardando, setGuardando] = useState(false);

  const duracionTotal = sesion.bloques.reduce(
    (total, bloque) => total + bloque.duracion,
    0
  );

  const carga = (rpeSeleccionado || 0) * duracionTotal;

  async function handleGuardar() {
    if (!rpeSeleccionado) {
      alert("Por favor selecciona un nivel de RPE (1 al 10).");
      return;
    }

    try {
      setGuardando(true);
      await onGuardar({
        duracion: duracionTotal,
        rpe: rpeSeleccionado,
        observaciones,
      });
    } catch (error) {
      console.error(error);
      alert("No se pudo completar la sesión.");
    } finally {
      setGuardando(false);
    }
  }

  const fecha = sesion.fecha.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const getRpeColor = (val: number) => {
    if (val <= 4) return "border-success/40 text-success hover:bg-success/20";
    if (val <= 7) return "border-warning/40 text-warning hover:bg-warning/20";
    return "border-danger/40 text-danger hover:bg-danger/20";
  };

  const getRpeActiveBg = (val: number) => {
    if (val <= 4)
      return "bg-success text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)]";
    if (val <= 7)
      return "bg-warning text-black font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.4)]";
    return "bg-danger text-white font-extrabold shadow-[0_0_15px_rgba(239,68,68,0.4)]";
  };

  return (
    <Modal
      title="Registro de Entrenamiento"
      onClose={onClose}
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={guardando}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={handleGuardar}
            disabled={guardando || !rpeSeleccionado}
            className="px-6 shadow-[0_0_20px_rgba(255,85,0,0.3)]"
          >
            {guardando ? "Guardando..." : "Finalizar sesión"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* INFORMACIÓN GENERAL */}
        <div className="rounded-xl border border-white/10 bg-surface/90 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-primary  flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {fecha}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-text bg-surfaceSoft px-2.5 py-1 rounded-md border border-white/5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {duracionTotal} min
            </span>
          </div>

          <h2 className="text-xl font-black text-text tracking-tight">
            {sesion.libroNombre}
          </h2>

          <p className="text-xs text-muted leading-relaxed">
            <strong className="text-text font-semibold">Objetivo:</strong>{" "}
            {sesion.objetivo}
          </p>
        </div>

        {/* DETALLE DE BLOQUES Y EJERCICIOS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-primary" />
              Estructura de la Sesión
            </h3>
            <span className="text-[11px] text-muted font-medium">
              {sesion.bloques.length} bloque(s)
            </span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            {sesion.bloques.map((bloque, bloqueIndex) => (
              <div
                key={bloque.id}
                className="rounded-xl border border-white/10 bg-surface p-4 space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-black text-primary tracking-wide uppercase flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/20 text-[10px] font-bold text-primary">
                      {bloqueIndex + 1}
                    </span>
                    {bloque.nombre}
                  </span>
                  <span className="text-[11px] font-semibold text-muted bg-surfaceSoft/80 px-2 py-0.5 rounded border border-white/5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted" />
                    {bloque.duracion} min
                  </span>
                </div>

                <div className="space-y-2.5">
                  {bloque.ejercicios.map((ejercicio, ejIndex) => (
                    <div
                      key={`${bloque.id}-${ejercicio.ejercicioId}-${ejIndex}`}
                      className="rounded-lg bg-surfaceSoft/50 p-3 border border-white/5 space-y-2 transition-colors hover:border-primary/20"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-text flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {ejercicio.nombre}
                        </p>
                      </div>

                      {/* DATOS DE REPETICIONES Y PAUSA EN CÁPSULAS DESTACADAS */}
                      <div className="flex flex-wrap gap-2 text-xs pt-1">
                        {ejercicio.repeticiones && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface border border-white/10 text-text font-medium">
                            <Flame className="w-3.5 h-3.5 text-primary" />
                            <span className="text-muted text-[11px]">Reps:</span>
                            <strong className="text-primary font-bold">
                              {ejercicio.repeticiones}
                            </strong>
                          </div>
                        )}

                        {ejercicio.pausa && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface border border-white/10 text-text font-medium">
                            <Timer className="w-3.5 h-3.5 text-warning" />
                            <span className="text-muted text-[11px]">Pausa:</span>
                            <strong className="text-text font-bold">
                              {ejercicio.pausa}
                            </strong>
                          </div>
                        )}
                      </div>

                      {/* INDICACIONES DEL COACH */}
                      {ejercicio.indicaciones && (
                        <div className="flex items-start gap-1.5 pt-1 text-[11px] text-warning/90 italic">
                          <Info className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                          <span>"{ejercicio.indicaciones}"</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SELECTOR DE RPE TÁCTIL (1 a 10) */}
        <div className="space-y-2.5 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold text-text flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Percepción de Esfuerzo (RPE)
            </Label>
            {rpeSeleccionado && (
              <span className="text-xs font-bold text-primary animate-fadeIn bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                RPE {rpeSeleccionado} Seleccionado
              </span>
            )}
          </div>
          <p className="text-xs text-muted">
            1 = Muy fácil / Recuperativo · 10 = Esfuerzo Máximo
          </p>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const isSelected = rpeSeleccionado === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRpeSeleccionado(num)}
                  className={`
                    h-11 rounded-lg border text-sm font-bold transition-all duration-150 active:scale-95
                    ${isSelected ? getRpeActiveBg(num) : getRpeColor(num)}
                  `}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* MÉTRICA DE CARGA GENERADA */}
        <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-surface via-surface to-primary/10 p-4 flex items-center justify-between shadow-[0_0_20px_rgba(255,85,0,0.1)]">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Carga de Entrenamiento (sRPE)
            </p>
            <p className="text-[11px] text-muted">
              {duracionTotal} min × RPE {rpeSeleccionado || 0}
            </p>
          </div>
          <p className="text-3xl font-black text-primary tracking-tight">
            {carga} <span className="text-xs text-muted font-normal">UA</span>
          </p>
        </div>

        {/* OBSERVACIONES DEL ATLETA */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-text flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            Observaciones / Feedback
          </Label>
          <Textarea
            placeholder="¿Cómo te sentiste? ¿Molestias o buenas sensaciones?"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="text-sm bg-surfaceSoft/40 border-border focus:border-primary/50"
          />
        </div>
      </div>
    </Modal>
  );
}