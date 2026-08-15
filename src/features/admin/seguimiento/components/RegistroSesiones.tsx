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

  async function eliminar(id: string) {

    const confirmar = window.confirm(
      "¿Eliminar esta sesión?"
    );

    if (!confirmar) return;

    await onEliminarSesion(id);
  }

  return (
    <Card>

      {/* Encabezado */}

      <button
        onClick={() => setAbierto(!abierto)}
        className="
          w-full
          flex
          items-center
          justify-between
          text-left
        "
      >

        <div>

          <h3 className="font-semibold text-lg">
            Registro de sesiones
          </h3>

          <p className="mt-1 text-sm text-muted">
            {sesiones.length} sesiones registradas
          </p>

        </div>

        <span className="text-muted text-sm">
          {abierto ? "▲" : "▼"}
        </span>

      </button>


      {/* Registro */}

      {abierto && (

        <div className="mt-5">

          {sesiones.length === 0 ? (

            <p className="text-sm text-muted">
              Todavía no hay sesiones registradas este mes.
            </p>

          ) : (

            <div>

              {sesiones.map((sesion, index) => (

                <div
                  key={sesion.id}
                  className={`
                    py-4
                    ${index !== sesiones.length - 1
                      ? "border-b border-border"
                      : ""}
                  `}
                >

                  <div
                    className="
                      flex
                      flex-col
                      gap-3
                      md:flex-row
                      md:items-center
                      md:justify-between
                    "
                  >

                    {/* Información */}

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <p className="font-semibold">
                          {sesion.libroNombre}
                        </p>

                        <span className="text-sm text-muted">
                          ·
                        </span>

                        <p className="text-sm text-muted">
                          {sesion.fecha.toLocaleDateString("es-AR")}
                        </p>

                      </div>


                      {/* Grupos musculares */}

                      {(sesion.gruposMusculares ?? []).length > 0 && (

                        <p className="mt-1 text-sm text-muted">
                          {(sesion.gruposMusculares ?? []).join(" · ")}
                        </p>

                      )}


                      {/* Datos */}

                      <div className="mt-2 flex flex-wrap items-center gap-2">

                        <Badge variant="neutral">
                          {sesion.duracion} min
                        </Badge>

                        <Badge variant="info">
                          RPE {sesion.rpe}
                        </Badge>

                        <Badge variant="warning">
                          {sesion.carga} UA
                        </Badge>

                      </div>

                    </div>


                    {/* Acción */}

                    <Button
                      variant="secondary"
                      onClick={() => eliminar(sesion.id)}
                    >
                      Eliminar
                    </Button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

    </Card>
  );
}