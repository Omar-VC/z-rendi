import { useState } from "react";

import { actualizarBarrera } from "../services/barrerasService";

import type { Barrera } from "../types/barrera";

type Props = {
  barrera: Barrera;
  onClose: () => void;
  onGuardado: () => void;
};

export default function EvaluarBarreraModal({
  barrera,
  onClose,
  onGuardado,
}: Props) {

  const [resultado, setResultado] = useState(
    barrera.resultado ?? ""
  );

  const [observaciones, setObservaciones] = useState(
    barrera.observaciones ?? ""
  );

  async function guardar() {

    await actualizarBarrera(
      barrera.id,
      {
        resultado,
        observaciones,
        estado: "superada",
      }
    );

    onGuardado();

  }

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white text-black rounded-lg p-6 w-full max-w-md space-y-4">

        <h2 className="text-xl font-bold">
          Evaluar prueba
        </h2>

        <div>

          <p className="font-semibold">
            {barrera.nombre}
          </p>

          <p className="text-sm text-gray-500">
            Objetivo: {barrera.objetivo}
          </p>

        </div>

        <div>

          <label className="font-medium">
            Resultado
          </label>

          <input
            value={resultado}
            onChange={(e) =>
              setResultado(e.target.value)
            }
            className="w-full border rounded p-2 mt-1"
            placeholder="Ej: 110 kg"
          />

        </div>

        <div>

          <label className="font-medium">
            Observaciones
          </label>

          <textarea
            value={observaciones}
            onChange={(e) =>
              setObservaciones(e.target.value)
            }
            className="w-full border rounded p-2 mt-1"
            rows={3}
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
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Marcar como superada
          </button>

        </div>

      </div>

    </div>

  );

}