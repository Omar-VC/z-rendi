import type { SesionPendiente } from "../../../admin/seguimiento/types/sesionPendiente";

import { Card, Button, Badge } from "../../../../shared/ui";

type Props = {
  sesion: SesionPendiente;
  onAbrir: () => void;
};

export default function SesionDeHoyCard({ sesion, onAbrir }: Props) {
  const fecha = sesion.fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
  });

  return (
    <Card>
      <div className="space-y-5">
        {/* Encabezado */}

        <div
          className="
          flex
          flex-col
          sm:flex-row
          sm:items-start
          sm:justify-between
          gap-3
        "
        >
          <div>
            <p
              className="
              text-sm
              text-muted
            "
            >
              Sesión programada
            </p>

            <h2
              className="
              mt-1
              text-2xl
              font-bold
              text-text
            "
            >
              {sesion.libroNombre}
            </h2>

            <p
              className="
              mt-1
              text-sm
              text-muted
            "
            >
              {fecha}
            </p>
          </div>

          <Badge variant="warning">Pendiente</Badge>
        </div>

        {/* Objetivo */}

        <div>
          <p
            className="
            text-sm
            text-muted
          "
          >
            Objetivo
          </p>

          <p
            className="
            mt-1
            font-semibold
            text-text
          "
          >
            {sesion.objetivo}
          </p>
        </div>

        {/* Grupos musculares */}

        {sesion.ejercicios.length > 0 && (
          <div>
            <p
              className="
      text-sm
      text-muted
    "
            >
              Grupos musculares
            </p>

            <div
              className="
      mt-2
      flex
      flex-wrap
      gap-2
    "
            >
              {sesion.ejercicios.map((grupo, index) => (
                <span
                  key={`${grupo}-${index}`}
                  className="
            rounded-full
            border
            border-border
            bg-surface-soft
            px-3
            py-1
            text-sm
            font-medium
            text-text
          "
                >
                  {String(grupo)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Indicaciones */}

        {sesion.observacionesPreparador && (
          <div>
            <p
              className="
              text-sm
              text-muted
            "
            >
              Indicaciones
            </p>

            <p
              className="
              mt-1
              text-text
              whitespace-pre-line
            "
            >
              {sesion.observacionesPreparador}
            </p>
          </div>
        )}

        {/* Acción */}

        <Button variant="accent" className="w-full sm:w-auto" onClick={onAbrir}>
          Abrir sesión
        </Button>
      </div>
    </Card>
  );
}
