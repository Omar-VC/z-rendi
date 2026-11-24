import { useEffect, useMemo, useRef, useState } from "react";
import type { SesionPendiente } from "../../../admin/seguimiento/types/sesionPendiente";
import type { EjercicioRealizado } from "../../../admin/seguimiento/types/registroEjercicio";
import type { EjercicioSesion } from "../../../admin/seguimiento/types/ejercicioSesion";
import type { RegistroEjercicio } from "../../../admin/seguimiento/types/registroEjercicio";
import { obtenerUltimosRegistros } from "../../../admin/seguimiento/services/registrosEjercicio.service";
import { Button } from "../../../../shared/ui";
import { Clock, Flame, Timer, Info, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { createPortal } from "react-dom";

type Props = {
  sesion: SesionPendiente;
  clienteId: string;
  preparadorId: string;
  onClose: () => void;
  onGuardar: (datos: {
    duracion: number;
    rpe: number;
    observaciones: string;
    duracionPlanificada?: number;
    ejerciciosRealizados?: EjercicioRealizado[];
  }) => Promise<void>;
};

type FilaSerie = { reps: string; peso: string; hecha: boolean };

type Item = {
  k: string;
  bloqueNombre: string;
  ejercicio: EjercicioSesion;
};

// Interpreta textos como "4 x 10", "3x8-10", "4×12". Si no puede, devuelve null.
function parsearPrescripcion(
  texto?: string,
): { series: number; reps: number } | null {
  if (!texto) return null;
  const m = texto.match(/(\d+)\s*[x×]\s*(\d+)/i);
  if (!m) return null;
  return { series: Number(m[1]), reps: Number(m[2]) };
}

const clave = (bloqueId: string, indice: number) => `${bloqueId}-${indice}`;

function filasIniciales(ejercicio: EjercicioSesion): FilaSerie[] {
  const parseado = parsearPrescripcion(ejercicio.repeticiones);
  const cantidad = Math.min(
    ejercicio.seriesObjetivo ?? parseado?.series ?? 1,
    10,
  );
  const reps = ejercicio.repsObjetivo ?? parseado?.reps;

  return Array.from({ length: Math.max(cantidad, 1) }, () => ({
    reps: reps ? String(reps) : "",
    peso: ejercicio.pesoSugerido != null ? String(ejercicio.pesoSugerido) : "",
    hecha: true,
  }));
}

const campo =
  "w-full h-14 rounded-xl bg-surfaceSoft border border-border text-text text-xl font-bold text-center focus:outline-none focus:border-primary";

export default function CompletarSesionModal({
  sesion,
  clienteId,
  onClose,
  onGuardar,
}: Props) {
  const [paso, setPaso] = useState(0);
  const [rpeSeleccionado, setRpeSeleccionado] = useState<number | null>(null);
  const [observaciones, setObservaciones] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [duracionTxt, setDuracionTxt] = useState("");
  const [ultimos, setUltimos] = useState<Record<string, RegistroEjercicio>>({});

  const cuerpoRef = useRef<HTMLDivElement>(null);

  const duracionPlanificada = sesion.bloques.reduce(
    (total, bloque) => total + bloque.duracion,
    0,
  );
  const duracionNum = Number(duracionTxt);
  const duracionParaCalculo =
    Number.isFinite(duracionNum) && duracionNum > 0
      ? duracionNum
      : duracionPlanificada;
  const carga = (rpeSeleccionado || 0) * duracionParaCalculo;

  // Lista plana de ejercicios, en orden
  const items: Item[] = useMemo(
    () =>
      sesion.bloques.flatMap((bloque) =>
        bloque.ejercicios.map((ejercicio, i) => ({
          k: clave(bloque.id, i),
          bloqueNombre: bloque.nombre,
          ejercicio,
        })),
      ),
    [sesion],
  );

  const ultimoPaso = items.length + 1;

  const [filas, setFilas] = useState<Record<string, FilaSerie[]>>(() => {
    const inicial: Record<string, FilaSerie[]> = {};
    sesion.bloques.forEach((bloque) =>
      bloque.ejercicios.forEach((ejercicio, i) => {
        inicial[clave(bloque.id, i)] = filasIniciales(ejercicio);
      }),
    );
    return inicial;
  });

  // Bloquea el scroll de la página de fondo mientras está abierto
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, []);

  // Al cambiar de paso, vuelve arriba
  useEffect(() => {
    cuerpoRef.current?.scrollTo({ top: 0 });
  }, [paso]);

  // Precarga el último peso usado en cada ejercicio (solo donde el peso está vacío)
  useEffect(() => {
    let activo = true;
    const ids = sesion.bloques.flatMap((b) =>
      b.ejercicios.map((e) => e.ejercicioId),
    );

    obtenerUltimosRegistros(clienteId, ids)
      .then((res) => {
        if (!activo) return;
        setUltimos(res);
        setFilas((prev) => {
          const next = { ...prev };
          sesion.bloques.forEach((bloque) =>
            bloque.ejercicios.forEach((ejercicio, i) => {
              const ultimo = res[ejercicio.ejercicioId];
              if (!ultimo) return;
              const k = clave(bloque.id, i);
              next[k] = (next[k] ?? []).map((fila) =>
                fila.peso === ""
                  ? { ...fila, peso: String(ultimo.mejorPeso) }
                  : fila,
              );
            }),
          );
          return next;
        });
      })
      .catch((e) => console.error("Error precargando pesos:", e));

    return () => {
      activo = false;
    };
  }, [clienteId, sesion.id, sesion.bloques]);

  function actualizarFila(k: string, idx: number, cambios: Partial<FilaSerie>) {
    setFilas((prev) => {
      const next = [...(prev[k] ?? [])];
      next[idx] = { ...next[idx], ...cambios };
      return { ...prev, [k]: next };
    });
  }

  function agregarFila(k: string) {
    setFilas((prev) => {
      const actuales = prev[k] ?? [];
      const ultima = actuales[actuales.length - 1];
      return {
        ...prev,
        [k]: [
          ...actuales,
          { reps: ultima?.reps ?? "", peso: ultima?.peso ?? "", hecha: true },
        ],
      };
    });
  }

  function quitarFila(k: string, idx: number) {
    setFilas((prev) => {
      const actuales = prev[k] ?? [];
      if (actuales.length <= 1) return prev;
      return { ...prev, [k]: actuales.filter((_, i) => i !== idx) };
    });
  }

  function seriesValidas(k: string) {
    return (filas[k] ?? [])
      .filter((f) => f.hecha && f.peso.trim() !== "")
      .map((f) => ({
        reps: Number(f.reps),
        peso: Number(f.peso.replace(",", ".")),
      }))
      .filter(
        (s) =>
          Number.isFinite(s.reps) && Number.isFinite(s.peso) && s.reps > 0,
      );
  }

  const registrados = items.filter((it) => seriesValidas(it.k).length > 0);
  const sinRegistrar = items.filter((it) => seriesValidas(it.k).length === 0);

  function cerrar() {
    if (
      paso > 0 &&
      !window.confirm("¿Salir? Se pierde lo que cargaste en esta sesión.")
    ) {
      return;
    }
    onClose();
  }

  function siguiente() {
    setPaso((p) => Math.min(p + 1, ultimoPaso));
  }

  function anterior() {
    setPaso((p) => Math.max(p - 1, 0));
  }

  async function handleGuardar() {
    if (!rpeSeleccionado) {
      alert("Elegí tu nivel de esfuerzo (RPE del 1 al 10).");
      return;
    }

    try {
      setGuardando(true);

      const ejerciciosRealizados: EjercicioRealizado[] = registrados.map(
        (it) => ({
          ejercicioId: it.ejercicio.ejercicioId,
          nombre: it.ejercicio.nombre,
          series: seriesValidas(it.k),
        }),
      );

      await onGuardar({
        duracion: duracionParaCalculo,
        rpe: rpeSeleccionado,
        observaciones,
        duracionPlanificada,
        ejerciciosRealizados,
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
    if (val <= 4) return "border-success/40 text-success";
    if (val <= 7) return "border-warning/40 text-warning";
    return "border-danger/40 text-danger";
  };

  const getRpeActiveBg = (val: number) => {
    if (val <= 4) return "bg-success text-black font-extrabold";
    if (val <= 7) return "bg-warning text-black font-extrabold";
    return "bg-danger text-white font-extrabold";
  };

  const progreso = (paso / ultimoPaso) * 100;
  const itemActual = paso >= 1 && paso <= items.length ? items[paso - 1] : null;

  return createPortal(
  <div className="fixed inset-0 z-[1000] h-dvh bg-background text-text flex flex-col">
      {/* CABECERA */}
      <header className="shrink-0 border-b border-white/10 bg-surface/95">
        <div className="mx-auto w-full max-w-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              {paso === 0
                ? "Tu sesión de hoy"
                : itemActual
                  ? `Ejercicio ${paso} de ${items.length}`
                  : "Último paso"}
            </p>
            <h1 className="text-lg font-black truncate">{sesion.libroNombre}</h1>
          </div>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className="h-11 w-11 shrink-0 rounded-xl bg-surfaceSoft border border-border flex items-center justify-center text-muted hover:text-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-1 bg-surfaceSoft">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </header>

      {/* CUERPO (único scroll) */}
      <div ref={cuerpoRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-xl px-4 py-5 space-y-5">
          {/* PASO 0: RESUMEN */}
          {paso === 0 && (
            <>
              <div className="space-y-1">
                <p className="text-sm text-muted capitalize">{fecha}</p>
                <p className="text-sm text-muted flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  {duracionPlanificada} min programados
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-surface p-4">
                <p className="text-xs uppercase tracking-wider font-semibold text-muted">
                  Objetivo
                </p>
                <p className="mt-1 text-base font-semibold">{sesion.objetivo}</p>
              </div>

              {sesion.observacionesPreparador && (
                <div className="rounded-2xl border-l-4 border-primary bg-primary/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    Indicaciones del coach
                  </p>
                  <p className="mt-1.5 text-base leading-relaxed whitespace-pre-line">
                    {sesion.observacionesPreparador}
                  </p>
                </div>
              )}

              {sesion.bloques.map((bloque, bi) => (
                <section key={bloque.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-wide text-primary">
                      {bi + 1}. {bloque.nombre}
                    </h2>
                    <span className="text-sm text-muted">
                      {bloque.duracion} min
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-surface divide-y divide-white/5">
                    {bloque.ejercicios.map((ej, i) => (
                      <div key={clave(bloque.id, i)} className="p-4 space-y-1.5">
                        <p className="text-lg font-bold">{ej.nombre}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-base">
                          {ej.repeticiones && (
                            <span className="flex items-center gap-1.5 text-primary font-bold">
                              <Flame className="w-4 h-4" />
                              {ej.repeticiones}
                            </span>
                          )}
                          {ej.pausa && (
                            <span className="flex items-center gap-1.5 text-muted">
                              <Timer className="w-4 h-4 text-warning" />
                              Pausa {ej.pausa}
                            </span>
                          )}
                        </div>
                        {ej.indicaciones && (
                          <p className="flex items-start gap-1.5 text-sm text-warning/90 italic">
                            <Info className="w-4 h-4 shrink-0 mt-0.5" />
                            {ej.indicaciones}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}

          {/* PASOS 1..N: UN EJERCICIO POR PANTALLA */}
          {itemActual && (
            <>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  {itemActual.bloqueNombre}
                </p>
                <h2 className="text-3xl font-black leading-tight">
                  {itemActual.ejercicio.nombre}
                </h2>

                <div className="flex flex-wrap gap-2 pt-1">
                  {itemActual.ejercicio.repeticiones && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface border border-white/10 px-3 py-1.5 text-base">
                      <Flame className="w-4 h-4 text-primary" />
                      <span className="text-muted">Plan</span>
                      <strong className="text-primary">
                        {itemActual.ejercicio.repeticiones}
                      </strong>
                    </span>
                  )}
                  {itemActual.ejercicio.pausa && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface border border-white/10 px-3 py-1.5 text-base">
                      <Timer className="w-4 h-4 text-warning" />
                      <span className="text-muted">Pausa</span>
                      <strong>{itemActual.ejercicio.pausa}</strong>
                    </span>
                  )}
                </div>

                {ultimos[itemActual.ejercicio.ejercicioId] && (
                  <p className="text-sm text-muted">
                    Última vez: mejor serie{" "}
                    <strong className="text-text">
                      {ultimos[itemActual.ejercicio.ejercicioId].mejorPeso} kg
                    </strong>
                  </p>
                )}

                {itemActual.ejercicio.indicaciones && (
                  <p className="flex items-start gap-2 rounded-xl bg-warning/10 border border-warning/20 p-3 text-base text-warning/90 italic">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    {itemActual.ejercicio.indicaciones}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-[2rem_1fr_1fr_3.5rem] gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                  <span>#</span>
                  <span className="text-center">Reps</span>
                  <span className="text-center">Peso (kg)</span>
                  <span className="text-center">Hecha</span>
                </div>

                {(filas[itemActual.k] ?? []).map((fila, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-[2rem_1fr_1fr_3.5rem] gap-2 items-center ${
                      fila.hecha ? "" : "opacity-40"
                    }`}
                  >
                    <span className="text-lg font-black text-muted">
                      {idx + 1}
                    </span>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="0"
                      value={fila.reps}
                      onChange={(e) =>
                        actualizarFila(itemActual.k, idx, {
                          reps: e.target.value,
                        })
                      }
                      className={campo}
                    />
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="0"
                      value={fila.peso}
                      onChange={(e) =>
                        actualizarFila(itemActual.k, idx, {
                          peso: e.target.value,
                        })
                      }
                      className={campo}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        actualizarFila(itemActual.k, idx, {
                          hecha: !fila.hecha,
                        })
                      }
                      aria-label={fila.hecha ? "Marcar como no hecha" : "Marcar como hecha"}
                      className={`h-14 w-14 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
                        fila.hecha
                          ? "bg-primary border-primary text-black"
                          : "bg-surfaceSoft border-border text-muted"
                      }`}
                    >
                      <Check className="w-7 h-7" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => agregarFila(itemActual.k)}
                    className="h-12 px-4 rounded-xl border border-primary/40 text-primary font-bold text-base active:scale-95"
                  >
                    + Agregar serie
                  </button>

                  {(filas[itemActual.k] ?? []).length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        quitarFila(
                          itemActual.k,
                          (filas[itemActual.k] ?? []).length - 1,
                        )
                      }
                      className="h-12 px-4 rounded-xl text-muted text-base font-semibold"
                    >
                      Quitar última
                    </button>
                  )}
                </div>

                <p className="text-sm text-muted pt-1">
                  Destildá las series que no hiciste. Para ejercicios sin peso,
                  escribí 0.
                </p>
              </div>
            </>
          )}

          {/* ÚLTIMO PASO: CIERRE */}
          {paso === ultimoPaso && (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-black">¿Cómo estuvo?</h2>
                <p className="text-base text-muted">
                  1 = muy fácil · 10 = esfuerzo máximo
                </p>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const activo = rpeSeleccionado === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRpeSeleccionado(num)}
                      className={`h-14 rounded-xl border text-lg font-bold transition-all active:scale-95 ${
                        activo ? getRpeActiveBg(num) : getRpeColor(num)
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  Duración real (minutos)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={duracionTxt}
                  placeholder={String(duracionPlanificada)}
                  onChange={(e) => setDuracionTxt(e.target.value)}
                  className={campo}
                />
                <p className="text-sm text-muted">
                  Si lo dejás vacío se usa la duración programada (
                  {duracionPlanificada} min).
                </p>
              </div>

              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">
                    Carga de entrenamiento
                  </p>
                  <p className="text-sm text-muted">
                    {duracionParaCalculo} min × RPE {rpeSeleccionado || 0}
                  </p>
                </div>
                <p className="text-3xl font-black text-primary">
                  {carga}{" "}
                  <span className="text-sm text-muted font-normal">UA</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">
                  Comentarios (opcional)
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="¿Cómo te sentiste? ¿Molestias o buenas sensaciones?"
                  rows={3}
                  className="w-full rounded-xl bg-surfaceSoft border border-border text-text text-base p-3 focus:outline-none focus:border-primary"
                />
              </div>

              {items.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-surface p-4 space-y-1">
                  <p className="text-sm font-bold">
                    Registraste {registrados.length} de {items.length}{" "}
                    ejercicios
                  </p>
                  {sinRegistrar.length > 0 && (
                    <p className="text-sm text-warning">
                      Sin peso cargado:{" "}
                      {sinRegistrar.map((i) => i.ejercicio.nombre).join(", ")}.
                      Esos no quedan en tu historial de pesos.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* PIE FIJO */}
      <footer className="shrink-0 border-t border-white/10 bg-surface/95 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full max-w-xl px-4 pt-3 flex items-center gap-3">
          {paso === 0 ? (
            <>
              <Button
                variant="secondary"
                onClick={cerrar}
                className="!h-14 px-5 text-base"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => setPaso(items.length > 0 ? 1 : ultimoPaso)}
                className="flex-1 !h-14 text-base font-bold"
              >
                Empezar a registrar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={anterior}
                disabled={guardando}
                className="!h-14 px-5 text-base flex items-center gap-1"
              >
                <ChevronLeft className="w-5 h-5" />
                Anterior
              </Button>

              {paso < ultimoPaso ? (
                <Button
                  variant="primary"
                  onClick={siguiente}
                  className="flex-1 !h-14 text-base font-bold flex items-center justify-center gap-1"
                >
                  {paso === items.length ? "Terminar" : "Siguiente"}
                  <ChevronRight className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleGuardar}
                  disabled={guardando || !rpeSeleccionado}
                  className="flex-1 !h-14 text-base font-bold"
                >
                  {guardando ? "Guardando..." : "Finalizar sesión"}
                </Button>
              )}
            </>
          )}
        </div>
      </footer>
    </div>,
    document.body,
  );
}
