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
    <div className="mt-6 p-6 rounded-xl border border-white/10">
      <h2 className="text-xl font-bold mb-4">
        Resumen rápido
      </h2>

      <div className="grid gap-4 md:grid-cols-3">

        <div>
          <p className="text-sm opacity-70">
            Cuota
          </p>
          <p>
            {cuota}
          </p>
        </div>

        <div>
          <p className="text-sm opacity-70">
            Asistencia
          </p>
          <p>
            {asistencia}
          </p>
        </div>

        <div>
          <p className="text-sm opacity-70">
            Seguimiento
          </p>
          <p>
            {seguimiento}
          </p>
        </div>

      </div>
    </div>
  );
}

export default ClienteQuickStatus;