import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../../../auth/useAuth";
import { useTrainingBooks } from "../../biblioteca/libros/hooks/useTrainingBooks";
import { useExercises } from "../../biblioteca/ejercicios/hooks/useExercises";
import {
  crearSesionPendiente,
  obtenerUltimasSesionesCliente,
} from "../services/sesionesPendientes.service";

import type { BloqueSesion } from "../types/bloqueSesion";
import type { EjercicioSesion } from "../types/ejercicioSesion";
import type { SesionPendiente } from "../types/sesionPendiente";

import {
  Modal,
  Input,
  Select,
  Textarea,
  Button,
  Label,
  Card,
  Badge,
} from "../../../../shared/ui";

type Props = {
  clienteId: string;
  onClose: () => void;
  onGuardado: () => void;
};

export default function NuevaSesionPendienteModal({
  clienteId,
  onClose,
  onGuardado,
}: Props) {
  const { user } = useAuth();

  const [libroId, setLibroId] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [objetivo, setObjetivo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [bloques, setBloques] = useState<BloqueSesion[]>([]);
  const [guardando, setGuardando] = useState(false);

  // Estado para contexto de sesiones previas
  const [ultimasSesiones, setUltimasSesiones] = useState<SesionPendiente[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);

  if (!user) return null;

  const preparadorId = user.uid;

  const { libros } = useTrainingBooks(preparadorId);
  const { ejercicios } = useExercises(preparadorId);

  // Cargar historial reciente del cliente al abrir el modal
  useEffect(() => {
    async function cargarHistorial() {
      setCargandoHistorial(true);
      const sesiones = await obtenerUltimasSesionesCliente(clienteId, 3);
      setUltimasSesiones(sesiones);
      setCargandoHistorial(false);
    }
    cargarHistorial();
  }, [clienteId]);

  const libroSeleccionado = libros.find((libro) => libro.id === libroId);

  const duracionTotal = useMemo(() => {
    return bloques.reduce(
      (total, bloque) => total + Number(bloque.duracion || 0),
      0,
    );
  }, [bloques]);

  // Extraer músculos fatigados recientemente (últimos 3 días)
  const musculosFatigados = useMemo(() => {
    const musculos = new Set<string>();
    ultimasSesiones.forEach((sesion) => {
      sesion.gruposMusculares?.forEach((g) => musculos.add(g));
    });
    return Array.from(musculos);
  }, [ultimasSesiones]);

  // Clonar la última sesión como plantilla
  function clonarSesionAnterior(sesion: SesionPendiente) {
    if (
      bloques.length > 0 &&
      !confirm("¿Deseas reemplazar el contenido actual con la sesión seleccionada?")
    ) {
      return;
    }

    if (sesion.libroId) {
      setLibroId(sesion.libroId);
    }
    setObjetivo(`Continuación de: ${sesion.objetivo || sesion.libroNombre}`);
    
    // Clonar bloques asignando nuevos UUIDs
    const bloquesClonados: BloqueSesion[] = (sesion.bloques || []).map((b) => ({
      ...b,
      id: crypto.randomUUID(),
      ejercicios: b.ejercicios.map((ej) => ({ ...ej })),
    }));

    setBloques(bloquesClonados);
  }

  function agregarBloque() {
    const nuevoBloque: BloqueSesion = {
      id: crypto.randomUUID(),
      nombre: `Bloque ${bloques.length + 1}`,
      duracion: 0,
      ejercicios: [],
    };

    setBloques((actuales) => [...actuales, nuevoBloque]);
  }

  function eliminarBloque(bloqueId: string) {
    setBloques((actuales) =>
      actuales.filter((bloque) => bloque.id !== bloqueId),
    );
  }

  function actualizarBloque(bloqueId: string, cambios: Partial<BloqueSesion>) {
    setBloques((actuales) =>
      actuales.map((bloque) =>
        bloque.id === bloqueId ? { ...bloque, ...cambios } : bloque,
      ),
    );
  }

  function agregarEjercicio(bloqueId: string, ejercicioId: string) {
    if (!ejercicioId) return;

    const ejercicio = ejercicios.find((item) => item.id === ejercicioId);
    if (!ejercicio) return;

    const ejercicioSesion: EjercicioSesion = {
      ejercicioId: ejercicio.id,
      nombre: ejercicio.nombre,
    };

    setBloques((actuales) =>
      actuales.map((bloque) =>
        bloque.id === bloqueId
          ? {
              ...bloque,
              ejercicios: [...bloque.ejercicios, ejercicioSesion],
            }
          : bloque,
      ),
    );
  }

  function eliminarEjercicio(bloqueId: string, ejercicioId: string) {
    setBloques((actuales) =>
      actuales.map((bloque) =>
        bloque.id === bloqueId
          ? {
              ...bloque,
              ejercicios: bloque.ejercicios.filter(
                (ejercicio) => ejercicio.ejercicioId !== ejercicioId,
              ),
            }
          : bloque,
      ),
    );
  }

  function actualizarEjercicio(
    bloqueId: string,
    ejercicioId: string,
    cambios: Partial<EjercicioSesion>,
  ) {
    setBloques((actuales) =>
      actuales.map((bloque) =>
        bloque.id === bloqueId
          ? {
              ...bloque,
              ejercicios: bloque.ejercicios.map((ejercicio) =>
                ejercicio.ejercicioId === ejercicioId
                  ? { ...ejercicio, ...cambios }
                  : ejercicio,
              ),
            }
          : bloque,
      ),
    );
  }

  async function guardarSesion() {
    if (!libroSeleccionado) {
      alert("Seleccioná el tipo de sesión.");
      return;
    }

    if (!objetivo.trim()) {
      alert("Escribí el objetivo de la sesión.");
      return;
    }

    if (bloques.length === 0) {
      alert("Agregá al menos un bloque.");
      return;
    }

    const bloqueSinDuracion = bloques.find(
      (bloque) => Number(bloque.duracion) <= 0,
    );

    if (bloqueSinDuracion) {
      alert(`El bloque "${bloqueSinDuracion.nombre}" debe tener una duración mayor a 0.`);
      return;
    }

    const bloqueSinEjercicios = bloques.find(
      (bloque) => bloque.ejercicios.length === 0,
    );

    if (bloqueSinEjercicios) {
      alert(
        `El bloque "${bloqueSinEjercicios.nombre}" debe contener al menos un ejercicio.`,
      );
      return;
    }

    try {
      setGuardando(true);

      const fechaSesion = new Date(`${fecha}T00:00:00`);

      const datosSesion = {
        clienteId,
        preparadorId,
        fecha: fechaSesion,
        libroId: libroSeleccionado.id,
        libroNombre: libroSeleccionado.nombre,
        gruposMusculares: libroSeleccionado.gruposMusculares,
        bloques,
        objetivo: objetivo.trim(),
      };

      if (observaciones.trim()) {
        await crearSesionPendiente({
          ...datosSesion,
          observacionesPreparador: observaciones.trim(),
        });
      } else {
        await crearSesionPendiente(datosSesion);
      }

      onGuardado();
    } catch (error) {
      console.error(error);
      alert("No se pudo crear la sesión.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      title="Planificar Nueva Sesión"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-medium">Estimado total:</span>
            <span className="text-sm font-extrabold text-accent font-mono">
              {duracionTotal} min
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="!min-h-0 h-8 !px-3 text-xs font-semibold"
              onClick={onClose}
              disabled={guardando}
            >
              Cancelar
            </Button>

            <Button
              variant="accent"
              className="!min-h-0 h-8 !px-4 text-xs font-bold shadow-[0_0_12px_rgba(255,85,0,0.25)]"
              onClick={guardarSesion}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Crear Sesión"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-left pb-2">
        {/* MÓDULO INTELIGENTE: HISTORIAL RECIENTE Y ANÁLISIS DE FATIGA */}
        <Card className="!p-4 bg-surfaceSoft/60 border-primary/20 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                🧠 Contexto de Carga Reciente
              </span>
            </div>
            {musculosFatigados.length > 0 && (
              <span className="text-[10px] text-muted font-medium">
                Últimas 48-72 hs
              </span>
            )}
          </div>

          {cargandoHistorial ? (
            <p className="text-xs text-muted animate-pulse">
              Analizando historial de entrenamiento...
            </p>
          ) : ultimasSesiones.length === 0 ? (
            <p className="text-xs text-muted italic">
              Sin registros de sesiones anteriores para este cliente.
            </p>
          ) : (
            <div className="space-y-3">
              {/* Tarjetas de sesiones previas para vista rápida o clonar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ultimasSesiones.map((sesion) => (
                  <div
                    key={sesion.id}
                    className="p-2.5 rounded-lg bg-surface border border-border/40 hover:border-primary/50 transition-all text-left flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-muted">
                        <span>
                          {new Date(sesion.fecha).toLocaleDateString("es-AR", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        {sesion.rpe && (
                          <span className="text-accent font-bold">
                            RPE {sesion.rpe}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-text truncate mt-0.5">
                        {sesion.libroNombre}
                      </p>
                      <p className="text-[10px] text-muted/80 line-clamp-1 mt-0.5">
                        {sesion.objetivo}
                      </p>
                    </div>

                    <Button
                      variant="secondary"
                      className="!min-h-0 h-6 text-[10px] font-bold mt-2 w-full border-border/50 hover:bg-primary/20 hover:text-primary transition-colors"
                      onClick={() => clonarSesionAnterior(sesion)}
                    >
                      ⚡ Cargar como Base
                    </Button>
                  </div>
                ))}
              </div>

              {/* Resumen de Músculos Trabajados */}
              {musculosFatigados.length > 0 && (
                <div className="pt-2 border-t border-border/30 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase text-muted">
                    Estímulos Recientes:
                  </span>
                  {musculosFatigados.map((m) => (
                    <Badge
                      key={m}
                      variant="neutral"
                      className="text-[10px] font-mono capitalize px-2 py-0.5 bg-danger/10 text-danger border-danger/20"
                    >
                      🔥 {m}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* PARÁMETROS BÁSICOS: TIPO, FECHA Y OBJETIVO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-text">Tipo de Sesión</Label>
            <Select
              value={libroId}
              disabled={guardando}
              className="w-full bg-surfaceSoft border-border/50 text-xs font-medium focus:border-primary focus:ring-1 focus:ring-primary/40 rounded-lg py-2 px-3 !h-auto"
              onChange={(e) => setLibroId(e.target.value)}
            >
              <option value="">— Seleccionar tipo —</option>
              {libros.map((libro) => (
                <option key={libro.id} value={libro.id}>
                  {libro.nombre}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-text">Fecha Programada</Label>
            <Input
              type="date"
              value={fecha}
              disabled={guardando}
              onChange={(e) => setFecha(e.target.value)}
              className="bg-surfaceSoft border-border/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary/40 rounded-lg py-2 px-3 !h-auto"
            />
          </div>
        </div>

        {/* RESUMEN DEL TIPO DE SESIÓN */}
        {libroSeleccionado && (
          <Card className="!p-3.5 bg-surfaceSoft/50 border-border/40 rounded-xl flex items-center justify-between gap-3 animate-fadeIn">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Configuración de Libreta
              </p>
              <p className="text-xs font-bold text-text mt-0.5">
                {libroSeleccionado.nombre}
              </p>
            </div>
            {libroSeleccionado.categoria && (
              <Badge variant="neutral" className="text-[10px] px-2.5 py-1 font-semibold">
                {libroSeleccionado.categoria}
              </Badge>
            )}
          </Card>
        )}

        {/* OBJETIVO DE LA SESIÓN */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-text">Objetivo Principal</Label>
          <Input
            value={objetivo}
            disabled={guardando}
            onChange={(e) => setObjetivo(e.target.value)}
            placeholder="Ej: Trabajar hipertrofia en torso e intensificar la pausa reducida"
            className="bg-surfaceSoft border-border/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary/40 rounded-lg py-2 px-3 !h-auto"
          />
        </div>

        {/* SECCIÓN DE BLOQUES DE TRABAJO */}
        <div className="space-y-4 pt-3 border-t border-border/40">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-extrabold text-text uppercase tracking-wider">
                Estructura por Bloques
              </h4>
              <p className="text-[11px] text-muted font-medium mt-0.5">
                Suma acumulada: <strong className="text-text">{duracionTotal} min</strong>
              </p>
            </div>

            <Button
              variant="secondary"
              className="!min-h-0 h-8 !px-3 text-xs font-bold shrink-0 shadow-sm"
              onClick={agregarBloque}
              disabled={guardando}
            >
              + Agregar Bloque
            </Button>
          </div>

          {/* ESTADO VACÍO DE BLOQUES */}
          {bloques.length === 0 && (
            <Card className="!p-8 bg-surfaceSoft/30 border-dashed border-border/60 text-center rounded-xl">
              <p className="text-xs text-muted font-medium">
                No has configurado ningún bloque de entrenamiento.
              </p>
              <Button
                variant="accent"
                className="!min-h-0 h-8 !px-4 text-xs font-bold mt-3 shadow-[0_0_10px_rgba(255,85,0,0.2)]"
                onClick={agregarBloque}
              >
                Agregar Primer Bloque
              </Button>
            </Card>
          )}

          {/* LISTA DE BLOQUES */}
          <div className="space-y-4">
            {bloques.map((bloque, bloqueIndex) => (
              <Card
                key={bloque.id}
                className="!p-4 bg-surfaceSoft/40 border-border/50 space-y-4 rounded-xl shadow-sm"
              >
                {/* CABECERA DE BLOQUE */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" className="text-[10px] font-mono px-2 py-0.5">
                      #{bloqueIndex + 1}
                    </Badge>
                    <span className="text-xs font-bold text-text">
                      {bloque.nombre || "Bloque sin nombre"}
                    </span>
                  </div>

                  <Button
                    variant="danger"
                    className="!min-h-0 h-7 !px-2.5 text-[11px] font-semibold opacity-80 hover:opacity-100"
                    onClick={() => eliminarBloque(bloque.id)}
                  >
                    Eliminar Bloque
                  </Button>
                </div>

                {/* CAMPOS DEL BLOQUE */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-[11px] font-bold text-muted">Nombre del Bloque</Label>
                    <Input
                      value={bloque.nombre}
                      onChange={(e) =>
                        actualizarBloque(bloque.id, { nombre: e.target.value })
                      }
                      className="text-xs bg-surface border-border/50 rounded-lg py-2 px-3 !h-auto"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-muted">Duración (min)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={bloque.duracion || ""}
                      placeholder="Ej: 15"
                      onChange={(e) =>
                        actualizarBloque(bloque.id, {
                          duracion: Number(e.target.value),
                        })
                      }
                      className="text-xs bg-surface border-border/50 rounded-lg font-mono py-2 px-3 !h-auto"
                    />
                  </div>
                </div>

                {/* LISTA Y SELECCIÓN DE EJERCICIOS */}
                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                      Ejercicios del Bloque ({bloque.ejercicios.length})
                    </Label>
                    <Select
                      value=""
                      className="w-full bg-surface border-border/50 text-xs rounded-lg font-medium py-2 px-3 !h-auto"
                      onChange={(e) => {
                        agregarEjercicio(bloque.id, e.target.value);
                        e.target.value = "";
                      }}
                    >
                      <option value="">+ Seleccionar ejercicio de la biblioteca...</option>
                      {ejercicios.map((ejercicio) => (
                        <option key={ejercicio.id} value={ejercicio.id}>
                          {ejercicio.nombre}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {bloque.ejercicios.length === 0 && (
                    <div className="p-3 bg-surface/40 border border-border/30 rounded-lg text-center">
                      <p className="text-[11px] text-muted/90 italic">
                        Sin ejercicios asignados a este bloque todavía.
                      </p>
                    </div>
                  )}

                  {/* TARJETAS DE EJERCICIOS */}
                  <div className="space-y-3">
                    {bloque.ejercicios.map((ejercicio, ejercicioIndex) => (
                      <div
                        key={`${bloque.id}-${ejercicio.ejercicioId}-${ejercicioIndex}`}
                        className="p-3.5 rounded-xl border border-border/40 bg-surface/80 space-y-3 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[11px] font-mono text-primary font-extrabold bg-primary/10 px-1.5 py-0.5 rounded">
                              #{ejercicioIndex + 1}
                            </span>
                            <span className="text-xs font-bold text-text truncate">
                              {ejercicio.nombre}
                            </span>
                          </div>

                          <Button
                            variant="secondary"
                            className="!min-h-0 h-6 !px-2 text-[10px] font-semibold text-muted hover:text-danger hover:border-danger/40 transition-colors"
                            onClick={() =>
                              eliminarEjercicio(bloque.id, ejercicio.ejercicioId)
                            }
                          >
                            Quitar
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-muted">
                              Repeticiones / Series
                            </Label>
                            <Input
                              placeholder="Ej: 4 x 10"
                              value={ejercicio.repeticiones ?? ""}
                              onChange={(e) =>
                                actualizarEjercicio(
                                  bloque.id,
                                  ejercicio.ejercicioId,
                                  { repeticiones: e.target.value },
                                )
                              }
                              className="text-xs bg-surfaceSoft border-border/40 rounded-lg py-1.5 px-2.5 !h-auto"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-muted">
                              Pausa
                            </Label>
                            <Input
                              placeholder="Ej: 90 seg"
                              value={ejercicio.pausa ?? ""}
                              onChange={(e) =>
                                actualizarEjercicio(
                                  bloque.id,
                                  ejercicio.ejercicioId,
                                  { pausa: e.target.value },
                                )
                              }
                              className="text-xs bg-surfaceSoft border-border/40 rounded-lg py-1.5 px-2.5 !h-auto"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold text-muted">
                            Indicaciones específicas
                          </Label>
                          <Textarea
                            placeholder="Ej: Mantener ritmo constante en la fase excéntrica..."
                            value={ejercicio.indicaciones ?? ""}
                            onChange={(e) =>
                              actualizarEjercicio(
                                bloque.id,
                                ejercicio.ejercicioId,
                                { indicaciones: e.target.value },
                              )
                            }
                            className="min-h-[50px] text-xs bg-surfaceSoft border-border/40 rounded-lg p-2 resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* INDICACIONES GENERALES DE LA SESIÓN */}
        <div className="space-y-1.5 pt-3 border-t border-border/40">
          <Label className="text-xs font-bold text-text">
            Indicaciones Generales para el Atleta
          </Label>
          <Textarea
            placeholder="Instrucciones globales, recomendaciones de hidratación o notas del preparador..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="min-h-[80px] bg-surfaceSoft border-border/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary/40 rounded-lg p-2.5 resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}