import { useState } from "react";

import type { SesionEntrenamiento } from "../types/seguimiento";

import {
  Card,
  Badge,
  Button,
} from "../../../../shared/ui";

type Props = {
  sesiones: SesionEntrenamiento[];
  onEliminarSesion: (id: string) => Promise<void>;
};

export default function RegistroSesiones({
  sesiones,
  onEliminarSesion,
}: Props) {
  const [abierto, setAbierto] = useState(false);

  async function eliminar(id: string) {
    const confirmar = window.confirm(
      "¿Eliminar esta sesión de entrenamiento?"
    );

    if (!confirmar) return;

    await onEliminarSesion(id);
  }

  return (
    <Card className="!p-4 bg-surface/70 border-border/60 transition-all duration-200">
      {/* DESPLEGABLE DE CABECERA */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between text-left group focus:outline-none"
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-text group-hover:text-primary transition-colors">
              Historial de Sesiones
            </h3>
            <span className="text-[10px] font-bold text-muted bg-surfaceSoft px-2 py-0.5 rounded-full border border-border/40">
              {sesiones.length}
            </span>
          </div>
          <p className="text-xs text-muted font-medium mt-0.5">
            Registro detallado de cargas y esfuerzo percibido
          </p>
        </div>

        <div className="w-7 h-7 rounded-lg bg-surfaceSoft border border-border/40 flex items-center justify-center text-xs text-muted group-hover:text-text transition-all">
          <span className={`transform transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}>
            ▼
          </span>
        </div>
      </button>

      {/* CONTENIDO DEL REGISTRO */}
      {abierto && (
        <div className="mt-4 pt-3 border-t border-border/40 animate-fadeIn">
          {sesiones.length === 0 ? (
            <p className="text-xs text-muted font-medium py-2 text-center">
              No hay sesiones registradas en este período.
            </p>
          ) : (
            <div className="divide-y divide-border/30">
              {sesiones.map((sesion) => (
                <div
                  key={sesion.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surfaceSoft/30 -mx-2 px-2 rounded-lg transition-colors"
                >
                  {/* INFORMACIÓN DE LA SESIÓN */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-text truncate">
                        {sesion.libroNombre || "Entrenamiento General"}
                      </span>
                      <span className="text-[10px] font-mono text-muted/70 bg-surfaceSoft px-1.5 py-0.2 rounded border border-border/20">
                        {sesion.fecha.toLocaleDateString("es-AR")}
                      </span>
                    </div>

                    {(sesion.gruposMusculares ?? []).length > 0 && (
                      <p className="text-[11px] text-muted truncate">
                        {(sesion.gruposMusculares ?? []).join(" · ")}
                      </p>
                    )}

                    {/* METRICAS (BADGES COMPACTOS) */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <Badge variant="neutral" className="text-[10px] px-1.5 py-0">
                        {sesion.duracion} min
                      </Badge>

                      <Badge variant="info" className="text-[10px] px-1.5 py-0 font-bold">
                        RPE {sesion.rpe}
                      </Badge>

                      <Badge variant="warning" className="text-[10px] px-1.5 py-0 font-bold">
                        {sesion.carga} UA
                      </Badge>
                    </div>
                  </div>

                  {/* ACCIÓN ELIMINAR */}
                  <div className="shrink-0 self-end sm:self-center">
                    <Button
                      variant="danger"
                      className="!min-h-0 !h-7 !px-2.5 text-[11px] font-semibold opacity-70 hover:opacity-100"
                      onClick={() => eliminar(sesion.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}