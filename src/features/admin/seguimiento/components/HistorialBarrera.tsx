import type { HistorialBarrera as HistorialBarreraType } from "../types/barrera";

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
      month: "long",
      year: "numeric",
    }
  );

}



export default function HistorialBarrera({
  historial,
}: Props) {


  if (!historial || historial.length === 0) {
    return null;
  }



  return (

    <div className="mt-5">


      <h4 className="font-semibold text-sm mb-3">
        Evolución
      </h4>



      <div className="space-y-3">


        {historial.map((item) => (


          <div
            key={`${item.objetivo}-${item.resultado}`}
            className="
              rounded-xl
              border
              border-border
              p-4
              bg-surface
            "
          >


            <div className="flex justify-between items-start gap-3">


              <p className="text-xs text-muted capitalize">
                {formatearFecha(item.fecha)}
              </p>


              <Badge variant="success">
                Superada
              </Badge>


            </div>




            <div className="mt-3 space-y-2 text-sm">


              <p>

                <span className="text-muted">
                  Objetivo:
                </span>

                <span className="ml-2 font-semibold">
                  {item.objetivo}
                </span>

              </p>




              <p>

                <span className="text-muted">
                  Resultado:
                </span>

                <span className="ml-2 font-semibold">
                  {item.resultado || "-"}
                </span>

              </p>




              {item.observaciones && (

                <p className="text-sm mt-3">
                  {item.observaciones}
                </p>

              )}


            </div>


          </div>


        ))}


      </div>


    </div>

  );
}