import type { SesionEntrenamiento } from "../types/seguimiento";

import {
  Card,
  SectionTitle,
  Badge,
} from "../../../../shared/ui";

import { obtenerEstadoCargaSemanal } from "../utils/cargaUtils";

import {
  estaEnSemanaActual,
  obtenerTextoSemanaActual,
} from "../utils/fechaUtils";

type Props = {
  sesiones: SesionEntrenamiento[];
};

export default function CargaSemanalCard({
  sesiones,
}: Props) {

  const sesionesSemana = sesiones.filter((sesion) =>
    estaEnSemanaActual(sesion.fecha)
  );

  const cargaTotal = sesionesSemana.reduce(
    (total, sesion) => total + sesion.carga,
    0,
  );

  const cantidadSesiones = sesionesSemana.length;

  const promedio =
    cantidadSesiones === 0
      ? 0
      : Math.round(cargaTotal / cantidadSesiones);

  const estado =
    obtenerEstadoCargaSemanal(cargaTotal);

  return (
    <Card>

      <SectionTitle
        title="Carga semanal"
        description={obtenerTextoSemanaActual()}
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

          <Badge
            variant={estado.variant}
            className="mt-3"
          >
            {estado.texto}
          </Badge>

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