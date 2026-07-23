import { useState } from "react";

import { useSeguimiento } from "../hooks/useSeguimiento";

import NuevaSesionModal from "./NuevaSesionModal";
import UltimaSesionCard from "./UltimaSesionCard";
import RegistroSesiones from "./RegistroSesiones";
import BarrerasPanel from "./BarrerasPanel";
import CargaMensualCard from "./CargaMensualCard";
import CargaSemanalCard from "./CargaSemanalCard";
import { eliminarSesion } from "../services/seguimientoService";

import { Button, SectionTitle } from "../../../../shared/ui";

type Props = {
  clienteId: string;
};

export default function SeguimientoPanel({ clienteId }: Props) {
  const [mostrarModal, setMostrarModal] = useState(false);

  const { sesiones, loading, recargar } = useSeguimiento(clienteId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <SectionTitle
          title="Seguimiento deportivo"
          description="Control de evolución, sesiones y objetivos del atleta."
        />

        <Button variant="accent" onClick={() => setMostrarModal(true)}>
          Nueva sesión
        </Button>
      </div>

      {loading ? (
        <p className="text-muted">Cargando sesiones...</p>
      ) : (
        <div className="space-y-8">
          <CargaMensualCard sesiones={sesiones} />

          <CargaSemanalCard sesiones={sesiones} />

          <UltimaSesionCard sesion={sesiones[0]} />

          <RegistroSesiones
            sesiones={sesiones}
            onEliminarSesion={async (id) => {
              await eliminarSesion(id);
              recargar();
            }}
          />

          <BarrerasPanel clienteId={clienteId} />
        </div>
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
