import { useMemo, useState } from "react";

import { useAuth } from "../../../../auth/useAuth";

import { useTrainingBooks } from "../../biblioteca/hooks/useTrainingBooks";

import { useSeguimiento } from "../hooks/useSeguimiento";

type Props = {
  clienteId: string;
  onClose: () => void;
  onGuardado: () => void;
};

export default function NuevaSesionModal({
  clienteId,
  onClose,
  onGuardado,
}: Props) {
  const { user } = useAuth();

  if (!user) return null;

  const { libros } = useTrainingBooks(user?.uid);

  const { agregarSesion } = useSeguimiento(clienteId);

  const [libroId, setLibroId] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [duracion, setDuracion] = useState(60);
  const [rpe, setRpe] = useState(5);
  const [observaciones, setObservaciones] = useState("");

  const carga = useMemo(() => {
    return duracion * rpe;
  }, [duracion, rpe]);

  async function guardarSesion() {
    const libro = libros.find((l) => l.id === libroId);

    if (!libro) {
      alert("Selecciona un libro.");
      return;
    }

    await agregarSesion({
      clienteId,
      preparadorId: user!.uid,
      libroId: libro.id,
      libroNombre: libro.nombre,
      fecha: new Date(fecha),
      duracion,
      rpe,
      carga,
      observaciones,
    });

    onGuardado();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">Nueva sesión</h2>

        <div>
          <label className="font-medium">Libro</label>

          <select
            value={libroId}
            onChange={(e) => setLibroId(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          >
            <option value="">Seleccionar libro</option>

            {libros.map((libro) => (
              <option key={libro.id} value={libro.id}>
                {libro.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium">Fecha</label>

          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <div>
          <label className="font-medium">Duración (min)</label>

          <input
            type="number"
            value={duracion}
            onChange={(e) => setDuracion(Number(e.target.value))}
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <div>
          <label className="font-medium">RPE</label>

          <input
            type="number"
            min={1}
            max={10}
            value={rpe}
            onChange={(e) => setRpe(Number(e.target.value))}
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <div className="bg-gray-100 rounded p-3">
          <strong>Carga:</strong> {carga}
        </div>

        <div>
          <label className="font-medium">Observaciones</label>

          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancelar
          </button>

          <button
            onClick={guardarSesion}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
