import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";
import { useAuth } from "../../../../auth/useAuth";
import { useCuotasCliente } from "../../../admin/cuotas/hooks/useCuotasCliente";
import { CreditCard, Calendar, CheckCircle2, AlertTriangle, Wallet } from "lucide-react";

export default function CuotaCard() {
  const { user } = useAuth();
  const { cuotas, loading } = useCuotasCliente(user?.uid);

  // Skeleton de carga
  if (loading) {
    return (
      <Card className="animate-pulse space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="h-6 w-1/3 bg-surfaceSoft rounded-md" />
          <div className="h-6 w-16 bg-surfaceSoft rounded-full" />
        </div>
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
    <Card hover className="relative overflow-hidden p-5 bg-surface/95 backdrop-blur-md border border-white/10 shadow-xl">
      {/* Luz ambiental difusa dinámicamente coloreada */}
      <div
        className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          pagada ? "bg-success/15" : "bg-warning/15"
        }`}
      />

      {/* Ícono decorativo de agua en la esquina superior derecha */}
      <div className="absolute top-0 right-0 w-36 h-36 pointer-events-none overflow-hidden opacity-5">
        <CreditCard className="absolute -top-4 -right-4 w-32 h-32 text-text -rotate-12" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl border ${
                pagada
                  ? "bg-success/10 border-success/20 text-success shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                  : "bg-warning/10 border-warning/20 text-warning shadow-[0_0_12px_rgba(245,158,11,0.15)]"
              }`}
            >
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-text tracking-tight">
              Estado de Cuota
            </h3>
          </div>

          <Badge variant={pagada ? "success" : "warning"}>
            {pagada ? "Al día" : "Pendiente"}
          </Badge>
        </div>

        {/* MONTO */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Monto Período
          </span>
          <p
            className={`mt-0.5 text-3xl font-black tracking-tight ${
              pagada ? "text-text" : "text-warning"
            }`}
          >
            {montoFormateado}
          </p>
        </div>

        {/* DETALLE DE VENCIMIENTO */}
        <div
          className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between ${
            pagada
              ? "border-white/10 bg-surfaceSoft/30"
              : "border-warning/30 bg-warning/5"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Calendar className={`w-4 h-4 ${pagada ? "text-muted" : "text-warning"}`} />
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">
                Próximo Vencimiento
              </span>
              <p className="text-sm font-extrabold text-text">
                {cuota?.fechaVencimiento ?? "-"}
              </p>
            </div>
          </div>

          {!pagada && (
            <div className="flex items-center gap-1.5 bg-warning/10 border border-warning/20 px-2.5 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full bg-warning animate-ping" />
              <span className="text-[10px] font-bold text-warning uppercase tracking-wide">
                Atención
              </span>
            </div>
          )}
        </div>

        {/* FOOTER INFORMATIVO */}
        <div
          className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
            pagada
              ? "border-success/20 bg-success/5 text-success/90"
              : "border-warning/20 bg-warning/5 text-warning/90"
          }`}
        >
          {pagada ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-warning" />
          )}
          <p className="leading-snug">
            {pagada
              ? "Tu membresía se encuentra activa y al día."
              : "Recordá regularizar el pago antes de la fecha límite."}
          </p>
        </div>
      </div>
    </Card>
  );
}