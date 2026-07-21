import { useState } from "react";

import { useBarreras } from "../hooks/useBarreras";

import NuevaBarreraModal from "./NuevaBarreraModal";

import EvaluarBarreraModal from "./EvaluarBarreraModal";

import type { Barrera } from "../types/barrera";

import NuevoObjetivoModal from "./NuevoObjetivoModal";

import { eliminarBarrera } from "../services/barrerasService";

import HistorialBarrera from "./HistorialBarrera";

type Props = {
  clienteId: string;
};

export default function BarrerasPanel({ clienteId }: Props) {
  const { barreras, loading, recargar } = useBarreras(clienteId);

  async function borrarBarrera(id: string) {
    const confirmar = window.confirm("¿Eliminar esta barrera?");

    if (!confirmar) return;

    try {
      await eliminarBarrera(id);

      recargar();
    } catch (error) {
      console.error(error);

      alert("No se pudo eliminar la barrera.");
    }
  }

  const [mostrarModal, setMostrarModal] = useState(false);

  const [barreraSeleccionada, setBarreraSeleccionada] =
    useState<Barrera | null>(null);

  const [barreraNuevoObjetivo, setBarreraNuevoObjetivo] =
    useState<Barrera | null>(null);

  return (
    <div className="bg-grisSemiOscuro rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Barreras de progreso</h3>

        <button
          onClick={() => setMostrarModal(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          + Nueva prueba
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Cargando...</p>}

      {!loading && barreras.length === 0 && (
        <p className="text-sm text-gray-500">No hay pruebas registradas.</p>
      )}

      <div className="space-y-2">
        {barreras.map((barrera) => (
          <div key={barrera.id} className="border rounded p-3">
            <div className="font-medium">{barrera.nombre}</div>
            
            {barrera.categoria && (
              <div className="text-sm text-gray-500">{barrera.categoria}</div>
            )}

            <div className="text-sm">Objetivo: {barrera.objetivo}</div>

            <div className="text-sm">Estado: {barrera.estado}</div>
            
            <HistorialBarrera historial={barrera.historial} />

            <div className="mt-3 flex justify-between">
              {barrera.estado === "pendiente" ? (
                <button
                  onClick={() => setBarreraSeleccionada(barrera)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                >
                  Evaluar
                </button>
              ) : (
                <button
                  onClick={() => setBarreraNuevoObjetivo(barrera)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Nuevo objetivo
                </button>
              )}

              <button
                onClick={() => borrarBarrera(barrera.id)}
                className="px-3 py-1 border border-red-500 text-red-600 rounded text-sm hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <NuevaBarreraModal
          clienteId={clienteId}
          onClose={() => setMostrarModal(false)}
          onGuardado={() => {
            recargar();

            setMostrarModal(false);
          }}
        />
      )}

      {barreraSeleccionada && (
        <EvaluarBarreraModal
          barrera={barreraSeleccionada}
          onClose={() => setBarreraSeleccionada(null)}
          onGuardado={() => {
            recargar();

            setBarreraSeleccionada(null);
          }}
        />
      )}

      {barreraNuevoObjetivo && (
        <NuevoObjetivoModal
          barrera={barreraNuevoObjetivo}
          onClose={() => setBarreraNuevoObjetivo(null)}
          onGuardado={() => {
            recargar();

            setBarreraNuevoObjetivo(null);
          }}
        />
      )}
    </div>
  );
}
