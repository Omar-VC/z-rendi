// src/components/cuotas/HistorialCuotas.tsx
import type { Cuota } from "../../types";

type Props = {
  historial: Cuota[];
  onClear: () => void;
};

const HistorialCuotas = ({ historial, onClear }: Props) => {
  if (historial.length === 0) {
    return (
      <div className="text-gray-300 text-sm italic">
        No hay cuotas pagadas todavía.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Historial de cuotas</h3>
        <button onClick={onClear} className="btn btn-danger text-sm">
          Limpiar historial
        </button>
      </div>

      <div className="space-y-3">
        {historial.map((cuota) => (
          <div
            key={cuota.id}
            className="card flex justify-between items-center p-3"
          >
            <span className="font-semibold">{cuota.mes}</span>
            <span className="text-green-400 font-medium capitalize">
              {cuota.estado}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorialCuotas;
