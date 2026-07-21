import { useState } from "react";

import { useAuth } from "../../../../auth/useAuth";

import { usePhysicalTests } from "../hooks/usePhysicalTests";

import PruebaCard from "./PruebaCard";
import NuevaPruebaModal from "./NuevaPruebaModal";

export default function BibliotecaPruebas() {
  const { user } = useAuth();

  const [mostrarModal, setMostrarModal] = useState(false);

  if (!user) return null;

  const { pruebas, loading, recargar } = usePhysicalTests({
    preparadorId: user.uid,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pruebas físicas</h2>

        <button
          onClick={() => setMostrarModal(true)}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Nueva prueba
        </button>
      </div>

      {loading ? (
        <p>Cargando pruebas...</p>
      ) : pruebas.length === 0 ? (
        <p className="text-gray-500">No hay pruebas registradas.</p>
      ) : (
        <div className="space-y-3">
          {pruebas.map((prueba) => (
            <PruebaCard
              key={prueba.id}
              prueba={prueba}
              onActualizado={recargar}
            />
          ))}
        </div>
      )}

      {mostrarModal && (
        <NuevaPruebaModal
          onClose={() => setMostrarModal(false)}
          onGuardado={() => {
            recargar();
            setMostrarModal(false);
          }}
        />
      )}
    </div>
  );
}
