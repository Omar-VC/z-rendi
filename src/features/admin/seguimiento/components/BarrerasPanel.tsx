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

    if (estado === "pendiente") {
      return "warning" as const;
    }

    return "danger" as const;

  }



  return (

    <Card>


      <div className="flex flex-col md:flex-row md:justify-between gap-4">


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



      {loading && (

        <p className="text-muted">
          Cargando...
        </p>

      )}




      {!loading && barreras.length === 0 && (

        <p className="text-muted">
          No hay pruebas registradas.
        </p>

      )}





      <div className="space-y-4 mt-6">


        {barreras.map((barrera) => (


          <div
            key={barrera.id}
            className="
              rounded-xl
              border
              border-border
              bg-surface
              p-5
            "
          >


            <div className="flex flex-col md:flex-row md:justify-between gap-4">


              <div>


                <h3 className="font-semibold text-lg">
                  {barrera.nombre}
                </h3>


                {barrera.categoria && (

                  <p className="text-sm text-muted mt-1">
                    {barrera.categoria}
                  </p>

                )}



                <p className="mt-3">
                  Objetivo:
                  <span className="ml-2 font-semibold">
                    {barrera.objetivo}
                  </span>
                </p>


              </div>




              <Badge
                variant={estadoVariant(barrera.estado)}
              >
                {barrera.estado}
              </Badge>


            </div>




            <div className="mt-5">

              <HistorialBarrera
                historial={barrera.historial}
              />

            </div>




            <div className="flex flex-wrap gap-2 mt-5">


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


        ))}


      </div>





      {mostrarModal && (

        <NuevaBarreraModal
          clienteId={clienteId}
          onClose={() => setMostrarModal(false)}
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