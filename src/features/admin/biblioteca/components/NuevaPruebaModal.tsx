import { useState } from "react";

import { useAuth } from "../../../../auth/useAuth";

import { crearPrueba } from "../services/physicalTestsService";

import type { CategoriaPrueba } from "../types/physicalTest";

type Props = {
  onClose: () => void;
  onGuardado: () => void;
};

const categorias: CategoriaPrueba[] = [
  "Fuerza",
  "Potencia",
  "Velocidad",
  "Resistencia",
  "Movilidad",
];

export default function NuevaPruebaModal({ onClose, onGuardado }: Props) {
  const { user } = useAuth();

  const [nombre, setNombre] = useState("");

  const [categoria, setCategoria] = useState<CategoriaPrueba>("Fuerza");

  const [unidad, setUnidad] = useState("");

  async function guardar() {
    if (!user) return;
    if (!nombre.trim()) return;

    await crearPrueba({
      preparadorId: user.uid,
      nombre: nombre.trim(),
      categoria,
      unidad: unidad.trim(),
    });

    onGuardado();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-grisSemiOscuro rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Nueva prueba física</h2>

        <div>
          <label className="block text-sm mb-1">Nombre</label>

          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="bg-grisSemiOscuro w-full border rounded px-3 py-2"
            placeholder="Ej: Sprint 20 m"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Categoría</label>

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as CategoriaPrueba)}
            className="w-full border rounded px-3 py-2"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Unidad</label>

          <input
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Ej: kg, cm, seg"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancelar
          </button>

          <button
            onClick={guardar}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
