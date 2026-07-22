import type { SesionEntrenamiento } from "../types/seguimiento";

import {
  Card,
  Badge,
} from "../../../../shared/ui";


type Props = {
  sesion?: SesionEntrenamiento;
};


export default function UltimaSesionCard({
  sesion,
}: Props) {


  if (!sesion) {

    return (

      <Card>

        <h3 className="font-semibold text-lg">
          Última sesión
        </h3>


        <p className="mt-3 text-muted">
          Aún no hay sesiones registradas.
        </p>


      </Card>

    );

  }



  return (

    <Card>


      <div className="flex flex-col md:flex-row md:justify-between gap-4">


        <div>


          <h3 className="font-semibold text-lg">
            Última sesión
          </h3>


          <p className="mt-3 font-semibold">
            {sesion.libroNombre}
          </p>


          <p className="text-sm text-muted mt-1">
            {sesion.fecha.toLocaleDateString()}
          </p>


        </div>



        <div className="flex gap-2">


          <Badge variant="info">
            RPE {sesion.rpe}
          </Badge>


          <Badge variant="neutral">
            {sesion.duracion} min
          </Badge>


        </div>


      </div>



      <div className="mt-6 grid gap-4 md:grid-cols-2">


        <div>

          <p className="text-sm text-muted">
            Carga
          </p>


          <p className="font-semibold mt-1">
            {sesion.carga}
          </p>


        </div>



        <div>

          <p className="text-sm text-muted">
            Observaciones
          </p>


          <p className="mt-1">
            {sesion.observaciones || "-"}
          </p>


        </div>


      </div>


    </Card>

  );
}