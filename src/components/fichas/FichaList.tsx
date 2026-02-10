import type { Ficha } from "../../types";

type Props = {
  fichas: Ficha[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const FichaList = ({ fichas, selectedId, onSelect }: Props) => (
  <ul className="space-y-3">
    {fichas.map((ficha) => {
      const isSelected = ficha.id === selectedId;
      return (
        <li
          key={ficha.id}
          className={`rounded-lg border p-3 transition ${
            isSelected ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"
          }`}
        >
          <button className="w-full text-left" type="button" onClick={() => onSelect(ficha.id)}>
            <p className="font-semibold text-slate-900">{ficha.nombre} {ficha.apellido}</p>
            <p className="text-sm text-slate-600">{ficha.posicion}</p>
            <p className="text-sm text-slate-600">{ficha.edad} años · {ficha.peso} kg · {ficha.altura} cm</p>
          </button>
        </li>
      );
    })}
  </ul>
);

export default FichaList;
