import { useState } from "react";

import { useAuth } from "../../../../auth/useAuth";
import { useSesionesPendientesCliente } from "../hooks/useSesionesPendientesCliente";

import type { SesionPendiente } from "../../../admin/seguimiento/types/sesionPendiente";

import ClienteHeader from "../components/ClienteHeader";
import CuotaCard from "../components/CuotaCard";
import AsistenciaCard from "../components/AsistenciaCard";
import UltimaSesionCard from "../components/UltimaSesionCard";
import ObjetivosCard from "../components/ObjetivosCard";
import ProgresoCard from "../components/ProgresoCard";
import MiFichaCard from "../components/MiFichaCard";
import SesionDeHoyCard from "../components/SesionDeHoyCard";
import CompletarSesionModal from "../components/CompletarSesionModal";

import { completarSesionPendiente } from "../../../admin/seguimiento/services/sesionesPendientes.service";

export default function ClienteDashboard() {
  const { user } = useAuth();

  const [sesionSeleccionada, setSesionSeleccionada] =
    useState<SesionPendiente | null>(null);

  const { sesiones, loading } =
    useSesionesPendientesCliente(user?.uid);

  const sesionDeHoy = sesiones[0];

  return (
    <div className="space-y-6">
      <ClienteHeader />

      {!loading && sesionDeHoy && (
        <SesionDeHoyCard
          sesion={sesionDeHoy}
          onAbrir={() =>
            setSesionSeleccionada(sesionDeHoy)
          }
        />
      )}

      <CuotaCard />

      <AsistenciaCard />

      <UltimaSesionCard />

      <ObjetivosCard />

      <ProgresoCard />

      <MiFichaCard />

      {sesionSeleccionada && (
        <CompletarSesionModal
          sesion={sesionSeleccionada}
          onClose={() => setSesionSeleccionada(null)}
          onGuardar={async (datos) => {
            const carga = datos.duracion * datos.rpe;

            await completarSesionPendiente(
              sesionSeleccionada.id,
              {
                duracion: datos.duracion,
                rpe: datos.rpe,
                carga,
                observacionesCliente: datos.observaciones,
              },
            );

            setSesionSeleccionada(null);
          }}
        />
      )}
    </div>
  );
}