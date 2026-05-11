// src/pages/PlanillaDetailPage.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { usePlanilla } from "../features/seguimiento/hooks/usePlanilla";
import AtletaForm from "../features/seguimiento/components/AtletaForm";
import RegistroForm from "../features/seguimiento/components/RegistroForm";

import type {
  Atleta,
  Registro,
} from "../features/seguimiento/types";

const PlanillaDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    registros,
    atletas,
    guardarAtleta,
    eliminarAtleta,
    guardarRegistro,
    eliminarRegistro,
  } = usePlanilla(id);

  const [showRegistroForm, setShowRegistroForm] = useState(false);
  const [showAtletaForm, setShowAtletaForm] = useState(false);

  const [filtroAtleta, setFiltroAtleta] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  const [editingRegistro, setEditingRegistro] = useState<
    (Registro & { id?: string }) | null
  >(null);

  const [editingAtleta, setEditingAtleta] = useState<
    (Atleta & { id?: string }) | null
  >(null);

  const handleEditRegistro = (r: Registro & { id?: string }) => {
    setEditingRegistro(r);
    setShowRegistroForm(true);
  };

  const handleEditAtleta = (a: Atleta & { id?: string }) => {
    setEditingAtleta(a);
    setShowAtletaForm(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Planilla</h1>

      {atletas.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-500/20">
          Debes crear un atleta primero
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setEditingAtleta(null);
            setShowAtletaForm(true);
          }}
          className="btn"
        >
          Crear atleta
        </button>

        <button
          onClick={() => {
            if (atletas.length === 0) {
              alert("Primero crear atleta");
              return;
            }
            setEditingRegistro(null);
            setShowRegistroForm(true);
          }}
          className="btn"
        >
          Nuevo registro
        </button>
      </div>

      {showAtletaForm && (
        <AtletaForm
          initialData={editingAtleta ?? undefined}
          onSave={guardarAtleta}
          onCancel={() => {
            setShowAtletaForm(false);
            setEditingAtleta(null);
          }}
        />
      )}

      {showRegistroForm && (
        <RegistroForm
          atletas={atletas}
          initialData={editingRegistro ?? undefined}
          onSave={guardarRegistro}
          onCancel={() => {
            setShowRegistroForm(false);
            setEditingRegistro(null);
          }}
        />
      )}

      <div className="flex gap-2 mb-4">
        <select
          value={filtroAtleta}
          onChange={(e) => setFiltroAtleta(e.target.value)}
          className="input"
        >
          <option value="">Todos los atletas</option>
          {atletas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre} {a.apellido}
            </option>
          ))}
        </select>

        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="input"
        >
          <option value="">Todos los tipos</option>
          <option value="diario">Diario</option>
          <option value="test">Test</option>
          <option value="observacion">Observación</option>
        </select>
      </div>

      <div className="mt-6 space-y-6">
        {atletas.map((atleta) => {
          const registrosFiltrados = registros.filter((r) => {
            if (r.atletaId !== atleta.id) return false;
            if (filtroAtleta && r.atletaId !== filtroAtleta) return false;
            if (filtroTipo && r.tipo !== filtroTipo) return false;
            return true;
          });

          return (
            <div key={atleta.id} className="card space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">
                    {atleta.nombre} {atleta.apellido}
                  </div>
                  <div className="text-sm text-gray-400">
                    {atleta.deporte ?? ""}{" "}
                    {atleta.posicion ? `- ${atleta.posicion}` : ""}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditAtleta(atleta)}
                    className="btn btn-sm"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarAtleta(atleta.id!)}
                    className="btn btn-sm btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {registrosFiltrados.map((r) => {
                  const atletaMatch = atletas.find(
                    (a) => a.id === r.atletaId
                  );

                  return (
                    <div key={r.id} className="card space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">
                            {atletaMatch
                              ? `${atletaMatch.nombre} ${
                                  atletaMatch.apellido || ""
                                }`
                              : "Sin atleta"}
                          </div>
                          <div className="text-sm text-gray-400 capitalize">
                            {r.tipo}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditRegistro(r)}
                            className="btn btn-sm"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarRegistro(r.id!)}
                            className="btn btn-sm btn-danger"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>

                      <div className="text-sm">
                        {r.tipo === "diario" && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>Ánimo: {r.estadoAnimo ?? "-"}</div>
                            <div>RPE: {r.rpe ?? "-"}</div>
                            <div>Duración: {r.duracion ?? "-"} min</div>
                            <div className="font-bold text-blue-400">
                              Carga: {r.carga ?? "-"}
                            </div>
                          </div>
                        )}

                        {r.tipo === "test" && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>Press: {r.fuerzaPress ?? "-"}</div>
                            <div>Sentadilla: {r.fuerzaSentadillas ?? "-"}</div>
                            <div>Salto: {r.saltoHorizontal ?? "-"}</div>
                            <div>
                              Velocidad: {r.velocidadDistancia ?? "-"} /{" "}
                              {r.velocidadTiempo ?? "-"}
                            </div>
                          </div>
                        )}

                        {r.tipo === "observacion" && (
                          <div className="italic text-gray-300">
                            {r.observaciones ?? "-"}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanillaDetailPage;