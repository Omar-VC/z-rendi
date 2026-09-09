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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* TARJETA CUOTA */}
      <Card className="!p-4 bg-surface/60 border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl pointer-events-none" />
        <p className="text-[10px] font-black uppercase tracking-wider text-muted">
          Estado Cuota
        </p>
        <p className="mt-1.5 text-xl font-extrabold text-text capitalize truncate">
          {cuota}
        </p>
      </Card>

      {/* TARJETA ASISTENCIA */}
      <Card className="!p-4 bg-surface/60 border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl pointer-events-none" />
        <p className="text-[10px] font-black uppercase tracking-wider text-muted">
          Asistencia Global
        </p>
        <p className="mt-1.5 text-xl font-black text-primary truncate">
          {asistencia}
        </p>
      </Card>

      {/* TARJETA SEGUIMIENTO */}
      <Card className="!p-4 bg-surface/60 border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl pointer-events-none" />
        <p className="text-[10px] font-black uppercase tracking-wider text-muted">
          Último Seguimiento
        </p>
        <p className="mt-1.5 text-base font-bold text-text truncate">
          {seguimiento}
        </p>
      </Card>
    </div>
  );
}

export default ClienteQuickStatus;