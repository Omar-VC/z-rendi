import { useState } from "react";

import type { SesionEntrenamiento } from "../types/seguimiento";

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
    <div className="bg-grisSemiOscuro rounded-lg shadow p-4">

      <div className="flex justify-between items-center">

        <button
          onClick={() => setAbierto(!abierto)}
          className="font-semibold text-lg"
        >
          {abierto ? "▼" : "▶"} Registro de sesiones ({sesiones.length})
        </button>


        <button
          onClick={onNuevaSesion}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          + Nueva sesión
        </button>

      </div>


      {abierto && (

        <div className="mt-4 space-y-2">

          {sesiones.length === 0 ? (

            <p className="text-gray-500">
              Sin sesiones registradas.
            </p>

          ) : (

            sesiones.map((sesion) => (

              <div
                key={sesion.id}
                className="border rounded p-2 flex justify-between items-center"
              >

                <div>
                  <span className="font-medium">
                    {sesion.libroNombre}
                  </span>

                  <span className="text-sm text-gray-500 ml-2">
                    {sesion.fecha.toLocaleDateString()}
                  </span>
                </div>


                <div className="text-sm">
                  {sesion.duracion}' 
                  {" • "}
                  RPE {sesion.rpe}
                  {" • "}
                  Carga {sesion.carga}
                </div>

              </div>

            ))

          )}

        </div>

      )}

    </div>
  );
}