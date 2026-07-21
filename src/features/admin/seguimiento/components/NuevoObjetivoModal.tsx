import { useState } from "react";

import { guardarNuevoObjetivo } from "../services/barrerasService";

import type { Barrera } from "../types/barrera";

type Props = {
  barrera: Barrera;
  onClose: () => void;
  onGuardado: () => void;
};

export default function NuevoObjetivoModal({
  barrera,
  onClose,
  onGuardado,
}: Props) {

  const [nuevoObjetivo, setNuevoObjetivo] = useState("");

  async function guardar() {

    if (!nuevoObjetivo.trim()) {
      alert("Ingresa un nuevo objetivo");
      return;
    }

    await guardarNuevoObjetivo(
      barrera.id,
      nuevoObjetivo.trim()
    );

    onGuardado();
  }

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white text-black rounded-lg p-6 w-full max-w-md space-y-4">

        <h2 className="text-xl font-bold">
          Nuevo objetivo
        </h2>

        <div>

          <p className="font-semibold">
            {barrera.nombre}
          </p>

          <p className="text-sm text-gray-500">
            Objetivo anterior: {barrera.objetivo}
          </p>

          <p className="text-sm text-gray-500">
            Resultado: {barrera.resultado || "-"}
          </p>

        </div>

        <div>

          <label className="font-medium">
            Nuevo objetivo
          </label>

          <input
            value={nuevoObjetivo}
            onChange={(e) => setNuevoObjetivo(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            placeholder="Ej: 120 kg"
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