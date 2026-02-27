import type { Sesion } from "../../types";

type Props = {
  sesiones: Sesion[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const SesionList = ({ sesiones, selectedId, onSelect }: Props) => {
  if (sesiones.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">
        No hay sesiones asignadas todavía.
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {sesiones.map((sesion) => (
        <div
          key={sesion.id}
          onClick={() => onSelect(sesion.id)}
          className={`cursor-pointer rounded border p-2 ${
            selectedId === sesion.id ? "bg-blue-100 border-blue-400" : "bg-white border-slate-200"
          }`}
        >
          <p className="text-sm font-semibold text-slate-900">
            Fecha: {sesion.fecha}
          </p>
          <p className="text-xs text-slate-600">
            Duración estimada: {sesion.duracionEstimada}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SesionList;

