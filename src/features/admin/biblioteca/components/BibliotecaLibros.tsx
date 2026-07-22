import { useState } from "react";

import { useTrainingBooks } from "../hooks/useTrainingBooks";

import LibroCard from "./LibroCard";
import NuevoLibroModal from "./NuevoLibroModal";

import { Button, Card, SectionTitle } from "../../../../shared/ui";


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
    recargar,
  } = useTrainingBooks(preparadorId);


  const [modalAbierto, setModalAbierto] = useState(false);


  return (
    <div className="space-y-6">


      <div className="
        flex
        justify-between
        items-end
        gap-4
      ">

        <SectionTitle
          title="Biblioteca de ejercicios"
          description="Organiza tus libros de entrenamiento."
        />


        <Button
          variant="accent"
          onClick={() => setModalAbierto(true)}
        >
          + Nuevo libro
        </Button>


      </div>



      {loading && (
        <p className="text-slate-500">
          Cargando libros...
        </p>
      )}



      {!loading && libros.length === 0 && (

        <Card>

          <div className="
            text-center
            py-6
          ">

            <p className="
              text-slate-500
            ">
              Todavía no hay libros creados.
            </p>


            <p className="
              mt-2
              font-semibold
              text-primary
            ">
              Agrega tu primer libro de entrenamiento.
            </p>


          </div>

        </Card>

      )}




      {!loading && libros.length > 0 && (

        <div className="
          grid
          gap-4
        ">

          {libros.map((libro) => (
            <LibroCard
              key={libro.id}
              libro={libro}
              onActualizado={recargar}
            />
          ))}

        </div>

      )}



      <NuevoLibroModal
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        agregarLibro={agregarLibro}
        preparadorId={preparadorId}
      />


    </div>
  );
}