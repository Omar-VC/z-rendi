import type { SesionEntrenamiento } from "../types/seguimiento";

import {
  Card,
  SectionTitle,
} from "../../../../shared/ui";

type Props = {
  sesiones: SesionEntrenamiento[];
};

export default function CargaMensualCard({
  sesiones,
}: Props) {

  const hoy = new Date();

  const sesionesMes = sesiones.filter((sesion) => {

    return (
      sesion.fecha.getMonth() === hoy.getMonth() &&
      sesion.fecha.getFullYear() === hoy.getFullYear()
    );

  });

  const cargaTotal = sesionesMes.reduce(
    (total, sesion) => total + sesion.carga,
    0,
  );

  const cantidadSesiones = sesionesMes.length;

  const promedio =
    cantidadSesiones === 0
      ? 0
      : Math.round(cargaTotal / cantidadSesiones);

  const nombreMes = hoy.toLocaleDateString(
    "es-AR",
    {
      month: "long",
      year: "numeric",
    }
  );

  return (

    <Card>

      <SectionTitle
        title="Carga mensual"
        description={nombreMes}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="rounded-xl border border-border p-4">

          <p className="text-sm text-muted">
            Carga acumulada
          </p>

          <p className="mt-2 text-3xl font-bold">
            {cargaTotal}
          </p>

          <p className="text-sm text-muted">
            UA
          </p>

        </div>

        <div className="rounded-xl border border-border p-4">

          <p className="text-sm text-muted">
            Sesiones
          </p>

          <p className="mt-2 text-3xl font-bold">
            {cantidadSesiones}
          </p>

        </div>

        <div className="rounded-xl border border-border p-4">

          <p className="text-sm text-muted">
            Promedio por sesión
          </p>

          <p className="mt-2 text-3xl font-bold">
            {promedio}
          </p>

          <p className="text-sm text-muted">
            UA
          </p>

        </div>

      </div>

    </Card>

  );

}