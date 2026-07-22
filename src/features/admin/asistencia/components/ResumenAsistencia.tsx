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

  const mes = fechaActual.toLocaleDateString(
    "es-AR",
    {
      month: "long",
      year: "numeric",
    }
  );


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

      <p className="capitalize text-sm text-muted mb-5">
        {mes}
      </p>


      <div className="grid gap-4 md:grid-cols-4">


        <div className="rounded-xl border border-border bg-surface p-4">

          <p className="text-sm text-muted">
            Frecuencia
          </p>

          <p className="mt-2 font-semibold">
            {frecuenciaSemanal ?? "-"} días/semana
          </p>

        </div>



        <div className="rounded-xl border border-border bg-surface p-4">

          <p className="text-sm text-muted">
            Presentes
          </p>

          <p className="mt-2 font-semibold">
            {presentes}
          </p>

        </div>



        <div className="rounded-xl border border-border bg-surface p-4">

          <p className="text-sm text-muted">
            Faltas
          </p>

          <p className="mt-2 font-semibold">
            {faltas}
          </p>

        </div>



        <div className="rounded-xl border border-border bg-surface p-4">

          <p className="text-sm text-muted">
            Rendimiento
          </p>


          <div className="mt-2 flex items-center gap-2">

            <span className="font-semibold">
              {porcentaje}%
            </span>


            <Badge variant={estado.variant}>
              {estado.label}
            </Badge>

          </div>

        </div>


      </div>


    </div>
  );
}


export default ResumenAsistencia;