import { useState } from "react";
import type { TrainingBook } from "../types/trainingBook";

interface Props {
  abierto: boolean;
  cerrar: () => void;
  agregarLibro: (
    libro: Omit<TrainingBook, "id">
  ) => Promise<void>;
  preparadorId: string;
}

export default function NuevoLibroModal({
  abierto,
  cerrar,
  agregarLibro,
  preparadorId,
}: Props) {

  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] =
    useState<TrainingBook["categoria"]>("Fuerza");

  const [ejercicio, setEjercicio] = useState("");
  const [ejercicios, setEjercicios] = useState<string[]>([]);

  const [observaciones, setObservaciones] =
    useState("");


  if (!abierto) return null;


  async function guardar() {

    if (!nombre.trim()) return;

    await agregarLibro({
      preparadorId,
      nombre,
      categoria,
      ejercicios,
      observaciones,
    });

    cerrar();

    setNombre("");
    setEjercicios([]);
    setObservaciones("");
  }


  function agregarEjercicio() {

    if (!ejercicio.trim()) return;

    setEjercicios([
      ...ejercicios,
      ejercicio,
    ]);

    setEjercicio("");
  }


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-grisSemiOscuro text-white rounded-lg p-6 w-full max-w-md space-y-4">

        <h2 className="text-xl font-bold">
          Nuevo libro
        </h2>


        <input
          className="border p-2 w-full rounded bg-white text-black placeholder-gray-400"
          placeholder="Nombre del libro"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

    
        <select
          className="border p-2 w-full rounded bg-white text-black"
          value={categoria}
          onChange={(e) =>
            setCategoria(
              e.target.value as TrainingBook["categoria"]
            )
          }
        >
          <option>Fuerza</option>
          <option>Potencia</option>
          <option>Velocidad</option>
          <option>Resistencia</option>
          <option>Prevención</option>

        </select>


        <div className="flex gap-2">

          <input
            className="border p-2 flex-1 rounded bg-white text-black placeholder-gray-400"
            placeholder="Ejercicio"
            value={ejercicio}
            onChange={(e) =>
              setEjercicio(e.target.value)
            }
          />

          <button
            className="bg-botonAlt1 px-3 rounded"
            onClick={agregarEjercicio}
          >
            +
          </button>

        </div>


        <ul className="text-sm space-y-1">
          {ejercicios.map((e, index) => (
            <li key={index}>
              • {e}
            </li>
          ))}
        </ul>


        <textarea
          className="border p-2 w-full rounded bg-white text-black placeholder-gray-400"
          placeholder="Observaciones"
          value={observaciones}
          onChange={(e) =>
            setObservaciones(e.target.value)
          }
        />


        <div className="flex justify-end gap-2">

          <button
            className="px-4 py-2"
            onClick={cerrar}
          >
            Cancelar
          </button>


          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={guardar}
          >
            Guardar
          </button>

        </div>

      </div>

    </div>
  );
}