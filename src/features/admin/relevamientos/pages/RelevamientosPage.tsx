import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, Button } from "../../../../shared/ui";
import NuevoRelevamientoForm from "../components/NuevoRelevamientoForm";
import { useRelevamientos } from "../hooks/useRelevamientos";

export default function RelevamientosPage() {
  const navigate = useNavigate();
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  const { relevamientos, loading, error, crear, eliminar } = useRelevamientos();

  const manejarGuardar = async (datos: Parameters<typeof crear>[0]) => {
    await crear(datos);
    setMostrandoFormulario(false);
  };

  const manejarEliminar = async (id: string) => {
    const confirmar = window.confirm("¿Eliminar este relevamiento?");

    if (!confirmar) return;

    await eliminar(id);
  };

  if (mostrandoFormulario) {
    return (
      <div className="min-h-full bg-background p-4 sm:p-6 lg:p-8">
        <NuevoRelevamientoForm
          onGuardar={manejarGuardar}
          onCancelar={() => setMostrandoFormulario(false)}
        />
      </div>
    );
  }

  const relevamientosOrdenados = [...relevamientos].sort((a, b) =>
    b.fecha.localeCompare(a.fecha),
  );

  return (
    <div className="min-h-full bg-background p-4 sm:p-6 lg:p-8">
      {/* CABECERA */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Gestión profesional
          </p>

          <h1 className="mt-1 text-2xl font-black text-text">Relevamientos</h1>

          <p className="mt-1 text-sm text-muted">
            Registrá y analizá la situación de clubes y equipos.
          </p>
        </div>

        <Button variant="primary" onClick={() => setMostrandoFormulario(true)}>
          + Nuevo relevamiento
        </Button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-xl border border-danger-border bg-danger-bg px-4 py-3 text-sm text-danger-text">
          {error}
        </div>
      )}

      {/* CARGANDO */}
      {loading && (
        <Card>
          <div className="py-10 text-center">
            <p className="text-sm text-muted">Cargando relevamientos...</p>
          </div>
        </Card>
      )}

      {/* VACÍO */}
      {!loading && relevamientos.length === 0 && (
        <Card>
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surfaceSoft text-2xl">
              📋
            </div>

            <h2 className="text-lg font-bold text-text">
              Todavía no hay relevamientos
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted">
              Creá el primero para registrar la situación de un club, sus
              necesidades y tu diagnóstico profesional.
            </p>

            <Button
              variant="primary"
              className="mt-5"
              onClick={() => setMostrandoFormulario(true)}
            >
              Crear relevamiento
            </Button>
          </div>
        </Card>
      )}

      {/* LISTADO */}
      {!loading && relevamientos.length > 0 && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {relevamientosOrdenados.map((relevamiento) => (
            <Card key={relevamiento.id} hover className="transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    {relevamiento.disciplina || "Sin disciplina"}
                  </p>

                  <h2 className="mt-1 truncate text-xl font-bold text-text">
                    {relevamiento.club || "Club sin nombre"}
                  </h2>

                  <p className="mt-1 text-sm text-muted">
                    {relevamiento.ciudad || "Sin ciudad"}
                  </p>
                </div>

                <span
                  className={`
                    shrink-0 rounded-full border px-2.5 py-1
                    text-xs font-semibold
                    ${
                      relevamiento.estado === "completado"
                        ? "border-success-border bg-success-bg text-success-text"
                        : "border-warning-border bg-warning-bg text-warning-text"
                    }
                  `}
                >
                  {relevamiento.estado === "completado"
                    ? "Completado"
                    : "Borrador"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <InfoItem
                  label="Fecha"
                  value={formatearFecha(relevamiento.fecha)}
                />

                <InfoItem
                  label="Deportistas"
                  value={
                    relevamiento.cantidadDeportistas !== null
                      ? String(relevamiento.cantidadDeportistas)
                      : "—"
                  }
                />

                <InfoItem
                  label="Contacto"
                  value={relevamiento.contactoNombre || "—"}
                />

                <InfoItem
                  label="Función"
                  value={relevamiento.contactoCargo || "—"}
                />
              </div>

              {relevamiento.necesidades && (
                <div className="mt-4 rounded-xl border border-border bg-surfaceSoft/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Necesidades
                  </p>

                  <p className="mt-1 text-sm text-text/90">
                    {relevamiento.necesidades}
                  </p>
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => manejarEliminar(relevamiento.id)}
                >
                  Eliminar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/relevamientos/${relevamiento.id}`)}
                >
                  Ver relevamiento
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-xl border border-border bg-surfaceSoft/30 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium text-text">{value}</p>
    </div>
  );
}

function formatearFecha(fecha: string) {
  if (!fecha) return "—";

  const fechaLocal = new Date(`${fecha}T12:00:00`);

  return fechaLocal.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
