import { useAuth } from "../../../../auth/useAuth";
import { useSeguimiento } from "../hooks/useSeguimiento";

import UltimaSesionCard from "./UltimaSesionCard";
import RegistroSesiones from "./RegistroSesiones";
import BarrerasPanel from "./BarrerasPanel";
import CargaResumen from "./CargaResumen";
import SesionesPendientesPanel from "./SesionesPendientesPanel";

import { eliminarSesion } from "../services/seguimientoService";

type Props = {
  clienteId: string;
};

export default function SeguimientoPanel({ clienteId }: Props) {
  const { user } = useAuth();
  const { sesiones, loading, recargar } = useSeguimiento(clienteId);

  if (!user) return null;

  const preparadorId = user.uid;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* CABECERA DE SEGUIMIENTO (SIN EL BOTÓN DE NUEVA SESIÓN PRESENCIAL) */}
      <div className="pb-2 border-b border-border/40">
        <h2 className="text-lg font-black text-text uppercase tracking-tight">
          Seguimiento Deportivo
        </h2>
        <p className="text-xs text-muted font-medium mt-0.5">
          Control de evolución, sesiones de entrenamiento y barreras del atleta.
        </p>
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
          {/* PANEL DE SESIONES PENDIENTES (ACÁ ESTÁ TU BOTÓN "ASIGNAR SESIÓN") */}
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
    </div>
  );
}