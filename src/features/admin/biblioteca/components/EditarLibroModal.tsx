import { useState } from "react";

import type { TrainingBook } from "../types/trainingBook";

import { actualizarLibro } from "../services/trainingBooksService";

type Props = {
  libro: TrainingBook;
  onClose: () => void;
  onGuardado: () => void;
};

export default function EditarLibroModal({
  libro,
  onClose,
  onGuardado,
}: Props) {

  const [nombre, setNombre] = useState(libro.nombre);

  const [categoria, setCategoria] =
    useState<TrainingBook["categoria"]>(libro.categoria);

  const [ejercicios, setEjercicios] =
    useState(libro.ejercicios.join("\n"));

  const [observaciones, setObservaciones] =
    useState(libro.observaciones || "");


  async function guardar() {

    await actualizarLibro(libro.id, {

      nombre,

      categoria,

      ejercicios: ejercicios
        .split("\n")
        .map((e) => e.trim())
        .filter(Boolean),

      observaciones,

    });


    onGuardado();

  }


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">

        <h2 className="text-lg font-semibold">
          Editar libro
        </h2>


        <div>

          <label className="text-sm">
            Nombre
          </label>

          <input
            value={nombre}
            onChange={(e)=>setNombre(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

        </div>


        <div>

          <label className="text-sm">
            Categoría
          </label>

          <select
            value={categoria}
            onChange={(e)=>setCategoria(
              e.target.value as TrainingBook["categoria"]
            )}
            className="w-full border rounded px-3 py-2"
          >

            <option value="Fuerza">
              Fuerza
            </option>

            <option value="Potencia">
              Potencia
            </option>

            <option value="Velocidad">
              Velocidad
            </option>

            <option value="Resistencia">
              Resistencia
            </option>

            <option value="Prevención">
              Prevención
            </option>

          </select>

        </div>


        <div>

          <label className="text-sm">
            Ejercicios (uno por línea)
          </label>

          <textarea
            value={ejercicios}
            onChange={(e)=>setEjercicios(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={5}
          />

        </div>


        <div>

          <label className="text-sm">
            Observaciones
          </label>

          <textarea
            value={observaciones}
            onChange={(e)=>setObservaciones(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

        </div>


        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>


          <button
            onClick={guardar}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>

        </div>


      </div>

    </div>
  );
}