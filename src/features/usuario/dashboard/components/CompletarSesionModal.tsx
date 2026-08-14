import { useState } from "react";

import type { SesionPendiente } from "../../../admin/seguimiento/types/sesionPendiente";

import {
  Modal,
  Input,
  Textarea,
  Button,
  Label,
} from "../../../../shared/ui";

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
  const [rpe, setRpe] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [guardando, setGuardando] = useState(false);

  const duracionTotal = sesion.bloques.reduce(
    (total, bloque) => total + bloque.duracion,
    0,
  );

  const rpeNumero = Number(rpe);

  const carga =
    duracionTotal > 0 && rpeNumero > 0
      ? duracionTotal * rpeNumero
      : 0;

  async function handleGuardar() {
    if (
      !rpeNumero ||
      rpeNumero < 1 ||
      rpeNumero > 10
    ) {
      alert("El RPE debe estar entre 1 y 10.");
      return;
    }

    try {
      setGuardando(true);

      await onGuardar({
        duracion: duracionTotal,
        rpe: rpeNumero,
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

  return (
    <Modal
      title="Sesión de entrenamiento"
      onClose={onClose}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={guardando}
          >
            Cerrar
          </Button>

          <Button
            variant="accent"
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Finalizar sesión"}
          </Button>
        </>
      }
    >
      <div className="space-y-6">

        {/* INFORMACIÓN GENERAL */}

        <div>
          <p className="text-sm text-muted">
            {fecha}
          </p>

          <h2 className="
            mt-1
            text-2xl
            font-bold
            text-text
          ">
            {sesion.libroNombre}
          </h2>

          <p className="
            mt-3
            text-sm
            text-muted
          ">
            Objetivo
          </p>

          <p className="
            mt-1
            font-semibold
            text-text
          ">
            {sesion.objetivo}
          </p>

          <div className="
            mt-4
            rounded-xl
            border
            border-border
            bg-surface-soft
            p-4
          ">
            <p className="text-sm text-muted">
              Duración total
            </p>

            <p className="
              mt-1
              text-2xl
              font-bold
              text-text
            ">
              {duracionTotal} minutos
            </p>
          </div>
        </div>


        {/* BLOQUES */}

        <div>
          <h3 className="
            text-xl
            font-bold
            text-text
          ">
            Entrenamiento
          </h3>

          <div className="mt-4 space-y-4">

            {sesion.bloques.map(
              (bloque, bloqueIndex) => (
                <div
                  key={bloque.id}
                  className="
                    rounded-xl
                    border
                    border-border
                    bg-surface-soft
                    p-4
                  "
                >

                  {/* BLOQUE */}

                  <div className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  ">
                    <div>

                      <p className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-muted
                      ">
                        Bloque {bloqueIndex + 1}
                      </p>

                      <p className="
                        mt-1
                        font-bold
                        text-text
                      ">
                        {bloque.nombre}
                      </p>

                    </div>

                    <span className="
                      shrink-0
                      rounded-lg
                      border
                      border-border
                      bg-surface
                      px-3
                      py-1.5
                      text-sm
                      font-semibold
                      text-text
                    ">
                      {bloque.duracion} min
                    </span>
                  </div>


                  {/* EJERCICIOS */}

                  <div className="mt-4 space-y-3">

                    {bloque.ejercicios.map(
                      (ejercicio, ejercicioIndex) => (
                        <div
                          key={`${bloque.id}-${ejercicio.ejercicioId}-${ejercicioIndex}`}
                          className="
                            rounded-lg
                            border
                            border-border
                            bg-surface
                            p-4
                          "
                        >

                          <div className="
                            flex
                            items-start
                            gap-3
                          ">

                            <span className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-primary
                              text-sm
                              font-bold
                              text-white
                            ">
                              {ejercicioIndex + 1}
                            </span>

                            <div className="min-w-0">

                              <p className="
                                font-semibold
                                text-text
                              ">
                                {ejercicio.nombre}
                              </p>

                              {ejercicio.repeticiones && (
                                <p className="
                                  mt-2
                                  text-sm
                                  text-text
                                ">
                                  <span className="font-semibold">
                                    Repeticiones:
                                  </span>{" "}
                                  {ejercicio.repeticiones}
                                </p>
                              )}

                              {ejercicio.pausa && (
                                <p className="
                                  mt-1
                                  text-sm
                                  text-muted
                                ">
                                  <span className="font-semibold">
                                    Pausa:
                                  </span>{" "}
                                  {ejercicio.pausa}
                                </p>
                              )}

                              {ejercicio.indicaciones && (
                                <div className="
                                  mt-3
                                  rounded-lg
                                  border
                                  border-border
                                  bg-surface-soft
                                  p-3
                                ">
                                  <p className="
                                    text-xs
                                    uppercase
                                    tracking-wide
                                    text-muted
                                  ">
                                    Indicaciones
                                  </p>

                                  <p className="
                                    mt-1
                                    text-sm
                                    text-text
                                    whitespace-pre-line
                                  ">
                                    {ejercicio.indicaciones}
                                  </p>
                                </div>
                              )}

                            </div>

                          </div>

                        </div>
                      ),
                    )}

                  </div>

                </div>
              ),
            )}

          </div>
        </div>


        {/* INDICACIONES GENERALES */}

        {sesion.observacionesPreparador && (
          <div>
            <h3 className="
              text-lg
              font-bold
              text-text
            ">
              Indicaciones generales
            </h3>

            <p className="
              mt-2
              text-sm
              text-text
              whitespace-pre-line
            ">
              {sesion.observacionesPreparador}
            </p>
          </div>
        )}


        {/* RPE */}

        <div>
          <Label>
            RPE
          </Label>

          <p className="
            mb-2
            text-sm
            text-muted
          ">
            Indicá qué tan exigente fue la sesión.
            <br />
            1 = muy fácil · 10 = máximo esfuerzo
          </p>

          <Input
            type="number"
            min={1}
            max={10}
            placeholder="Ej: 7"
            value={rpe}
            onChange={(e) =>
              setRpe(e.target.value)
            }
          />
        </div>


        {/* CARGA */}

        <div className="
          rounded-xl
          border
          border-border
          bg-surface-soft
          p-5
        ">
          <p className="
            text-sm
            text-muted
          ">
            Carga de entrenamiento
          </p>

          <p className="
            mt-1
            text-3xl
            font-bold
            text-accent
          ">
            {carga}
          </p>

          <p className="
            text-xs
            text-muted
          ">
            Duración programada × RPE
          </p>
        </div>


        {/* OBSERVACIONES DEL CLIENTE */}

        <div>
          <Label>
            Observaciones
          </Label>

          <Textarea
            placeholder="¿Cómo te sentiste durante el entrenamiento?"
            value={observaciones}
            onChange={(e) =>
              setObservaciones(e.target.value)
            }
          />
        </div>

      </div>
    </Modal>
  );
}