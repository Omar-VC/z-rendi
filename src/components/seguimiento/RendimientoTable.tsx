import React from "react";

interface BroncoTest {
  id: string;
  fecha?: string;
  tiempo?: string;
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
}

const RendimientoTable: React.FC<RendimientoTableProps> = ({ registros, onDelete, onEdit }) => {
  if (registros.length === 0) {
    return <p className="text-slate-300">Todavía no hay registros en esta planilla.</p>;
  }

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
                      <li key={b.id} className="text-sm">
                        {b.fecha} — {b.tiempo}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "-"
                )}
              </td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => onEdit(r)}
                  className="btn btn-secondary"
                >
                  Editar
                </button>
                {r.id && (
                  <button
                    onClick={() => onDelete(r.id!)}
                    className="btn btn-danger"
                  >
                    Eliminar
                  </button>
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

