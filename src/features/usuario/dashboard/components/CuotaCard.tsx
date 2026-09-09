import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";
import { useAuth } from "../../../../auth/useAuth";
import { useCuotasCliente } from "../../../admin/cuotas/hooks/useCuotasCliente";

export default function CuotaCard() {
  const { user } = useAuth();
  const { cuotas, loading } = useCuotasCliente(user?.uid);

  // Skeleton de carga
  if (loading) {
    return (
      <Card className="animate-pulse space-y-4">
        <div className="h-6 w-1/3 bg-surfaceSoft rounded-md" />
        <div className="h-10 w-1/2 bg-surfaceSoft/60 rounded-lg" />
        <div className="h-16 w-full bg-surfaceSoft/40 rounded-xl" />
      </Card>
    );
  }

  const cuota = cuotas[0];
  const pagada = cuota?.estado === "pagada";

  // Formateador de moneda
  const montoFormateado = cuota?.monto
    ? new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }).format(cuota.monto)
    : "$ 0";

  return (
    <Card hover className="relative overflow-hidden">
      {/* Luz ambiental difusa */}
      <div
        className={`absolute -bottom-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none ${
          pagada ? "bg-success/10" : "bg-warning/10"
        }`}
      />

      {/* ENCABEZADO */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-xs">
            💳
          </span>
          <h3 className="text-lg font-bold text-text tracking-tight">
            Estado de Cuota
          </h3>
        </div>

        <Badge variant={pagada ? "success" : "warning"}>
          {pagada ? "Al día" : "Pendiente"}
        </Badge>
      </div>

      {/* MONTO */}
      <div className="mt-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
          Monto Período
        </span>
        <p
          className={`mt-1 text-3xl font-black tracking-tight ${
            pagada ? "text-text" : "text-warning"
          }`}
        >
          {montoFormateado}
        </p>
      </div>

      {/* DETALLE DE VENCIMIENTO */}
      <div className="mt-4 p-3.5 rounded-xl border border-border/60 bg-surfaceSoft/30 flex items-center justify-between">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">
            Próximo Vencimiento
          </span>
          <p className="mt-0.5 text-sm font-extrabold text-text">
            {cuota?.fechaVencimiento ?? "-"}
          </p>
        </div>

        {!pagada && (
          <span className="flex h-2 w-2 rounded-full bg-warning animate-ping" />
        )}
      </div>

      {/* FOOTER INFORMATIVO */}
      <div className="mt-4 p-2.5 rounded-xl border border-white/5 bg-surfaceSoft/20 flex items-center gap-2">
        <span className="text-xs">{pagada ? "✅" : "⚠️"}</span>
        <p className="text-xs font-semibold text-muted">
          {pagada
            ? "Tu membresía se encuentra activa y al día."
            : "Recordá regularizar el pago antes de la fecha límite."}
        </p>
      </div>
    </Card>
  );
}