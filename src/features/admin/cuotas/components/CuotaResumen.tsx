import type { Cuota } from "../types";

import RevertirPagoButton from "./RevertirPagoButton";

import {
  Card,
  Button,
  Badge,
  SectionTitle,
} from "../../../../shared/ui";


interface CuotaResumenProps {
  cuotas: Cuota[];
  onCrear: () => void;
  onRegistrarPago: (cuota: Cuota) => void;
  onEditar: (cuota: Cuota) => void;
  onRevertido: () => void;
  onVerRecibo: (cuota: Cuota) => void;
}


function CuotaResumen({
  cuotas,
  onCrear,
  onRegistrarPago,
  onEditar,
  onVerRecibo,
  onRevertido,
}: CuotaResumenProps) {


  function estadoVariant(estado: Cuota["estado"]) {

    if (estado === "pagada") {
      return "success";
    }

    if (estado === "pendiente") {
      return "warning";
    }

    return "danger";
  }


  if (cuotas.length === 0) {

    return (
      <Card>

        <SectionTitle
          title="Cuotas"
          description="Gestioná pagos y estados de las cuotas del cliente."
        />


        <p className="text-muted">
          El cliente todavía no tiene cuotas iniciadas.
        </p>


        <div className="mt-5">

          <Button
            variant="accent"
            onClick={onCrear}
          >
            Generar primera cuota
          </Button>

        </div>


      </Card>
    );
  }



  return (

    <Card>

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

        <SectionTitle
          title="Cuotas"
          description="Historial de pagos y vencimientos."
        />


        <Button
          variant="accent"
          onClick={onCrear}
        >
          Nueva cuota
        </Button>

      </div>



      <div className="space-y-4 mt-6">


        {cuotas.map((cuota) => (

          <div
            key={cuota.id}
            className="
              rounded-xl
              border
              border-border
              bg-surface
              p-5
            "
          >


            <div className="flex flex-col md:flex-row md:justify-between gap-5">


              <div>

                <h3 className="font-semibold text-lg capitalize">
                  {cuota.mes} {cuota.anio ?? ""}
                </h3>


                <p className="text-sm text-muted mt-2">
                  Vencimiento: {cuota.fechaVencimiento}
                </p>


                <div className="mt-3">

                  <Badge
                    variant={estadoVariant(cuota.estado)}
                  >
                    {cuota.estado}
                  </Badge>

                </div>

              </div>



              <div className="md:text-right">


                <p className="text-xl font-bold">
                  ${cuota.monto}
                </p>



                {cuota.estado === "pendiente" && (

                  <Button
                    variant="accent"
                    className="mt-4"
                    onClick={() => onRegistrarPago(cuota)}
                  >
                    Registrar pago
                  </Button>

                )}



                {cuota.estado === "pagada" && (

                  <div className="mt-4 space-y-2 text-sm text-muted">

                    <p>
                      Método: {cuota.metodoPago ?? "-"}
                    </p>

                    <p>
                      Fecha pago: {cuota.fechaPago ?? "-"}
                    </p>


                    <RevertirPagoButton
                      cuotaId={cuota.id}
                      onRevertido={onRevertido}
                    />

                  </div>

                )}



                <div className="flex md:justify-end gap-2 mt-4">


                  <Button
                    variant="secondary"
                    onClick={() => onEditar(cuota)}
                  >
                    Editar
                  </Button>



                  <Button
                    variant="secondary"
                    onClick={() => onVerRecibo(cuota)}
                  >
                    Recibo
                  </Button>


                </div>


              </div>


            </div>


          </div>

        ))}


      </div>


    </Card>

  );
}


export default CuotaResumen;