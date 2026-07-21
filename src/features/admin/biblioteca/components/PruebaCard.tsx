import type { PhysicalTest } from "../types/physicalTest";

type Props = {
  prueba: PhysicalTest;
};

export default function PruebaCard({
  prueba,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">

      <div>

        <h3 className="font-semibold">
          {prueba.nombre}
        </h3>

        <p className="text-sm text-gray-500">
          {prueba.categoria}
        </p>

      </div>

      <div className="flex gap-2">

        <button
          className="px-3 py-1 rounded border hover:bg-gray-100"
        >
          Editar
        </button>

        <button
          className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
        >
          Eliminar
        </button>

      </div>

    </div>
  );
}