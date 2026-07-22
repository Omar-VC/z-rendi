import { Card } from "../../../../shared/ui";

interface ClienteQuickStatusProps {
  cuota?: string;
  asistencia?: string;
  seguimiento?: string;
}

function ClienteQuickStatus({
  cuota = "Sin información",
  asistencia = "Sin información",
  seguimiento = "Sin información",
}: ClienteQuickStatusProps) {

  return (

    <div className="mt-6 grid gap-4 md:grid-cols-3">

      <Card className="text-center">

        <p className="text-xs uppercase tracking-wider text-slate-500">
          Cuota
        </p>

        <p className="mt-3 text-2xl font-bold text-primary">
          {cuota}
        </p>

      </Card>

      <Card className="text-center">

        <p className="text-xs uppercase tracking-wider text-slate-500">
          Asistencia
        </p>

        <p className="mt-3 text-2xl font-bold text-primary">
          {asistencia}
        </p>

      </Card>

      <Card className="text-center">

        <p className="text-xs uppercase tracking-wider text-slate-500">
          Seguimiento
        </p>

        <p className="mt-3 text-lg font-semibold text-slate-600">
          {seguimiento}
        </p>

      </Card>

    </div>

  );
}

export default ClienteQuickStatus;