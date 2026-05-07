import type { Sesion } from "../types";

type Props = {
  historial: Sesion[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
};

const HistorialSesiones = ({
  historial,
  selectedId,
  onSelect,
  onClear,
}: Props) => {
  if (historial.length === 0) {
    return (
      <div className="text-gray-300 text-sm italic">
        No hay sesiones completadas todavía.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">
          Historial de sesiones
        </h3>

        <button
          onClick={onClear}
          className="btn btn-danger text-sm"
        >
          Limpiar historial
        </button>
      </div>

      <div className="grid gap-3">
        {historial.map((sesion) => {
          const isSelected =
            selectedId === sesion.id;

          return (
            <div
              key={sesion.id}
              onClick={() => onSelect(sesion.id)}
              className={`card cursor-pointer p-3 ${
                isSelected
                  ? "ring-2 ring-highlight scale-105"
                  : ""
              }`}
            >
              <span className="font-semibold">
                {sesion.fecha}
              </span>

              <span className="text-green-400 font-medium capitalize">
                Completada
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistorialSesiones;