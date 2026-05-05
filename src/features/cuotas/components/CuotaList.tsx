import type { Cuota } from "../types";

type Props = {
  cuotas: Cuota[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const CuotaList = ({ cuotas, selectedId, onSelect }: Props) => (
  <div className="space-y-3">
    {cuotas.map((cuota) => {
      const isSelected = cuota.id === selectedId;
      const statusClasses =
        cuota.estado === "pagada"
          ? "text-green-400 font-semibold"
          : "text-yellow-400 font-semibold";

      return (
        <div
          key={cuota.id}
          className={`card cursor-pointer ${
            isSelected ? "ring-2 ring-highlight scale-105" : ""
          }`}
          onClick={() => onSelect(cuota.id)}
        >
          <p className="text-lg font-bold">{cuota.mes}</p>
          <p className={`text-sm capitalize ${statusClasses}`}>
            {cuota.estado}
          </p>
        </div>
      );
    })}
  </div>
);

export default CuotaList;