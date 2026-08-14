import { useNavigate, useParams } from "react-router-dom";

import { useSesionDeHoy } from "../hooks/useSesionDeHoy";

import {
  Card,
  Button,
  Badge,
  Loading,
  EmptyState,
} from "../../../../shared/ui";

export default function SesionClientePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    sesion,
    loading,
    error,
  } = useSesionDeHoy(id ?? "");

  if (loading) {
    return <Loading />;
  }

  if (error || !sesion) {
    return (
      <EmptyState
        title={error ?? "No se encontró la sesión."}
      />
    );
  }

  const fecha = sesion.fecha.toLocaleDateString(
    "es-AR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    },
  );

  const duracionTotal = sesion.bloques.reduce(
    (total, bloque) => total + bloque.duracion,
    0,
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ENCABEZADO */}

      <div>
        <p className="text-sm text-muted">
          Sesión de entrenamiento
        </p>

        <h1 className="
          mt-1
          text-3xl
          font-bold
          text-text
        ">
          {sesion.libroNombre}
        </h1>

        <p className="
          mt-1
          text-muted
          capitalize
        ">
          {fecha}
        </p>
      </div>


      {/* INFORMACIÓN GENERAL */}

      <Card>

        <div className="
          flex
          items-start
          justify-between
          gap-4
        ">

          <div>
            <p className="text-sm text-muted">
              Objetivo
            </p>

            <p className="
              mt-1
              text-lg
              font-semibold
              text-text
            ">
              {sesion.objetivo}
            </p>
          </div>

          <Badge variant="warning">
            Pendiente
          </Badge>

        </div>


        {/* DURACIÓN */}

        <div className="
          mt-5
          rounded-xl
          border
          border-border
          bg-surface-soft
          p-4
        ">

          <p className="text-sm text-muted">
            Duración programada
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

      </Card>


      {/* BLOQUES */}

      <div className="space-y-5">

        {sesion.bloques.map(
          (bloque, bloqueIndex) => (

            <Card key={bloque.id}>

              {/* CABECERA BLOQUE */}

              <div className="
                flex
                items-start
                justify-between
                gap-4
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

                  <h2 className="
                    mt-1
                    text-xl
                    font-bold
                    text-text
                  ">
                    {bloque.nombre}
                  </h2>

                </div>

                <div className="
                  rounded-lg
                  bg-surface-soft
                  border
                  border-border
                  px-3
                  py-2
                  text-sm
                  font-semibold
                  text-text
                ">
                  {bloque.duracion} min
                </div>

              </div>


              {/* EJERCICIOS */}

              <div className="
                mt-5
                space-y-3
              ">

                {bloque.ejercicios.map(
                  (ejercicio, ejercicioIndex) => (

                    <div
                      key={`${bloque.id}-${ejercicio.ejercicioId}-${ejercicioIndex}`}
                      className="
                        rounded-xl
                        border
                        border-border
                        bg-surface-soft
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
                          text-white
                          text-sm
                          font-bold
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


                          {/* REPETICIONES */}

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


                          {/* PAUSA */}

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


                          {/* INDICACIONES */}

                          {ejercicio.indicaciones && (
                            <div className="
                              mt-3
                              rounded-lg
                              border
                              border-border
                              bg-surface
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

            </Card>

          ),
        )}

      </div>


      {/* OBSERVACIONES DEL PREPARADOR */}

      {sesion.observacionesPreparador && (
        <Card>

          <h2 className="
            text-xl
            font-bold
            text-text
          ">
            Indicaciones generales
          </h2>

          <p className="
            mt-3
            text-text
            whitespace-pre-line
          ">
            {sesion.observacionesPreparador}
          </p>

        </Card>
      )}


      {/* FINALIZAR */}

      <Card>

        <div className="space-y-4 text-center">

          <div>

            <h2 className="
              text-xl
              font-bold
              text-text
            ">
              ¿Terminaste tu entrenamiento?
            </h2>

            <p className="
              mt-1
              text-sm
              text-muted
            ">
              Cuando termines, registrá tu percepción
              del esfuerzo para completar la sesión.
            </p>

          </div>

          <Button
            variant="accent"
            className="w-full"
            onClick={() =>
              navigate(
                `/cliente/sesion/${sesion.id}/finalizar`,
              )
            }
          >
            Finalizar sesión
          </Button>

        </div>

      </Card>

    </div>
  );
}