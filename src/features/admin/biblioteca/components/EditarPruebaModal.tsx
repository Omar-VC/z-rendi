import { useState } from "react";

import {
  actualizarPrueba,
} from "../services/physicalTestsService";

import type {
  PhysicalTest,
  CategoriaPrueba,
  SubcategoriaPrueba,
} from "../types/physicalTest";

type Props = {
  prueba: PhysicalTest;
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

const subcategorias: SubcategoriaPrueba[] = [
  "General",
  "Superior",
  "Inferior",
];

export default function EditarPruebaModal({
  prueba,
  onClose,
  onGuardado,
}: Props) {

  const [nombre, setNombre] = useState(prueba.nombre);

  const [categoria, setCategoria] =
    useState<CategoriaPrueba>(prueba.categoria);

  const [subcategoria, setSubcategoria] =
    useState<SubcategoriaPrueba>(prueba.subcategoria);

  const [unidad, setUnidad] =
    useState(prueba.unidad);

  async function guardar() {

    await actualizarPrueba(prueba.id, {

      nombre,

      categoria,

      subcategoria,

      unidad,

    });

    onGuardado();

  }

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">

        <h2 className="text-lg font-semibold">
          Editar prueba
        </h2>

        <input
          value={nombre}
          onChange={(e)=>setNombre(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <select
          value={categoria}
          onChange={(e)=>setCategoria(e.target.value as CategoriaPrueba)}
          className="w-full border rounded px-3 py-2"
        >
          {categorias.map(cat=>(
            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          ))}
        </select>

        <select
          value={subcategoria}
          onChange={(e)=>setSubcategoria(e.target.value as SubcategoriaPrueba)}
          className="w-full border rounded px-3 py-2"
        >
          {subcategorias.map(sub=>(
            <option
              key={sub}
              value={sub}
            >
              {sub}
            </option>
          ))}
        </select>

        <input
          value={unidad}
          onChange={(e)=>setUnidad(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

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