import { useState } from "react";

import { useAuth } from "../../../../auth/useAuth";
import { useSeguimiento } from "../hooks/useSeguimiento";

import NuevaSesionModal from "./NuevaSesionModal";
import UltimaSesionCard from "./UltimaSesionCard";
import RegistroSesiones from "./RegistroSesiones";
import BarrerasPanel from "./BarrerasPanel";
import CargaResumen from "./CargaResumen";
import SesionesPendientesPanel from "./SesionesPendientesPanel";

import { eliminarSesion } from "../services/seguimientoService";

import { Button } from "../../../../shared/ui";

type Props = {
  clienteId: string;
};

export default function SeguimientoPanel({ clienteId }: Props) {
  const { user } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);
  const { sesiones, loading, recargar } = useSeguimiento(clienteId);

  if (!user) return null;

  const preparadorId = user.uid;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* CABECERA & ACCIÓN PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h2 className="text-lg font-black text-text uppercase tracking-tight">
            Seguimiento Deportivo
          </h2>
          <p className="text-xs text-muted font-medium mt-0.5">
            Control de evolución, sesiones de entrenamiento y barreras del atleta.
          </p>
        </div>

        <Button
          variant="accent"
          className="!min-h-0 h-9 !px-4 text-xs font-bold shadow-[0_0_12px_rgba(255,85,0,0.25)] shrink-0 self-start sm:self-auto"
          onClick={() => setMostrarModal(true)}
        >
          + Nueva Sesión
        </Button>
      </div>

      {/* CONTENIDO Y ESTADOS DE CARGA */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-surfaceSoft/60 rounded-xl border border-border/40" />
          <div className="h-32 bg-surfaceSoft/60 rounded-xl border border-border/40" />
          <div className="h-48 bg-surfaceSoft/60 rounded-xl border border-border/40" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* PANEL DE SESIONES PENDIENTES */}
          <SesionesPendientesPanel
            clienteId={clienteId}
            preparadorId={preparadorId}
          />

          {/* MÉTRICAS & RESUMEN DE CARGAS */}
          <CargaResumen sesiones={sesiones} />

          {/* DETALLE DE ÚLTIMA SESIÓN */}
          <UltimaSesionCard sesion={sesiones[0]} />

          {/* REGISTRO HISTÓRICO DE SESIONES */}
          <RegistroSesiones
            sesiones={sesiones}
            onEliminarSesion={async (id) => {
              await eliminarSesion(id);
              recargar();
            }}
          />

          {/* PANEL DE BARRERAS Y LIMITANTES */}
          <BarrerasPanel clienteId={clienteId} />
        </div>
      )}

      {/* MODAL DE NUEVA SESIÓN */}
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