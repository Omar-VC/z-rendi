// src/components/seguimiento/RendimientoTable.tsx
import React from "react";
import type { Registro, Atleta } from "../../types/seguimiento";


interface RendimientoTableProps {
  registros: (Registro & { id?: string })[];
  atletas?: (Atleta & { id?: string })[];
  onDelete: (id: string) => void;
  onEdit: (r: Registro & { id?: string }) => void;
}

const RendimientoTable: React.FC<RendimientoTableProps> = ({ registros, atletas = [], onDelete, onEdit }) => {
  const getAtleta = (id?: string) => atletas.find((a) => a.id === id);

  if (!registros || registros.length === 0) {
    return <p>No hay registros</p>;
  }

  const renderMetricCell = (r: Registro) => {
    if (r.tipo === "diario") {
      return (
        <>
          <div>Estado ánimo: {r.estadoAnimo ?? "-"}</div>
          <div>RPE: {r.rpe ?? "-"}</div>
          <div>Duración: {r.duracion ?? "-"} min</div>
          <div>Carga: {r.carga ?? "-"}</div>
        </>
      );
    }

    if (r.tipo === "test") {
      return (
        <>
          <div>Press: {r.fuerzaPress ?? "-"}</div>
          <div>Sentadilla: {r.fuerzaSentadillas ?? "-"}</div>
          <div>Salto: {r.saltoHorizontal ?? "-"}</div>
          <div>Velocidad: {r.velocidadDistancia ?? "-"} m / {r.velocidadTiempo ?? "-"} s</div>
          <div>Resistencia A: {r.resistenciaAerobica ?? "-"}</div>
          <div>Resistencia An: {r.resistenciaAnaerobica ?? "-"}</div>
          <div>Bronco: {r.broncoTest ?? "-"}</div>
        </>
      );
    }

    if (r.tipo === "observacion") {
      return <div>{r.observaciones ?? "-"}</div>;
    }

    return null;
  };

  const formatFecha = (f: any) => {
    if (!f) return "-";
    // Firestore Timestamp handling
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
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr>
          <th className="text-left">Atleta</th>
          <th className="text-left">Tipo</th>
          <th className="text-left">Fecha</th>
          <th className="text-left">Métricas</th>
          <th className="text-left">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {registros.map((r) => {
          const atleta = getAtleta(r.atletaId);
          return (
            <tr key={r.id} className="border-t">
              <td className="py-2">
                {atleta ? `${atleta.nombre} ${atleta.apellido || ""}` : "Sin atleta"}
              </td>
              <td>{r.tipo}</td>
              <td>{formatFecha(r.fecha)}</td>
              <td>{renderMetricCell(r)}</td>
              <td className="space-x-2">
                <button onClick={() => onEdit(r)} className="btn btn-sm">Editar</button>
                <button onClick={() => onDelete(r.id!)} className="btn btn-sm btn-danger">Eliminar</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RendimientoTable;
