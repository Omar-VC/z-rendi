import { useState } from "react";

import type { SesionEntrenamiento } from "../types/seguimiento";

import {
  Card,
  Badge,
  Button,
} from "../../../../shared/ui";


type Props = {
  sesiones: SesionEntrenamiento[];
  onEliminarSesion: (id: string) => Promise<void>;
};


export default function RegistroSesiones({
  sesiones,
  onEliminarSesion,
}: Props) {


  const [abierto, setAbierto] = useState(false);



  async function eliminar(
    id: string,
  ) {

    const confirmar = window.confirm(
      "¿Eliminar esta sesión?"
    );


    if (!confirmar) return;


    await onEliminarSesion(id);

  }



  return (

    <Card>


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




      {abierto && (

        <div className="mt-6 space-y-3">


          {sesiones.length === 0 ? (

            <p className="text-muted">
              Todavía no hay sesiones registradas este mes.
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




                <div className="flex flex-wrap items-center gap-2">


                  <Badge variant="neutral">
                    {sesion.duracion} min
                  </Badge>


                  <Badge variant="info">
                    RPE {sesion.rpe}
                  </Badge>


                  <Badge variant="warning">
                    Carga {sesion.carga}
                  </Badge>


                  <Button
                    variant="secondary"
                    onClick={() => eliminar(sesion.id)}
                  >
                    Eliminar
                  </Button>


                </div>


              </div>


            ))

          )}


        </div>

      )}


    </Card>

  );
}