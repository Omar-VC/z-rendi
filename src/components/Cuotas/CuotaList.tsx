import type { Cuota } from "../../types";

type Props = {
  cuotas: Cuota[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const CuotaList = ({ cuotas, selectedId, onSelect }: Props) => (
  <ul className="space-y-3">
    {cuotas.map((cuota) => {
      const isSelected = cuota.id === selectedId;
      const statusClasses = cuota.estado === "pagado" ? "text-emerald-700" : "text-amber-700";

      return (
        <li
          key={cuota.id}
          className={`rounded-lg border p-3 transition ${
            isSelected ? "border-emerald-600 bg-emerald-50" : "border-slate-200 bg-white"
          }`}
        >
          <button className="w-full text-left" type="button" onClick={() => onSelect(cuota.id)}>
            <p className="font-semibold text-slate-900">{cuota.atleta}</p>
            <p className={`text-sm font-medium capitalize ${statusClasses}`}>{cuota.estado}</p>
            <p className="text-sm text-slate-600">Vence: {cuota.fechaVencimiento}</p>
          </button>
        </li>
      );
    })}
  </ul>
);

export default CuotaList;
