import { useState } from "react";

import { useSesionesPendientes } from "../hooks/useSesionesPendientes";
import NuevaSesionPendienteModal from "./NuevaSesionPendienteModal";
import { eliminarSesionPendiente } from "../services/sesionesPendientes.service";
import type { SesionPendiente } from "../types/sesionPendiente";

import { Card, Button, SectionTitle, EmptyState } from "../../../../shared/ui";

type Props = {
  clienteId: string;
};

export default function SesionesPendientesPanel({ clienteId }: Props) {
  const { sesiones, loading } = useSesionesPendientes(clienteId);

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
      <Card>
        <div
          className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
        >
          <SectionTitle
            title="Sesiones pendientes"
            description="Entrenamientos preparados para el atleta."
          />

          <Button variant="accent" onClick={() => setMostrarModal(true)}>
            Nueva sesión
          </Button>
        </div>

        <div className="mt-6">
          {loading && <p className="text-muted">Cargando sesiones...</p>}

          {!loading && sesiones.length === 0 && (
            <EmptyState title="No hay sesiones pendientes" />
          )}

          {!loading && sesiones.length > 0 && (
            <div className="space-y-4">
              {sesiones.map((sesion) => (
                <div
                  key={sesion.id}
                  className="
                    rounded-xl
                    border
                    border-border
                    bg-surface
                    p-5
                  "
                >
                  <div
                    className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-start
                    md:justify-between
                    gap-4
                  "
                  >
                    <div>
                      <h3
                        className="
                        text-lg
                        font-semibold
                        text-text
                      "
                      >
                        {sesion.libroNombre}
                      </h3>

                      <p
                        className="
                        text-sm
                        text-muted
                        mt-1
                      "
                      >
                        {formatearFecha(sesion.fecha)}
                      </p>

                      <p className="mt-4">
                        <span
                          className="
                          text-muted
                        "
                        >
                          Objetivo:
                        </span>

                        <span
                          className="
                          ml-2
                          font-semibold
                          text-text
                        "
                        >
                          {sesion.objetivo}
                        </span>
                      </p>

                      {sesion.observacionesPreparador && (
                        <p
                          className="
                          mt-3
                          text-sm
                          text-muted
                        "
                        >
                          {sesion.observacionesPreparador}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="accent"
                        onClick={() => enviarWhatsApp(sesion)}
                      >
                        WhatsApp
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => cancelarSesion(sesion.id)}
                      >
                        Cancelar
                      </Button>
                    </div>
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
