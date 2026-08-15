import { useMemo, useState } from "react";

import { useAuth } from "../../../../auth/useAuth";

import { useTrainingBooks } from "../../biblioteca/tipo-sesion/hooks/useTrainingBooks";
import { useExercises } from "../../biblioteca/ejercicios/hooks/useExercises";

import { crearSesionPendiente } from "../services/sesionesPendientes.service";

import type { BloqueSesion } from "../types/bloqueSesion";
import type { EjercicioSesion } from "../types/ejercicioSesion";

import {
  Modal,
  Input,
  Select,
  Textarea,
  Button,
  Label,
  Card,
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

  if (!user) return null;

  const preparadorId = user.uid;

  const { libros } = useTrainingBooks(preparadorId);
  const { ejercicios } = useExercises(preparadorId);

  const libroSeleccionado = libros.find((libro) => libro.id === libroId);

  /*
   * Duración total de la sesión.
   * Se calcula automáticamente sumando la duración
   * de todos los bloques.
   */
  const duracionTotal = useMemo(() => {
    return bloques.reduce(
      (total, bloque) => total + Number(bloque.duracion || 0),
      0,
    );
  }, [bloques]);

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
        bloque.id === bloqueId
          ? {
              ...bloque,
              ...cambios,
            }
          : bloque,
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
                  ? {
                      ...ejercicio,
                      ...cambios,
                    }
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
      alert(`El bloque "${bloqueSinDuracion.nombre}" debe tener una duración.`);
      return;
    }

    const bloqueSinEjercicios = bloques.find(
      (bloque) => bloque.ejercicios.length === 0,
    );

    if (bloqueSinEjercicios) {
      alert(
        `El bloque "${bloqueSinEjercicios.nombre}" debe tener al menos un ejercicio.`,
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

        objetivo,
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
      title="Nueva sesión"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={guardando}>
            Cancelar
          </Button>

          <Button variant="accent" onClick={guardarSesion} disabled={guardando}>
            {guardando ? "Guardando..." : "Crear sesión"}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Tipo de sesión */}

        <div>
          <Label>Tipo de sesión</Label>

          <Select value={libroId} onChange={(e) => setLibroId(e.target.value)}>
            <option value="">Seleccionar tipo de sesión</option>

            {libros.map((libro) => (
              <option key={libro.id} value={libro.id}>
                {libro.nombre}
              </option>
            ))}
          </Select>
        </div>

        {/* Fecha */}

        <div>
          <Label>Fecha</Label>

          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        {/* Objetivo */}

        <div>
          <Label>Objetivo de la sesión</Label>

          <Input
            placeholder="Ej: Mejorar fuerza del tren inferior"
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
          />
        </div>

        {/* Resumen */}

        {libroSeleccionado && (
          <Card>
            <div className="space-y-2">
              <p className="text-sm text-muted">Tipo de sesión</p>

              <p className="text-lg font-semibold text-text">
                {libroSeleccionado.nombre}
              </p>

              <p className="text-sm text-muted">
                Categoría: {libroSeleccionado.categoria}
              </p>
            </div>
          </Card>
        )}

        {/* Bloques */}

        <div className="space-y-4">
          <div
            className="
            flex
            items-center
            justify-between
            gap-3
          "
          >
            <div>
              <h2
                className="
                text-xl
                font-bold
                text-text
              "
              >
                Bloques
              </h2>

              <p
                className="
                mt-1
                text-sm
                text-muted
              "
              >
                Organizá la sesión en bloques de trabajo.
              </p>
            </div>

            <Button variant="secondary" onClick={agregarBloque}>
              + Bloque
            </Button>
          </div>

          {bloques.length === 0 && (
            <Card>
              <div
                className="
                py-4
                text-center
              "
              >
                <p className="text-sm text-muted">
                  Todavía no agregaste ningún bloque.
                </p>

                <Button
                  variant="accent"
                  className="mt-4"
                  onClick={agregarBloque}
                >
                  Agregar primer bloque
                </Button>
              </div>
            </Card>
          )}

          {bloques.map((bloque, bloqueIndex) => (
            <Card key={bloque.id}>
              <div className="space-y-5">
                {/* Cabecera bloque */}

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-muted
                      "
                    >
                      Bloque {bloqueIndex + 1}
                    </p>

                    <p
                      className="
                        mt-1
                        font-semibold
                        text-text
                      "
                    >
                      {bloque.nombre}
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    onClick={() => eliminarBloque(bloque.id)}
                  >
                    Eliminar
                  </Button>
                </div>

                {/* Nombre y duración */}

                <div
                  className="
                    grid
                    gap-4
                    sm:grid-cols-2
                  "
                >
                  <div>
                    <Label>Nombre del bloque</Label>

                    <Input
                      value={bloque.nombre}
                      onChange={(e) =>
                        actualizarBloque(bloque.id, {
                          nombre: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Duración (minutos)</Label>

                    <Input
                      type="number"
                      min={1}
                      value={bloque.duracion || ""}
                      placeholder="Ej: 20"
                      onChange={(e) =>
                        actualizarBloque(bloque.id, {
                          duracion: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                {/* Ejercicios */}

                <div className="space-y-3">
                  <div>
                    <Label>Agregar ejercicio</Label>

                    <Select
                      value=""
                      onChange={(e) =>
                        agregarEjercicio(bloque.id, e.target.value)
                      }
                    >
                      <option value="">Seleccionar ejercicio</option>

                      {ejercicios.map((ejercicio) => (
                        <option key={ejercicio.id} value={ejercicio.id}>
                          {ejercicio.nombre}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {bloque.ejercicios.length === 0 && (
                    <p
                      className="
                        text-sm
                        text-muted
                      "
                    >
                      No hay ejercicios agregados.
                    </p>
                  )}

                  {bloque.ejercicios.map((ejercicio, ejercicioIndex) => (
                    <div
                      key={ejercicio.ejercicioId}
                      className="
                            rounded-xl
                            border
                            border-border
                            bg-surface-soft
                            p-4
                          "
                    >
                      <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                      >
                        <div>
                          <p
                            className="
                                text-xs
                                text-muted
                              "
                          >
                            Ejercicio {ejercicioIndex + 1}
                          </p>

                          <p
                            className="
                                mt-1
                                font-semibold
                                text-text
                              "
                          >
                            {ejercicio.nombre}
                          </p>
                        </div>

                        <Button
                          variant="secondary"
                          onClick={() =>
                            eliminarEjercicio(bloque.id, ejercicio.ejercicioId)
                          }
                        >
                          Quitar
                        </Button>
                      </div>

                      <div
                        className="
                            mt-4
                            grid
                            gap-4
                            sm:grid-cols-2
                          "
                      >
                        <div>
                          <Label>Repeticiones</Label>

                          <Input
                            placeholder="Ej: 3 x 8"
                            value={ejercicio.repeticiones ?? ""}
                            onChange={(e) =>
                              actualizarEjercicio(
                                bloque.id,
                                ejercicio.ejercicioId,
                                {
                                  repeticiones: e.target.value,
                                },
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label>Pausa</Label>

                          <Input
                            placeholder="Ej: 90 segundos"
                            value={ejercicio.pausa ?? ""}
                            onChange={(e) =>
                              actualizarEjercicio(
                                bloque.id,
                                ejercicio.ejercicioId,
                                {
                                  pausa: e.target.value,
                                },
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label>Indicaciones / forma de ejecución</Label>

                        <Textarea
                          placeholder="Ej: Hacés 3 repeticiones y sostenés 3 segundos..."
                          value={ejercicio.indicaciones ?? ""}
                          onChange={(e) =>
                            actualizarEjercicio(
                              bloque.id,
                              ejercicio.ejercicioId,
                              {
                                indicaciones: e.target.value,
                              },
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Duración total */}

        <Card>
          <div
            className="
            flex
            items-center
            justify-between
            gap-4
          "
          >
            <div>
              <p
                className="
                text-sm
                text-muted
              "
              >
                Duración total
              </p>

              <p
                className="
                mt-1
                text-xs
                text-muted
              "
              >
                Se calcula automáticamente según los bloques.
              </p>
            </div>

            <p
              className="
              text-3xl
              font-bold
              text-accent
            "
            >
              {duracionTotal} min
            </p>
          </div>
        </Card>

        {/* Observaciones */}

        <div>
          <Label>Indicaciones generales</Label>

          <Textarea
            placeholder="Indicaciones generales para el atleta..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
