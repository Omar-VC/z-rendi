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

      <Card>

        <p className="text-xs uppercase tracking-[0.15em] text-muted">
          Cuota
        </p>

        <p className="mt-3 text-2xl font-bold text-text">
          {cuota}
        </p>

      </Card>

      <Card>

        <p className="text-xs uppercase tracking-[0.15em] text-muted">
          Asistencia
        </p>

        <p className="mt-3 text-2xl font-bold text-primary">
          {asistencia}
        </p>

      </Card>

      <Card>

        <p className="text-xs uppercase tracking-[0.15em] text-muted">
          Seguimiento
        </p>

        <p className="mt-3 text-lg font-semibold text-text">
          {seguimiento}
        </p>

      </Card>

    </div>
  );
}

export default ClienteQuickStatus;