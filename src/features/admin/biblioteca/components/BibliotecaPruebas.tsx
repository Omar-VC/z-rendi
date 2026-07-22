import { useState } from "react";

import { useAuth } from "../../../../auth/useAuth";

import { usePhysicalTests } from "../hooks/usePhysicalTests";

import PruebaCard from "./PruebaCard";
import NuevaPruebaModal from "./NuevaPruebaModal";

import { Button, Card, SectionTitle } from "../../../../shared/ui";


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
    <div className="space-y-6">


      <div className="
        flex
        justify-between
        items-end
        gap-4
      ">

        <SectionTitle
          title="Pruebas físicas"
          description="Gestiona los indicadores utilizados para evaluar atletas."
        />


        <Button
          variant="accent"
          onClick={() => setMostrarModal(true)}
        >
          Nueva prueba
        </Button>


      </div>



      {loading && (
        <p className="text-slate-500">
          Cargando pruebas...
        </p>
      )}



      {!loading && pruebas.length === 0 && (

        <Card>

          <div className="text-center py-6">

            <p className="text-slate-500">
              No hay pruebas registradas.
            </p>

            <p className="
              mt-2
              text-sm
              text-primary
              font-semibold
            ">
              Agrega pruebas para comenzar el seguimiento físico.
            </p>

          </div>

        </Card>

      )}



      {!loading && pruebas.length > 0 && (

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