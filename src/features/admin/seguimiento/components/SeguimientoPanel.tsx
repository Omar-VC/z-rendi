import { useState } from "react";

import { useSeguimiento } from "../hooks/useSeguimiento";

import NuevaSesionModal from "./NuevaSesionModal";
import UltimaSesionCard from "./UltimaSesionCard";
import RegistroSesiones from "./RegistroSesiones";

type Props = {
  clienteId: string;
};

export default function SeguimientoPanel({ clienteId }: Props) {
  const [mostrarModal, setMostrarModal] = useState(false);

  const {
    sesiones,
    loading,
    recargar,
  } = useSeguimiento(clienteId);

  return (
    <div className="space-y-6">

      <h3 className="text-lg font-semibold">
        Seguimiento deportivo
      </h3>


      {loading ? (

        <p>Cargando sesiones...</p>

      ) : (

        <>

          <UltimaSesionCard
            sesion={sesiones[0]}
          />


          <RegistroSesiones
            sesiones={sesiones}
            onNuevaSesion={() => setMostrarModal(true)}
          />

        </>

      )}


      {mostrarModal && (
        <NuevaSesionModal
          clienteId={clienteId}
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