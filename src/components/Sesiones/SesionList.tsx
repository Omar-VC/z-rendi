// src/components/sesiones/SesionList.tsx
import type { Sesion } from "../../types";

type Props = {
  sesiones: Sesion[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const SesionList = ({ sesiones, selectedId, onSelect }: Props) => {
  if (sesiones.length === 0) {
    return (
      <div className="card text-center text-sm text-gray-300">
        No hay sesiones asignadas todavía.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {sesiones.map((sesion) => {
        const isSelected = selectedId === sesion.id;

        return (
          <div
            key={sesion.id}
            onClick={() => onSelect(sesion.id)}
            className={`card cursor-pointer p-4 ${
              isSelected ? "ring-2 ring-highlight scale-105" : ""
            }`}
          >
            <p className="text-lg font-bold text-white">
              📅 {sesion.fecha}
            </p>
            <p className="text-sm text-gray-200">
              ⏱ Duración estimada: {sesion.duracionEstimada}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SesionList;


