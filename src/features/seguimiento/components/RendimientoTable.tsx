// src/components/seguimiento/ui/RendimientoTable.tsx
import React from "react";
import type { Registro, Atleta } from "../types";

interface RendimientoTableProps {
  registros: (Registro & { id?: string })[];
  atletas?: (Atleta & { id?: string })[];
  onDelete: (id: string) => void;
  onEdit: (r: Registro & { id?: string }) => void;
}

const RendimientoTable: React.FC<RendimientoTableProps> = ({
  registros,
  atletas = [],
  onDelete,
  onEdit,
}) => {
  const getAtleta = (id?: string) => atletas.find((a) => a.id === id);

  if (!registros || registros.length === 0) {
    return <p className="text-sm text-gray-500">No hay registros</p>;
  }

  const getColorCarga = (carga?: number | null) => {
    if (!carga) return "text-gray-400";
    if (carga <= 300) return "text-green-400";
    if (carga <= 600) return "text-yellow-400";
    return "text-red-400";
  };

  const renderMetricCell = (r: Registro) => {
    if (r.tipo === "diario") {
      return (
        <div className="space-y-1 text-sm">
          <div>
            <strong>Ánimo:</strong> {r.estadoAnimo ?? "-"}
          </div>
          <div>
            <strong>RPE:</strong> {r.rpe ?? "-"}
          </div>
          <div>
            <strong>Duración:</strong> {r.duracion ?? "-"} min
          </div>
          <div className={`font-bold text-sm ${getColorCarga(r.carga)}`}>
            Carga: {r.carga ?? "-"}
          </div>
        </div>
      );
    }

    if (r.tipo === "test") {
      return (
        <div className="space-y-1 text-sm">
          <div>
            <strong>Press:</strong> {r.fuerzaPress ?? "-"}
          </div>
          <div>
            <strong>Sentadilla:</strong> {r.fuerzaSentadillas ?? "-"}
          </div>
          <div>
            <strong>Salto:</strong> {r.saltoHorizontal ?? "-"}
          </div>
          <div>
            <strong>Velocidad:</strong> {r.velocidadDistancia ?? "-"} m /{" "}
            {r.velocidadTiempo ?? "-"} s
          </div>
          <div>
            <strong>Resistencia A:</strong> {r.resistenciaAerobica ?? "-"}
          </div>
          <div>
            <strong>Resistencia An:</strong> {r.resistenciaAnaerobica ?? "-"}
          </div>
          <div>
            <strong>Bronco:</strong> {r.broncoTest ?? "-"}
          </div>
        </div>
      );
    }

    if (r.tipo === "observacion") {
      return <div className="text-sm italic">{r.observaciones ?? "-"}</div>;
    }

    return null;
  };

  const formatFecha = (f: any) => {
    if (!f) return "-";
    if (f.seconds && typeof f.toDate === "function") {
      return f.toDate().toLocaleDateString();
    }
    if (f instanceof Date) return f.toLocaleDateString();
    try {
      return new Date(f).toLocaleDateString();
    } catch {
      return String(f);
    }
  };

  return (
    <table className="w-full table-auto border-collapse text-sm">
      <thead className="text-sm text-gray-400 border-b border-white/10">
        <tr>
          <th className="text-left py-2 px-2">Atleta</th>
          <th className="text-left py-2 px-2">Tipo</th>
          <th className="text-left py-2 px-2">Fecha</th>
          <th className="text-left py-2 px-2">Métricas</th>
          <th className="text-left py-2 px-2">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {registros.map((r) => {
          const atleta = getAtleta(r.atletaId);

          return (
            <tr
              key={r.id}
              className="border-t border-white/10 hover:bg-white/5 transition duration-200"
            >
              <td className="py-3 px-2">
                {atleta
                  ? `${atleta.nombre} ${atleta.apellido || ""}`
                  : "Sin atleta"}
              </td>

              <td className="py-3 px-2 capitalize text-gray-300">
                {r.tipo}
              </td>

              <td className="py-3 px-2">{formatFecha(r.fecha)}</td>

              <td className="py-3 px-2">{renderMetricCell(r)}</td>

              <td className="py-3 px-2 space-x-2">
                <button onClick={() => onEdit(r)} className="btn btn-sm">
                  Editar
                </button>

                <button
                  onClick={() => onDelete(r.id!)}
                  className="btn btn-sm btn-danger"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RendimientoTable;