import { Card, Button } from "../../../../shared/ui";
import type { Relevamiento } from "../types/relevamiento";

interface Props {
  relevamiento: Relevamiento;
  onEditar: (relevamiento: Relevamiento) => void;
  onEliminar: (id: string) => void;
}

export default function RelevamientoCard({
  relevamiento,
  onEditar,
  onEliminar,
}: Props) {
  const estadoCompletado = relevamiento.estado === "completado";

  const fechaFormateada = relevamiento.fecha
    ? new Date(`${relevamiento.fecha}T00:00:00`).toLocaleDateString(
        "es-AR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        },
      )
    : "Sin fecha";

  const manejarEliminar = () => {
    const confirmar = window.confirm(
      `¿Eliminar el relevamiento de ${relevamiento.club}?`,
    );

    if (!confirmar) return;

    onEliminar(relevamiento.id);
  };

  return (
    <Card
      hover
      className="!p-4 border border-border/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          {/* Icono */}
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <span className="text-lg">📋</span>
          </div>

          {/* Información */}
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-text truncate">
              {relevamiento.club || "Sin nombre"}
            </h3>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs text-muted">
                {relevamiento.disciplina || "Sin disciplina"}
              </span>

              {relevamiento.ciudad && (
                <>
                  <span className="text-muted/40">•</span>

                  <span className="text-xs text-muted">
                    {relevamiento.ciudad}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Estado */}
        <span
          className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
            estadoCompletado
              ? "bg-success-bg text-success-text border-success-border"
              : "bg-warning-bg text-warning-text border-warning-border"
          }`}
        >
          {estadoCompletado ? "Completado" : "Borrador"}
        </span>
      </div>

      {/* Metadatos */}
      <div className="mt-4 pt-3 border-t border-border/40 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted">
            Contacto
          </p>

          <p className="text-xs text-text/80 mt-1 truncate">
            {relevamiento.contactoNombre || "Sin especificar"}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted">
            Fecha
          </p>

          <p className="text-xs text-text/80 mt-1">
            {fechaFormateada}
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEditar(relevamiento)}
        >
          Editar
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={manejarEliminar}
        >
          Eliminar
        </Button>
      </div>
    </Card>
  );
}