import { useState } from "react";

import type { PhysicalTest } from "../types/physicalTest";

import { eliminarPrueba } from "../services/physicalTestsService";

import EditarPruebaModal from "./EditarPruebaModal";

import { Card, Button } from "../../../../shared/ui";


type Props = {
  prueba: PhysicalTest;
  onActualizado: () => void;
};


export default function PruebaCard({
  prueba,
  onActualizado,
}: Props) {

  const [mostrarEditar, setMostrarEditar] = useState(false);


  async function borrarPrueba() {
    const confirmar = window.confirm(
      "¿Eliminar esta prueba física?"
    );

    if (!confirmar) return;

    await eliminarPrueba(prueba.id);

    onActualizado();
  }


  return (
    <Card>

      <div className="
        flex
        items-center
        justify-between
        gap-4
      ">


        {/* Información */}
        <div>

          <h3 className="
            font-bold
            text-primary
          ">
            {prueba.nombre}
          </h3>


          <p className="
            text-sm
            text-slate-500
            mt-1
          ">
            {prueba.categoria}

            {prueba.subcategoria !== "General" &&
              ` • ${prueba.subcategoria}`
            }
          </p>

        </div>



        {/* Acciones */}
        <div className="
          flex
          gap-2
        ">

          <Button
            variant="secondary"
            onClick={() => setMostrarEditar(true)}
          >
            Editar
          </Button>


          <Button
            variant="danger"
            onClick={borrarPrueba}
          >
            Eliminar
          </Button>


        </div>


      </div>



      {mostrarEditar && (
        <EditarPruebaModal
          prueba={prueba}
          onClose={() => setMostrarEditar(false)}
          onGuardado={() => {
            onActualizado();
            setMostrarEditar(false);
          }}
        />
      )}


    </Card>
  );
}