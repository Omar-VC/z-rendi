import { useState } from "react";

import { useAuth } from "../../../../auth/useAuth";

import { crearBarrera } from "../services/barrerasService";

import { usePhysicalTests } from "../../biblioteca/hooks/usePhysicalTests";

import type { PhysicalTest } from "../../biblioteca/types/physicalTest";

type Props = {
  clienteId: string;
  onClose: () => void;
  onGuardado: () => void;
};

export default function NuevaBarreraModal({
  clienteId,
  onClose,
  onGuardado,
}: Props) {
  const { user } = useAuth();

  const [pruebaId, setPruebaId] = useState("");

  const [pruebaSeleccionada, setPruebaSeleccionada] =
    useState<PhysicalTest | null>(null);

  const [objetivo, setObjetivo] = useState("");

  if (!user) return null;

  const preparadorId = user.uid;

  const { pruebas } = usePhysicalTests({
    preparadorId,
  });

  async function guardarBarrera() {
    if (!pruebaSeleccionada || !objetivo) {
      alert("Selecciona una prueba y completa el objetivo");

      return;
    }

    await crearBarrera({
      clienteId,

      preparadorId,

      pruebaId: pruebaSeleccionada.id,

      nombre: pruebaSeleccionada.nombre,

      categoria: pruebaSeleccionada.categoria,

      subcategoria: pruebaSeleccionada.subcategoria,

      unidad: pruebaSeleccionada.unidad,

      objetivo,

      estado: "pendiente",

      resultado: "",
    });

    onGuardado();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-lg p-6 w-full max-w-md space-y-4">

        <h2 className="text-xl font-bold">
          Nueva barrera
        </h2>


        <div>
          <label className="font-medium">
            Prueba física
          </label>

          <select
            value={pruebaId}
            onChange={(e) => {

              const prueba = pruebas.find(
                (p) => p.id === e.target.value
              );

              setPruebaId(e.target.value);

              setPruebaSeleccionada(
                prueba || null
              );

            }}
            className="w-full border rounded p-2 mt-1"
          >

            <option value="">
              Seleccionar prueba
            </option>


            {pruebas.map((prueba) => (

              <option
                key={prueba.id}
                value={prueba.id}
              >
                {prueba.nombre}
              </option>

            ))}

          </select>
        </div>


        {pruebaSeleccionada && (

          <div className="text-sm text-gray-600">

            <p>
              Categoría: {pruebaSeleccionada.categoria}
            </p>

            {pruebaSeleccionada.unidad && (

              <p>
                Unidad: {pruebaSeleccionada.unidad}
              </p>

            )}

          </div>

        )}


        <div>
          <label className="font-medium">
            Objetivo
          </label>

          <input
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            placeholder="Ej: 100 kg"
            className="w-full border rounded p-2 mt-1"
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
            onClick={guardarBarrera}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>

        </div>

      </div>
    </div>
  );
}