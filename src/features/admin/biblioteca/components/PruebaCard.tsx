import type { PhysicalTest } from "../types/physicalTest";
import { eliminarPrueba } from "../services/physicalTestsService";
import { useState } from "react";
import EditarPruebaModal from "./EditarPruebaModal";

type Props = {
  prueba: PhysicalTest;
  onActualizado: () => void;
};

export default function PruebaCard({ prueba, onActualizado }: Props) {
  async function borrarPrueba() {
    const confirmar = window.confirm("¿Eliminar esta prueba física?");

    if (!confirmar) return;

    await eliminarPrueba(prueba.id);

    onActualizado();
  }

  const [mostrarEditar, setMostrarEditar] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
      <div>
        <h3 className="font-semibold">{prueba.nombre}</h3>

        <p className="text-sm text-gray-500">
          {prueba.categoria}

          {prueba.subcategoria !== "General" && ` • ${prueba.subcategoria}`}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setMostrarEditar(true)}
          className="px-3 py-1 rounded border hover:bg-gray-100"
        >
          Editar
        </button>

        <button
          onClick={borrarPrueba}
          className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
        >
          Eliminar
        </button>
      </div>

      {mostrarEditar && (
        <EditarPruebaModal
          prueba={prueba}
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
