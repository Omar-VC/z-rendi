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

  // Se extrae la función de recarga para refrescar el Dashboard al completar la sesión
  const { sesiones, loading, refetch } = useSesionesPendientesCliente(user?.uid);

  const sesionDeHoy = sesiones[0];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* ENCABEZADO PRINCIPAL */}
      <ClienteHeader />

      {/* HERO SECTION: SESIÓN DE HOY */}
      {loading ? (
        <div className="w-full h-44 bg-surfaceSoft/40 border border-border/60 rounded-card animate-pulse flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted text-xs font-semibold">
            Cargando entrenamiento programado...
          </p>
        </div>
      ) : sesionDeHoy ? (
        <div className="relative group overflow-hidden rounded-card border-2 border-primary/60 bg-gradient-to-br from-surface via-surface to-primary/10 p-1 shadow-[0_0_35px_rgba(255,85,0,0.25)] hover:shadow-[0_0_50px_rgba(255,85,0,0.40)] transition-all duration-300">
          {/* Resplandor ambiental dinámico */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          <SesionDeHoyCard
            sesion={sesionDeHoy}
            onAbrir={() => setSesionSeleccionada(sesionDeHoy)}
          />
        </div>
      ) : (
        <div className="w-full p-6 bg-surfaceSoft/30 border border-border/60 rounded-card text-center space-y-1 backdrop-blur-sm">
          <p className="text-text font-extrabold text-base">
            ¡Entrenamiento al día! 🎉
          </p>
          <p className="text-muted text-xs">
            No tenés sesiones pendientes por registrar en este momento.
          </p>
        </div>
      )}

      {/* SECCIÓN 1: ESTADO Y RENDIMIENTO DE LA SEMANA */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
          Resumen de Actividad
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CuotaCard />
          <AsistenciaCard />
          <UltimaSesionCard />
        </div>
      </div>

      {/* SECCIÓN 2: EVOLUCIÓN E INFORMACIÓN PERSONAL */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
          Progreso & Perfil
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <ObjetivosCard />
          <ProgresoCard />
          <MiFichaCard />
        </div>
      </div>

      {/* MODAL PARA REGISTRAR DATOS POST-ENTRENAMIENTO */}
      {sesionSeleccionada && (
        <CompletarSesionModal
          sesion={sesionSeleccionada}
          onClose={() => setSesionSeleccionada(null)}
          onGuardar={async (datos) => {
            const carga = datos.duracion * datos.rpe;

            await completarSesionPendiente(sesionSeleccionada.id, {
              duracion: datos.duracion,
              rpe: datos.rpe,
              carga,
              observacionesCliente: datos.observaciones,
            });

            setSesionSeleccionada(null);
            if (refetch) refetch(); // Sincroniza el Dashboard al guardar
          }}
        />
      )}
    </div>
  );
}