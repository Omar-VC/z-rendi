import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";

import { useAuth } from "../../../../auth/useAuth";
import { useCuotasCliente } from "../../../admin/cuotas/hooks/useCuotasCliente";


export default function CuotaCard() {

  const { user } = useAuth();

  const {
    cuotas,
    loading,
  } = useCuotasCliente(user?.uid);


  if (loading) {
    return null;
  }


  const cuota = cuotas[0];

  const pagada = cuota?.estado === "pagada";


  return (
    <Card>


      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <h3
          className="
            text-xl
            font-bold
            text-text
          "
        >
          💳 Cuota
        </h3>


        <Badge
          variant={
            pagada
              ? "success"
              : "warning"
          }
        >
          {pagada
            ? "Pagada"
            : "Pendiente"
          }
        </Badge>

      </div>




      <div className="mt-6">


        <p
          className="
            text-xs
            uppercase
            tracking-wide
            text-muted
          "
        >
          Monto
        </p>


        <p
          className="
            mt-1
            text-4xl
            font-bold
            text-accent
          "
        >
          ${cuota?.monto ?? 0}
        </p>


      </div>




      <div
        className="
          mt-5

          rounded-card

          bg-surfaceSoft

          border
          border-border

          p-4
        "
      >

        <p
          className="
            text-xs
            uppercase
            tracking-wide
            text-muted
          "
        >
          Próximo vencimiento
        </p>


        <p
          className="
            mt-1
            text-lg
            font-bold
            text-text
          "
        >
          {cuota?.fechaVencimiento ?? "-"}
        </p>


      </div>




      <p
        className="
          mt-4
          text-sm
          text-muted
        "
      >
        {pagada
          ? "Tu cuota está al día."
          : "Recordá realizar el pago antes del vencimiento."
        }
      </p>


    </Card>
  );
}