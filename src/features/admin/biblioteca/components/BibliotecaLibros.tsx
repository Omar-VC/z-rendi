import { useState } from "react";

import { useTrainingBooks } from "../hooks/useTrainingBooks";
import LibroCard from "./LibroCard";
import NuevoLibroModal from "./NuevoLibroModal";

interface Props {
  preparadorId: string;
}

export default function BibliotecaLibros({
  preparadorId,
}: Props) {

  const {
    libros,
    loading,
    agregarLibro,
  } = useTrainingBooks(preparadorId);


  const [modalAbierto, setModalAbierto] = useState(false);


  return (
    <div className="space-y-4">


      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold">
          Biblioteca de ejercicios
        </h2>


        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setModalAbierto(true)}
        >
          + Nuevo libro
        </button>

      </div>



      {loading && (
        <p>
          Cargando libros...
        </p>
      )}



      {!loading && libros.length === 0 && (

        <div className="border rounded p-6 text-center">

          <p className="text-gray-500">
            Todavía no hay libros creados.
          </p>

          <p className="mt-2 font-semibold">
            Agrega tu primer libro de entrenamiento.
          </p>

        </div>

      )}



      {!loading && libros.length > 0 && (

        <div className="grid gap-4">

          {libros.map((libro) => (

            <LibroCard
              key={libro.id}
              libro={libro}
            />

          ))}

        </div>

      )}



      <NuevoLibroModal

        abierto={modalAbierto}

        cerrar={() =>
          setModalAbierto(false)
        }

        agregarLibro={agregarLibro}

        preparadorId={preparadorId}

      />


    </div>
  );
}