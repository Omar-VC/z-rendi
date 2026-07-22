import { useState } from "react";

import type { SesionEntrenamiento } from "../types/seguimiento";

import {
  Card,
  Button,
  Badge,
} from "../../../../shared/ui";


type Props = {
  sesiones: SesionEntrenamiento[];
  onNuevaSesion: () => void;
};


export default function RegistroSesiones({
  sesiones,
  onNuevaSesion,
}: Props) {


  const [abierto, setAbierto] = useState(false);



  return (

    <Card>


      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">


        <button
          onClick={() => setAbierto(!abierto)}
          className="
            text-left
            font-semibold
            text-lg
          "
        >

          {abierto ? "▼" : "▶"} Registro de sesiones ({sesiones.length})

        </button>



        <Button
          variant="accent"
          onClick={onNuevaSesion}
        >
          Nueva sesión
        </Button>


      </div>




      {abierto && (

        <div className="mt-6 space-y-3">


          {sesiones.length === 0 ? (

            <p className="text-muted">
              Sin sesiones registradas.
            </p>

          ) : (


            sesiones.map((sesion) => (


              <div
                key={sesion.id}
                className="
                  rounded-xl
                  border
                  border-border
                  bg-surface
                  p-4
                  flex
                  flex-col
                  md:flex-row
                  md:justify-between
                  gap-4
                "
              >


                <div>


                  <p className="font-semibold">
                    {sesion.libroNombre}
                  </p>


                  <p className="text-sm text-muted mt-1">
                    {sesion.fecha.toLocaleDateString()}
                  </p>


                </div>




                <div className="flex flex-wrap gap-2">


                  <Badge variant="neutral">
                    {sesion.duracion} min
                  </Badge>


                  <Badge variant="info">
                    RPE {sesion.rpe}
                  </Badge>


                  <Badge variant="warning">
                    Carga {sesion.carga}
                  </Badge>


                </div>


              </div>


            ))

          )}


        </div>

      )}


    </Card>

  );
}