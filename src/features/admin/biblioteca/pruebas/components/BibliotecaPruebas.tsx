import { useState } from "react";

import { useAuth } from "../../../../../auth/useAuth";

import { usePhysicalTests } from "../hooks/usePhysicalTests";

import PruebaCard from "./PruebaCard";
import NuevaPruebaModal from "./NuevaPruebaModal";

import {
  Button,
  SectionTitle,
  Loading,
  EmptyState,
} from "../../../../../shared/ui";

export default function BibliotecaPruebas() {

  const { user } = useAuth();

  const [mostrarModal, setMostrarModal] = useState(false);

  if (!user) return null;

  const {
    pruebas,
    loading,
    recargar,
  } = usePhysicalTests({
    preparadorId: user.uid,
  });

  return (

    <div className="space-y-6 animate-fadeIn">

      <div
        className="
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-end
          md:justify-between
        "
      >

        <SectionTitle
          title="Pruebas físicas"
          description="Gestiona las pruebas utilizadas para evaluar el rendimiento de tus atletas."
        />

        <Button
          variant="accent"
          onClick={() => setMostrarModal(true)}
        >
          + Nueva prueba
        </Button>

      </div>

      {loading && (
        <Loading text="Cargando pruebas..." />
      )}

      {!loading && pruebas.length === 0 && (

        <EmptyState
          title="Todavía no hay pruebas registradas"
          description="Creá tu primera prueba física para comenzar el seguimiento del rendimiento."
          action={
            <Button
              variant="accent"
              onClick={() => setMostrarModal(true)}
            >
              Crear primera prueba
            </Button>
          }
        />

      )}

      {!loading && pruebas.length > 0 && (

        <div className="grid gap-5">

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