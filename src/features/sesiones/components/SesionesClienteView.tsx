import { useState } from "react";

import { useSesiones } from "../hooks/useSesiones";

import { completeSesion } from "../services/sesionesService";

const SesionesClienteView = ({
  clienteId,
}: {
  clienteId: string;
}) => {
  const { sesiones } = useSesiones(clienteId);

  const [expandedId, setExpandedId] =
    useState<string | null>(null);

  if (!sesiones || sesiones.length === 0) {
    return (
      <p className="text-gray-300">
        Todavía no tenés sesiones asignadas.
      </p>
    );
  }

  const pendientes = sesiones.filter(
    (s) => s.estado !== "completada"
  );

  const completadas = sesiones.filter(
    (s) => s.estado === "completada"
  );

  const sesionActual = pendientes[0];

  const marcarCompletada = async (
    sesionId: string
  ) => {
    try {
      await completeSesion(sesionId);

      alert("Sesión marcada como completada ✅");
    } catch (error) {
      console.error(
        "Error al marcar sesión:",
        error
      );

      alert("No se pudo marcar la sesión.");
    }
  };

  return (
    <div className="space-y-6">
      {sesionActual ? (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-white mb-2">
            Sesión actual
          </h2>

          <p className="text-gray-200">
            📅 Fecha: {sesionActual.fecha}
          </p>

          <p className="text-gray-200">
            ⏱ Duración:{" "}
            {sesionActual.duracionEstimada}
          </p>

          <p className="text-gray-200 whitespace-pre-line">
            📝 Bloques: {sesionActual.bloques}
          </p>

          <p className="text-gray-200">
            Estado: {sesionActual.estado}
          </p>

          <button
            onClick={() =>
              marcarCompletada(sesionActual.id)
            }
            className="btn btn-primary mt-4"
          >
            Marcar como completada
          </button>
        </div>
      ) : (
        <p className="text-gray-300">
          No tenés sesiones pendientes.
        </p>
      )}

      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-white mb-2">
          Historial
        </h2>

        {completadas.length > 0 ? (
          <ul className="space-y-3">
            {completadas.map((s) => (
              <li
                key={s.id}
                className="rounded-lg p-4 cursor-pointer transition-all duration-300 bg-white/5 hover:bg-white/10 border border-white/20"
                onClick={() =>
                  setExpandedId(
                    expandedId === s.id
                      ? null
                      : s.id
                  )
                }
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-200">
                    📅 {s.fecha}
                  </span>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-400">
                      Completada
                    </span>

                    <svg
                      className={`w-4 h-4 text-gray-200 transform transition-transform duration-300 ${
                        expandedId === s.id
                          ? "rotate-180"
                          : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedId === s.id
                      ? "max-h-40 mt-3"
                      : "max-h-0"
                  }`}
                >
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>
                      ⏱ Duración:{" "}
                      {s.duracionEstimada}
                    </p>

                    <p className="whitespace-pre-line">
                      📝 Bloques: {s.bloques}
                    </p>

                    <p>
                      Finalizada:{" "}
                      {s.completadaAt
                        ? new Date(
                            s.completadaAt
                          ).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">
            No hay sesiones completadas.
          </p>
        )}
      </div>
    </div>
  );
};

export default SesionesClienteView;