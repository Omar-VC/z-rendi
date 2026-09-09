import { useState } from "react";

import { useSesionesPendientes } from "../hooks/useSesionesPendientes";
import NuevaSesionPendienteModal from "./NuevaSesionPendienteModal";
import { eliminarSesionPendiente } from "../services/sesionesPendientes.service";
import type { SesionPendiente } from "../types/sesionPendiente";

import { Card, Button, EmptyState } from "../../../../shared/ui";

type Props = {
  clienteId: string;
  preparadorId: string;
};

export default function SesionesPendientesPanel({
  clienteId,
  preparadorId,
}: Props) {
  const { sesiones, loading } = useSesionesPendientes(clienteId, preparadorId);
  const [mostrarModal, setMostrarModal] = useState(false);

  function formatearFecha(fecha: Date) {
    return fecha.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  async function cancelarSesion(id: string) {
    const confirmar = window.confirm("¿Cancelar esta sesión pendiente?");
    if (!confirmar) return;

    await eliminarSesionPendiente(id);
  }

  function enviarWhatsApp(sesion: SesionPendiente) {
    const enlace = `${window.location.origin}/cliente/sesion/${sesion.id}`;

    const mensaje = `🏋️ *Nueva sesión de entrenamiento*

📅 Fecha: ${formatearFecha(sesion.fecha)}
📚 Libro: ${sesion.libroNombre}

🎯 Objetivo:
${sesion.objetivo}

Abrí tu sesión desde este enlace:
${enlace}`;

    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  }

  return (
    <>
      <Card className="!p-4 bg-surface/70 border-border/60">
        {/* CABECERA CON BOTÓN DE ACCIÓN */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-text">
                Sesiones Pendientes
              </h3>
              <span className="text-[10px] font-bold text-warning bg-warning/10 border border-warning/30 px-2 py-0.5 rounded-full">
                {sesiones.length}
              </span>
            </div>
            <p className="text-xs text-muted font-medium mt-0.5">
              Entrenamientos preparados listos para enviar al atleta
            </p>
          </div>

          <Button
            variant="accent"
            className="!min-h-0 h-8 !px-3 text-xs font-bold shadow-[0_0_12px_rgba(255,85,0,0.2)] shrink-0 self-start sm:self-auto"
            onClick={() => setMostrarModal(true)}
          >
            + Asignar Sesión
          </Button>
        </div>

        {/* LISTADO O ESTADOS DE CARGA */}
        <div className="mt-4">
          {loading && (
            <div className="space-y-2 animate-pulse">
              <div className="h-16 bg-surfaceSoft/50 rounded-xl border border-border/30" />
            </div>
          )}

          {!loading && sesiones.length === 0 && (
            <div className="py-4">
              <EmptyState title="No hay sesiones pendientes asignadas" />
            </div>
          )}

          {!loading && sesiones.length > 0 && (
            <div className="space-y-3">
              {sesiones.map((sesion) => (
                <div
                  key={sesion.id}
                  className="p-3.5 rounded-xl border border-border/50 bg-surfaceSoft/30 hover:bg-surfaceSoft/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* INFORMACIÓN DE LA SESIÓN */}
                  <div className="min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-black text-text truncate">
                        {sesion.libroNombre}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-muted bg-surface px-2 py-0.5 rounded border border-border/30">
                        📅 {formatearFecha(sesion.fecha)}
                      </span>
                    </div>

                    <p className="text-xs text-text/90 font-medium">
                      <span className="text-muted font-bold uppercase tracking-wider text-[10px]">
                        Objetivo:{" "}
                      </span>
                      {sesion.objetivo}
                    </p>

                    {sesion.gruposMusculares.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {sesion.gruposMusculares.map((grupo, index) => (
                          <span
                            key={`${grupo}-${index}`}
                            className="text-[10px] font-bold text-text/80 bg-surface border border-border/40 px-2 py-0.5 rounded-md"
                          >
                            {String(grupo)}
                          </span>
                        ))}
                      </div>
                    )}

                    {sesion.observacionesPreparador && (
                      <p className="text-xs text-muted/80 italic font-medium pt-1">
                        "{sesion.observacionesPreparador}"
                      </p>
                    )}
                  </div>

                  {/* BOTONES DE ACCIÓN (WHATSAPP & CANCELAR) */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-border/30 w-full md:w-auto justify-end">
                    <Button
                      variant="danger"
                      className="!min-h-0 !h-8 !px-3 text-xs font-semibold opacity-70 hover:opacity-100"
                      onClick={() => cancelarSesion(sesion.id)}
                    >
                      Cancelar
                    </Button>

                    <button
                      onClick={() => enviarWhatsApp(sesion)}
                      className="h-8 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                    >
                      <span>💬</span> WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {mostrarModal && (
        <NuevaSesionPendienteModal
          clienteId={clienteId}
          onClose={() => setMostrarModal(false)}
          onGuardado={() => setMostrarModal(false)}
        />
      )}
    </>
  );
}