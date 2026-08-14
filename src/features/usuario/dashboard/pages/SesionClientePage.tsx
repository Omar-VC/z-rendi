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

  return (
    <div className="
      max-w-3xl
      mx-auto
      space-y-6
    ">

      {/* Encabezado */}

      <div>

        <p className="text-sm text-muted">
          Tu sesión de entrenamiento
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


      {/* Estado */}

      <Card>

        <div className="
          flex
          items-center
          justify-between
          gap-4
        ">

          <div>

            <p className="
              text-sm
              text-muted
            ">
              Estado
            </p>

            <p className="
              mt-1
              font-semibold
              text-text
            ">
              Sesión pendiente
            </p>

          </div>

          <Badge variant="warning">
            Pendiente
          </Badge>

        </div>

      </Card>


      {/* Objetivo */}

      <Card>

        <p className="text-sm text-muted">
          Objetivo de la sesión
        </p>

        <p className="
          mt-2
          text-lg
          font-semibold
          text-text
        ">
          {sesion.objetivo}
        </p>

      </Card>


      {/* Ejercicios */}

      <Card>

        <h2 className="
          text-xl
          font-bold
          text-text
        ">
          Entrenamiento
        </h2>

        <div className="mt-5 space-y-3">

          {sesion.ejercicios.map(
            (ejercicio, index) => (

              <div
                key={index}
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
                  items-center
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
                    {index + 1}
                  </span>

                  <span className="
                    font-medium
                    text-text
                  ">
                    {String(ejercicio)}
                  </span>

                </div>

              </div>

            ),
          )}

        </div>

      </Card>


      {/* Indicaciones */}

      {sesion.observacionesPreparador && (
        <Card>

          <h2 className="
            text-xl
            font-bold
            text-text
          ">
            Indicaciones
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


      {/* Finalizar */}

      <Card>

        <div className="
          space-y-4
          text-center
        ">

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
              Al finalizar vas a poder indicar cuánto
              tiempo entrenaste y qué tan exigente fue
              la sesión.
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