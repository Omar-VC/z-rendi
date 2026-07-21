import type { TrainingBook } from "../types/trainingBook";

import { eliminarLibro } from "../services/trainingBooksService";

import { useState } from "react";

import EditarLibroModal from "./EditarLibroModal";

type Props = {
  libro: TrainingBook;
  onActualizado: () => void;
};

export default function LibroCard({ libro, onActualizado }: Props) {
  async function borrarLibro() {
    const confirmar = window.confirm("¿Eliminar este libro de ejercicios?");

    if (!confirmar) return;

    await eliminarLibro(libro.id);

    onActualizado();
  }

  const [mostrarEditar, setMostrarEditar] = useState(false);

  return (
    <div className="bg-grisSemiOscuro rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg">{libro.nombre}</h3>

      <p className="text-sm text-gray-500">{libro.categoria}</p>

      <div className="mt-3">
        <p className="font-medium text-sm">Ejercicios:</p>

        <ul className="text-sm list-disc ml-5">
          {libro.ejercicios.slice(0, 4).map((ejercicio) => (
            <li key={ejercicio}>{ejercicio}</li>
          ))}
        </ul>

        {libro.ejercicios.length > 4 && (
          <p className="text-sm text-gray-500 mt-1">
            + {libro.ejercicios.length - 4} ejercicios más...
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setMostrarEditar(true)}
          className="px-3 py-1 rounded border hover:bg-gray-100"
        >
          Editar
        </button>

        <button
          onClick={borrarLibro}
          className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
        >
          Eliminar
        </button>
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
    </div>
  );
}
