import type { HistorialBarrera as HistorialBarreraType } from "../types/barrera";

type Props = {
  historial?: HistorialBarreraType[];
};

function formatearFecha(fecha: any) {
  if (!fecha) return "";

  const date = fecha.toDate ? fecha.toDate() : new Date(fecha);

  return date.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
}

export default function HistorialBarrera({ historial }: Props) {
  if (!historial || historial.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border-t pt-3">
      <h4 className="font-semibold text-sm mb-2">Historial</h4>

      <div className="space-y-2">
        {historial.map((item) => (
          <div
            key={`${item.objetivo}-${item.resultado}`}
            className="bg-gray-50 rounded p-2 text-sm"
          >
            <div className="text-xs text-gray-500 mb-1">
              {formatearFecha(item.fecha)}
            </div>

            <div>Objetivo: {item.objetivo}</div>

            <div>Resultado: {item.resultado || "-"}</div>

            {item.observaciones && (
              <div className="text-gray-600 mt-1">{item.observaciones}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
