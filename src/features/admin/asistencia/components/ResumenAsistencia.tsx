import { Badge } from "../../../../shared/ui";

interface ResumenAsistenciaProps {
  presentes: number;
  faltas: number;
  porcentaje: number;
  frecuenciaSemanal?: number;
}

function ResumenAsistencia({
  presentes,
  faltas,
  porcentaje,
  frecuenciaSemanal,
}: ResumenAsistenciaProps) {
  const fechaActual = new Date();

  const mes = fechaActual.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });

  function estadoAsistencia() {
    if (porcentaje >= 85) {
      return {
        label: "Excelente",
        variant: "success" as const,
      };
    }

    if (porcentaje >= 70) {
      return {
        label: "Regular",
        variant: "warning" as const,
      };
    }

    return {
      label: "Baja",
      variant: "danger" as const,
    };
  }

  const estado = estadoAsistencia();

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="capitalize font-semibold text-text">
          {mes}
        </span>

        <span className="text-muted">
          {frecuenciaSemanal ?? "-"} días/semana
        </span>

        <span className="text-muted">
          {presentes} presentes
        </span>

        <span className="text-muted">
          {faltas} faltas
        </span>

        <span className="font-semibold text-text">
          {porcentaje}%
        </span>

        <Badge variant={estado.variant}>
          {estado.label}
        </Badge>
      </div>
    </div>
  );
}

export default ResumenAsistencia;