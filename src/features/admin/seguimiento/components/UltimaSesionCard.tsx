import type { SesionEntrenamiento } from "../types/seguimiento";

import {
  Card,
  Badge,
} from "../../../../shared/ui";

type Props = {
  sesion?: SesionEntrenamiento;
};

export default function UltimaSesionCard({
  sesion,
}: Props) {

  if (!sesion) {
    return (
      <Card>
        <h3 className="font-semibold text-lg">
          Última sesión
        </h3>

        <p className="mt-3 text-muted">
          Aún no hay sesiones registradas.
        </p>
      </Card>
    );
  }

  return (
    <Card>

      {/* Encabezado */}

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <h3 className="font-semibold text-lg">
            Última sesión
          </h3>

          <p className="mt-2 font-semibold truncate">
            {sesion.libroNombre}
          </p>

        </div>

        <p className="text-sm text-muted whitespace-nowrap">
          {sesion.fecha.toLocaleDateString("es-AR")}
        </p>

      </div>


      {/* Datos principales */}

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">

        <span className="text-muted">
          Carga {sesion.carga} UA
        </span>

        <span className="text-muted">
          ·
        </span>

        <Badge variant="info">
          RPE {sesion.rpe}
        </Badge>

        <span className="text-muted">
          ·
        </span>

        <span className="text-muted">
          {sesion.duracion} min
        </span>

      </div>


      {/* Grupos musculares */}

      {(sesion.gruposMusculares ?? []).length > 0 && (
        <div className="mt-4">

          <p className="text-xs font-semibold text-muted uppercase tracking-wide">
            Grupos musculares
          </p>

          <p className="mt-1 text-sm">
            {(sesion.gruposMusculares ?? []).join(" · ")}
          </p>

        </div>
      )}


      {/* Observaciones */}

      {sesion.observaciones && (
        <div className="mt-4 border-t border-border pt-4">

          <p className="text-xs font-semibold text-muted uppercase tracking-wide">
            Observación
          </p>

          <p className="mt-1 text-sm">
            {sesion.observaciones}
          </p>

        </div>
      )}

    </Card>
  );
}