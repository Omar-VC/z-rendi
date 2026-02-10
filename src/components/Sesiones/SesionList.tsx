import type { Sesion } from "../../types";

type Props = {
  sesiones: Sesion[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const SesionList = ({ sesiones, selectedId, onSelect }: Props) => (
  <ul className="space-y-3">
    {sesiones.map((sesion) => {
      const isSelected = sesion.id === selectedId;
      return (
        <li
          key={sesion.id}
          className={`rounded-lg border p-3 transition ${
            isSelected ? "border-violet-600 bg-violet-50" : "border-slate-200 bg-white"
          }`}
        >
          <button className="w-full text-left" type="button" onClick={() => onSelect(sesion.id)}>
            <p className="font-semibold text-slate-900">{sesion.atleta}</p>
            <p className="text-sm capitalize text-slate-600">{sesion.tipo}</p>
            <p className="text-sm text-slate-600">{sesion.fecha}</p>
          </button>
        </li>
      );
    })}
  </ul>
);

export default SesionList;
