import { useState } from "react";

import { useBarreras } from "../hooks/useBarreras";

import NuevaBarreraModal from "./NuevaBarreraModal";
import EvaluarBarreraModal from "./EvaluarBarreraModal";
import NuevoObjetivoModal from "./NuevoObjetivoModal";
import HistorialBarrera from "./HistorialBarrera";

import type { Barrera } from "../types/barrera";

import { eliminarBarrera } from "../services/barrerasService";

import {
  Card,
  Button,
  Badge,
  SectionTitle,
} from "../../../../shared/ui";

type Props = {
  clienteId: string;
};

export default function BarrerasPanel({
  clienteId,
}: Props) {

  const {
    barreras,
    loading,
    recargar,
  } = useBarreras(clienteId);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [barreraSeleccionada, setBarreraSeleccionada] =
    useState<Barrera | null>(null);

  const [barreraNuevoObjetivo, setBarreraNuevoObjetivo] =
    useState<Barrera | null>(null);

  const [barreraAbierta, setBarreraAbierta] =
    useState<string | null>(null);

  async function borrarBarrera(id: string) {

    const confirmar =
      window.confirm("¿Eliminar esta barrera?");

    if (!confirmar) return;

    try {

      await eliminarBarrera(id);

      recargar();

    } catch (error) {

      console.error(error);

      alert("No se pudo eliminar la barrera.");

    }
  }

  function estadoVariant(
    estado: Barrera["estado"]
  ) {

    if (estado === "superada") {
      return "success" as const;
    }

    return "warning" as const;
  }

  function alternarBarrera(id: string) {

    setBarreraAbierta((actual) =>
      actual === id ? null : id
    );

  }

  return (
    <Card>

      {/* Encabezado */}

      <div className="
        flex
        flex-col
        gap-4
        md:flex-row
        md:items-center
        md:justify-between
      ">

        <SectionTitle
          title="Barreras de progreso"
          description="Pruebas y objetivos de evolución del atleta."
        />

        <Button
          variant="accent"
          onClick={() => setMostrarModal(true)}
        >
          Nueva prueba
        </Button>

      </div>


      {/* Estado */}

      {loading && (
        <p className="mt-6 text-sm text-muted">
          Cargando...
        </p>
      )}

      {!loading && barreras.length === 0 && (
        <p className="mt-6 text-sm text-muted">
          No hay pruebas registradas.
        </p>
      )}


      {/* Lista */}

      {!loading && barreras.length > 0 && (

        <div className="mt-5">

          {barreras.map((barrera, index) => {

            const abierta =
              barreraAbierta === barrera.id;

            const evaluaciones =
              barrera.historial?.length ?? 0;

            return (

              <div
                key={barrera.id}
                className={`
                  py-4
                  ${
                    index !== barreras.length - 1
                      ? "border-b border-border"
                      : ""
                  }
                `}
              >

                {/* Resumen */}

                <button
                  type="button"
                  onClick={() =>
                    alternarBarrera(barrera.id)
                  }
                  className="
                    w-full
                    text-left
                  "
                >

                  <div className="
                    flex
                    flex-col
                    gap-3
                    md:flex-row
                    md:items-center
                    md:justify-between
                  ">

                    {/* Información */}

                    <div className="min-w-0">

                      <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                      ">

                        <p className="
                          font-semibold
                          text-text
                        ">
                          {barrera.nombre}
                        </p>

                        <Badge
                          variant={estadoVariant(
                            barrera.estado
                          )}
                        >
                          {barrera.estado}
                        </Badge>

                      </div>


                      <div className="
                        mt-1
                        flex
                        flex-wrap
                        items-center
                        gap-x-2
                        gap-y-1
                        text-sm
                        text-muted
                      ">

                        {barrera.categoria && (
                          <>
                            <span>
                              {barrera.categoria}
                            </span>

                            <span>·</span>
                          </>
                        )}

                        <span>
                          Objetivo: {barrera.objetivo}
                        </span>

                      </div>

                    </div>


                    {/* Resumen derecho */}

                    <div className="
                      flex
                      items-center
                      gap-4
                      text-sm
                      text-muted
                    ">

                      <span>
                        {evaluaciones}{" "}
                        {evaluaciones === 1
                          ? "evaluación"
                          : "evaluaciones"}
                      </span>

                      <span>
                        {abierta ? "▲" : "▼"}
                      </span>

                    </div>

                  </div>

                </button>


                {/* Detalle */}

                {abierta && (

                  <div className="mt-4">

                    <HistorialBarrera
                      historial={barrera.historial}
                    />


                    {/* Acciones */}

                    <div className="
                      mt-5
                      flex
                      flex-wrap
                      gap-2
                    ">

                      {barrera.estado === "pendiente" ? (

                        <Button
                          variant="success"
                          onClick={() =>
                            setBarreraSeleccionada(barrera)
                          }
                        >
                          Evaluar
                        </Button>

                      ) : (

                        <Button
                          variant="accent"
                          onClick={() =>
                            setBarreraNuevoObjetivo(barrera)
                          }
                        >
                          Nuevo objetivo
                        </Button>

                      )}

                      <Button
                        variant="danger"
                        onClick={() =>
                          borrarBarrera(barrera.id)
                        }
                      >
                        Eliminar
                      </Button>

                    </div>

                  </div>

                )}

              </div>

            );

          })}

        </div>

      )}


      {/* Modales */}

      {mostrarModal && (

        <NuevaBarreraModal
          clienteId={clienteId}
          onClose={() =>
            setMostrarModal(false)
          }
          onGuardado={() => {

            recargar();

            setMostrarModal(false);

          }}
        />

      )}


      {barreraSeleccionada && (

        <EvaluarBarreraModal
          barrera={barreraSeleccionada}
          onClose={() =>
            setBarreraSeleccionada(null)
          }
          onGuardado={() => {

            recargar();

            setBarreraSeleccionada(null);

          }}
        />

      )}


      {barreraNuevoObjetivo && (

        <NuevoObjetivoModal
          barrera={barreraNuevoObjetivo}
          onClose={() =>
            setBarreraNuevoObjetivo(null)
          }
          onGuardado={() => {

            recargar();

            setBarreraNuevoObjetivo(null);

          }}
        />

      )}

    </Card>
  );
}