import { useState } from "react";

import type { TrainingBook } from "../types/trainingBook";

import { eliminarLibro } from "../services/trainingBooksService";

import EditarLibroModal from "./EditarLibroModal";

import { Card, Button } from "../../../../shared/ui";


type Props = {
  libro: TrainingBook;
  onActualizado: () => void;
};


export default function LibroCard({
  libro,
  onActualizado,
}: Props) {

  const [mostrarEditar, setMostrarEditar] = useState(false);


  async function borrarLibro() {
    const confirmar = window.confirm(
      "¿Eliminar este libro de ejercicios?"
    );

    if (!confirmar) return;

    await eliminarLibro(libro.id);

    onActualizado();
  }


  return (
    <Card>

      <div className="flex flex-col gap-4">


        {/* Header */}
        <div>

          <h3 className="text-lg font-bold text-primary">
            {libro.nombre}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {libro.categoria}
          </p>

        </div>



        {/* Ejercicios */}
        <div>

          <p className="text-sm font-semibold text-primary mb-2">
            Ejercicios:
          </p>


          <ul className="
            text-sm
            text-slate-600
            list-disc
            ml-5
            space-y-1
          ">
            {libro.ejercicios
              .slice(0,4)
              .map((ejercicio) => (
                <li key={ejercicio}>
                  {ejercicio}
                </li>
              ))
            }
          </ul>


          {libro.ejercicios.length > 4 && (
            <p className="
              text-sm
              text-slate-400
              mt-2
            ">
              + {libro.ejercicios.length - 4} ejercicios más...
            </p>
          )}

        </div>



        {/* Acciones */}
        <div className="
          flex
          justify-end
          gap-2
          pt-3
          border-t
          border-gray-100
        ">

          <Button
            variant="secondary"
            onClick={() => setMostrarEditar(true)}
          >
            Editar
          </Button>


          <Button
            variant="danger"
            onClick={borrarLibro}
          >
            Eliminar
          </Button>


        </div>


      </div>



      {mostrarEditar && (
        <EditarLibroModal
          libro={libro}
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