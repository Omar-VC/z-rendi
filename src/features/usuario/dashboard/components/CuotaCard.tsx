import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";
import { useAuth } from "../../../../auth/useAuth";
import { useCuotasCliente } from "../../../admin/cuotas/hooks/useCuotasCliente";

export default function CuotaCard() {
  const { user } = useAuth();

  const { cuotas, loading } = useCuotasCliente(user?.uid);

  if (loading) {
    return null;
  }

  const cuota = cuotas[0];

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-primary">Cuota</h3>

        <Badge variant={cuota?.estado === "pagada" ? "success" : "warning"}>
          {cuota?.estado === "pagada" ? "Pagada" : "Pendiente"}
        </Badge>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Próximo vencimiento
          </p>

          <p className="mt-1 text-lg font-bold text-primary">
            {cuota?.fechaVencimiento ?? "-"}
          </p>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Monto
          </p>

          <p className="mt-1 text-3xl font-bold text-accent">
            ${cuota?.monto ?? 0}
          </p>
        </div>
      </div>
    </Card>
  );
}
