import type {
  HistorialBarrera as HistorialBarreraType,
} from "../types/barrera";

import {
  Badge,
} from "../../../../shared/ui";

type Props = {
  historial?: HistorialBarreraType[];
};

function formatearFecha(fecha: any) {

  if (!fecha) return "";

  const date = fecha.toDate
    ? fecha.toDate()
    : new Date(fecha);

  return date.toLocaleDateString(
    "es-AR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

export default function HistorialBarrera({
  historial,
}: Props) {

  if (!historial || historial.length === 0) {

    return (
      <p className="text-sm text-muted">
        Todavía no hay evaluaciones registradas.
      </p>
    );

  }

  return (

    <div>

      <p className="
        mb-3
        text-xs
        font-semibold
        uppercase
        tracking-wide
        text-muted
      ">
        Evolución
      </p>


      <div>

        {historial.map((item, index) => (

          <div
            key={`${item.fecha}-${item.objetivo}-${index}`}
            className={`
              py-3
              ${
                index !== historial.length - 1
                  ? "border-b border-border"
                  : ""
              }
            `}
          >

            <div className="
              flex
              flex-col
              gap-2
              sm:flex-row
              sm:items-center
              sm:justify-between
            ">

              <div className="
                flex
                flex-wrap
                items-center
                gap-x-3
                gap-y-1
              ">

                <span className="
                  text-sm
                  text-muted
                ">
                  {formatearFecha(item.fecha)}
                </span>

                <span className="text-muted">
                  ·
                </span>

                <span className="text-sm">
                  Objetivo{" "}
                  <strong>
                    {item.objetivo}
                  </strong>
                </span>

                <span className="text-muted">
                  ·
                </span>

                <span className="text-sm">
                  Resultado{" "}
                  <strong>
                    {item.resultado || "-"}
                  </strong>
                </span>

              </div>


              <Badge variant="success">
                Superada
              </Badge>

            </div>


            {item.observaciones && (

              <p className="
                mt-2
                text-sm
                text-muted
              ">
                {item.observaciones}
              </p>

            )}

          </div>

        ))}

      </div>

    </div>

  );
}