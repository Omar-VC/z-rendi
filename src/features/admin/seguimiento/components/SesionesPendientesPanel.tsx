import { useState } from "react";

import { useSesionesPendientes } from "../hooks/useSesionesPendientes";
import NuevaSesionPendienteModal from "./NuevaSesionPendienteModal";
import { eliminarSesionPendiente } from "../services/sesionesPendientes.service";
import type { SesionPendiente } from "../types/sesionPendiente";
import { CalendarDays, CircleCheck, MessageCircle } from "lucide-react";

import { Button } from "../../../../shared/ui";

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
      <section className="rounded-2xl bg-surface/45 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text">Sesiones pendientes</h3>
              <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning">
                {sesiones.length}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted">
              Preparadas para compartir con el atleta.
            </p>
          </div>

          <Button
            variant="accent"
            className="!min-h-0 h-9 !px-3 text-xs font-semibold shrink-0 self-start sm:self-auto"
            onClick={() => setMostrarModal(true)}
          >
            + Asignar sesión
          </Button>
        </div>

        {/* LISTADO O ESTADOS DE CARGA */}
        <div className="mt-3">
          {loading && (
            <div className="h-14 animate-pulse rounded-xl bg-surfaceSoft/35" />
          )}

          {!loading && sesiones.length === 0 && (
            <div className="flex items-center gap-2 py-2 text-sm text-muted">
              <CircleCheck className="h-4 w-4 text-success" strokeWidth={1.8} aria-hidden="true" />
              <span>No hay sesiones pendientes asignadas.</span>
            </div>
          )}

          {!loading && sesiones.length > 0 && (
            <div className="divide-y divide-white/[0.06]">
              {sesiones.map((sesion) => (
                <div
                  key={sesion.id}
                  className="flex flex-col gap-3 py-4 first:pt-1 last:pb-0 md:flex-row md:items-center md:justify-between"
                >
                  {/* INFORMACIÓN DE LA SESIÓN */}
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-text truncate">
                        {sesion.libroNombre}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                        <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                        {formatearFecha(sesion.fecha)}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed text-text/85">
                      <span className="font-semibold text-muted">Objetivo: </span>
                      {sesion.objetivo}
                    </p>

                    {sesion.gruposMusculares.length > 0 && (
                      <p className="text-[11px] text-muted">{sesion.gruposMusculares.map(String).join(" · ")}</p>
                    )}

                    {sesion.observacionesPreparador && (
                      <p className="text-xs text-muted/80 italic">
                        {sesion.observacionesPreparador}
                      </p>
                    )}
                  </div>

                  {/* BOTONES DE ACCIÓN (WHATSAPP & CANCELAR) */}
                  <div className="flex w-full shrink-0 items-center justify-end gap-2 self-end md:w-auto md:self-center">
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
                      <MessageCircle className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" /> WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
