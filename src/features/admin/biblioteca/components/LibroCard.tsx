import type { TrainingBook } from "../types/trainingBook";

type Props = {
  libro: TrainingBook;
};

export default function LibroCard({ libro }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">

      <h3 className="font-semibold text-lg">
        {libro.nombre}
      </h3>

      <p className="text-sm text-gray-500">
        {libro.categoria}
      </p>

      <p className="mt-2">

        {libro.ejercicios.length} ejercicios

      </p>

    </div>
  );
}