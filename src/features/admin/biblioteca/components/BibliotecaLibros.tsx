import { useState } from "react";

import { useTrainingBooks } from "../hooks/useTrainingBooks";

import LibroCard from "./LibroCard";
import NuevoLibroModal from "./NuevoLibroModal";

import {
  Button,
  SectionTitle,
  EmptyState,
  Loading,
} from "../../../../shared/ui";

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

    <div className="space-y-6 animate-fadeIn">

      <div
        className="
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-end
          md:justify-between
        "
      >

        <SectionTitle
          title="Biblioteca de ejercicios"
          description="Organiza tus libros de entrenamiento y reutilízalos con tus atletas."
        />

        <Button
          variant="accent"
          onClick={() => setModalAbierto(true)}
        >
          + Nuevo libro
        </Button>

      </div>

      {loading && (
        <Loading text="Cargando biblioteca..." />
      )}

      {!loading && libros.length === 0 && (

        <EmptyState
          title="Todavía no hay libros creados"
          description="Creá tu primer libro de entrenamiento para comenzar a organizar tus sesiones."
          action={
            <Button
              variant="accent"
              onClick={() => setModalAbierto(true)}
            >
              Crear primer libro
            </Button>
          }
        />

      )}

      {!loading && libros.length > 0 && (

        <div
          className="
            grid
            gap-5
            lg:grid-cols-2
          "
        >

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