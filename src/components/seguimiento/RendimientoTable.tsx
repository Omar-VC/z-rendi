// src/components/seguimiento/RendimientoTable.tsx
import React, { useState } from "react";

interface BroncoTest {
  id: string;
  fecha?: string;
  tiempo?: string;
  tiempoSegundos?: number;
}

interface Registro {
  id?: string;
  nombre: string;
  apellido: string;
  edad?: number;
  altura?: number;
  peso?: number;
  fuerzaPress?: number;
  fuerzaSentadillas?: number;
  velocidadDistancia?: number;
  velocidadTiempo?: number;
  resistenciaAerobica?: string;
  resistenciaAnaerobica?: string;
  broncoTests?: BroncoTest[];
  fechaRegistro?: any;
}

interface RendimientoTableProps {
  registros: Registro[];
  onDelete: (id: string) => void;
  onEdit: (registro: Registro) => void;
  onUpdateBronco: (registroId: string, broncoId: string, nuevo: BroncoTest) => Promise<void>;
}

const parseTimeToSeconds = (input: string): number | null => {
  if (!input) return null;
  const trimmed = input.trim();
  const mmss = /^(\d{1,2}):([0-5]?\d(?:\.\d+)?)$/;
  const secondsOnly = /^(\d+(?:\.\d+)?)$/;
  if (mmss.test(trimmed)) {
    const [, mm, ss] = trimmed.match(mmss)!;
    return Number(mm) * 60 + Number(ss);
  } else if (secondsOnly.test(trimmed)) {
    return Number(trimmed);
  }
  return null;
};

const RendimientoTable: React.FC<RendimientoTableProps> = ({ registros, onDelete, onEdit, onUpdateBronco }) => {
  const [editingBronco, setEditingBronco] = useState<{ registroId: string; broncoId: string } | null>(null);
  const [editFecha, setEditFecha] = useState("");
  const [editTiempo, setEditTiempo] = useState("");

  if (registros.length === 0) {
    return <p className="text-slate-300">Todavía no hay registros en esta planilla.</p>;
  }

  const startEditBronco = (registroId: string, b: BroncoTest) => {
    setEditingBronco({ registroId, broncoId: b.id });
    setEditFecha(b.fecha ?? "");
    setEditTiempo(b.tiempo ?? "");
  };

  const saveEditBronco = async () => {
    if (!editingBronco) return;
    const tiempoSeg = parseTimeToSeconds(editTiempo);
    if (tiempoSeg === null) {
      alert("Formato de tiempo inválido. Usá mm:ss o segundos (ej. 85 o 1:25).");
      return;
    }
    const nuevo: BroncoTest = { id: editingBronco.broncoId, fecha: editFecha, tiempo: editTiempo, tiempoSegundos: tiempoSeg };
    try {
      await onUpdateBronco(editingBronco.registroId, editingBronco.broncoId, nuevo);
      setEditingBronco(null);
      setEditFecha("");
      setEditTiempo("");
    } catch (err) {
      console.error("Error guardando Bronco Test:", err);
      alert("No se pudo guardar el Bronco Test. Revisa la consola.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-secondary/40 text-white">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Edad</th>
            <th className="px-4 py-2">Altura</th>
            <th className="px-4 py-2">Peso</th>
            <th className="px-4 py-2">Fuerza (Press)</th>
            <th className="px-4 py-2">Fuerza (Sentadillas)</th>
            <th className="px-4 py-2">Velocidad</th>
            <th className="px-4 py-2">Resistencia Aeróbica</th>
            <th className="px-4 py-2">Resistencia Anaeróbica</th>
            <th className="px-4 py-2">Bronco Tests</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((r) => (
            <tr key={r.id} className="border-b border-white/20 hover:bg-secondary/30">
              <td className="px-4 py-2">{r.nombre} {r.apellido}</td>
              <td className="px-4 py-2">{r.edad ?? "-"}</td>
              <td className="px-4 py-2">{r.altura ? `${r.altura} m` : "-"}</td>
              <td className="px-4 py-2">{r.peso ? `${r.peso} kg` : "-"}</td>
              <td className="px-4 py-2">{r.fuerzaPress ? `${r.fuerzaPress} kg` : "-"}</td>
              <td className="px-4 py-2">{r.fuerzaSentadillas ? `${r.fuerzaSentadillas} kg` : "-"}</td>
              <td className="px-4 py-2">
                {r.velocidadDistancia ? `${r.velocidadDistancia} m` : "-"} {r.velocidadTiempo ? ` / ${r.velocidadTiempo} s` : ""}
              </td>
              <td className="px-4 py-2">{r.resistenciaAerobica ?? "-"}</td>
              <td className="px-4 py-2">{r.resistenciaAnaerobica ?? "-"}</td>
              <td className="px-4 py-2">
                {r.broncoTests && r.broncoTests.length > 0 ? (
                  <ul className="list-none p-0 m-0">
                    {r.broncoTests.map((b) => (
                      <li key={b.id} className="text-sm mb-1">
                        {editingBronco && editingBronco.registroId === r.id && editingBronco.broncoId === b.id ? (
                          <div className="flex gap-2 items-end">
                            <input type="date" value={editFecha} onChange={(e) => setEditFecha(e.target.value)} className="input" />
                            <input type="text" value={editTiempo} onChange={(e) => setEditTiempo(e.target.value)} className="input" />
                            <button onClick={saveEditBronco} className="btn btn-primary">Guardar</button>
                            <button onClick={() => setEditingBronco(null)} className="btn btn-secondary">Cancelar</button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <span>{b.fecha} — {b.tiempo} {b.tiempoSegundos ? `(${b.tiempoSegundos}s)` : ""}</span>
                            <div className="flex gap-2">
                              <button onClick={() => onEdit(r)} className="btn btn-secondary">Editar registro</button>
                              <button onClick={() => startEditBronco(r.id!, b)} className="btn btn-secondary">Editar Bronco</button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "-"
                )}
              </td>
              <td className="px-4 py-2 flex gap-2">
                <button onClick={() => onEdit(r)} className="btn btn-secondary">Editar</button>
                {r.id && (
                  <button onClick={() => onDelete(r.id!)} className="btn btn-danger">Eliminar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RendimientoTable;
