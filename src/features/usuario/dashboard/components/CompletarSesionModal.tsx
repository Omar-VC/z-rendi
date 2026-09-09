import { useState } from "react";
import type { SesionPendiente } from "../../../admin/seguimiento/types/sesionPendiente";
import { Modal, Textarea, Button, Label } from "../../../../shared/ui";

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

  // Ayudante de color según nivel de RPE
  const getRpeColor = (val: number) => {
    if (val <= 4) return "border-success/40 text-success hover:bg-success/20";
    if (val <= 7) return "border-warning/40 text-warning hover:bg-warning/20";
    return "border-danger/40 text-danger hover:bg-danger/20";
  };

  const getRpeActiveBg = (val: number) => {
    if (val <= 4) return "bg-success text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)]";
    if (val <= 7) return "bg-warning text-black font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.4)]";
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
        <div className="rounded-xl border border-border bg-surfaceSoft/30 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {fecha}
          </p>
          <h2 className="text-xl font-extrabold text-text">
            {sesion.libroNombre}
          </h2>
          <p className="text-sm text-muted">
            <span className="font-semibold text-text">Objetivo:</span> {sesion.objetivo}
          </p>
          <div className="pt-2 flex items-center justify-between border-t border-border/50 text-xs text-muted">
            <span>Duración calculada:</span>
            <span className="text-sm font-bold text-text">{duracionTotal} min</span>
          </div>
        </div>

        {/* DETALLE DE BLOQUES Y EJERCICIOS */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
            Estructura de la Sesión
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {sesion.bloques.map((bloque, bloqueIndex) => (
              <div
                key={bloque.id}
                className="rounded-xl border border-border bg-surface p-3.5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">
                    BLOQUE {bloqueIndex + 1}: {bloque.nombre}
                  </span>
                  <span className="text-xs font-semibold text-muted bg-surfaceSoft px-2.5 py-1 rounded-md">
                    {bloque.duracion} min
                  </span>
                </div>

                <div className="space-y-2">
                  {bloque.ejercicios.map((ejercicio, ejIndex) => (
                    <div
                      key={`${bloque.id}-${ejercicio.ejercicioId}-${ejIndex}`}
                      className="rounded-lg bg-surfaceSoft/40 p-2.5 border border-white/5 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                          {ejIndex + 1}
                        </span>
                        <p className="text-xs font-bold text-text">
                          {ejercicio.nombre}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted pl-7">
                        {ejercicio.repeticiones && (
                          <span>Reps: <strong className="text-text">{ejercicio.repeticiones}</strong></span>
                        )}
                        {ejercicio.pausa && (
                          <span>Pausa: <strong className="text-text">{ejercicio.pausa}</strong></span>
                        )}
                      </div>

                      {ejercicio.indicaciones && (
                        <p className="pl-7 text-[11px] text-muted italic">
                          "{ejercicio.indicaciones}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SELECTOR DE RPE TÁCTIL (1 a 10) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold text-text">Percepción de Esfuerzo (RPE)</Label>
            {rpeSeleccionado && (
              <span className="text-xs font-bold text-primary animate-fadeIn">
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
        <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-surface to-primary/10 p-4 flex items-center justify-between shadow-[0_0_20px_rgba(255,85,0,0.1)]">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Carga de Entrenamiento ($sRPE$)
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
          <Label className="text-xs font-bold text-text">Observaciones / Feedback</Label>
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