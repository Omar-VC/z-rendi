import type { Cuota } from "../types";
import RevertirPagoButton from "./RevertirPagoButton";

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
  if (cuotas.length === 0) {
    return (
      <section className="p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-bold">Cuotas</h2>

        <p className="mt-2 opacity-70">
          El cliente todavía no tiene cuotas iniciadas.
        </p>

        <button onClick={onCrear} className="mt-4 px-4 py-2 rounded-lg">
          Generar primera cuota
        </button>
      </section>
    );
  }

  return (
    <section className="p-6 rounded-xl border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Cuotas</h2>
      </div>

      <div className="space-y-4">
        {cuotas.map((cuota) => (
          <div key={cuota.id} className="p-4 rounded-lg border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold capitalize">
                  {cuota.mes} {cuota.anio ?? ""}
                </h3>

                <p className="opacity-70">
                  Vencimiento: {cuota.fechaVencimiento}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">${cuota.monto}</p>

                <p>Estado: {cuota.estado}</p>

                {cuota.estado === "pendiente" && (
                  <button
                    onClick={() => onRegistrarPago(cuota)}
                    className="mt-3 px-3 py-1 rounded-lg"
                  >
                    Registrar pago
                  </button>
                )}
                {cuota.estado === "pagada" && (
                  <>
                    <div className="mt-3 text-sm opacity-70">
                      <p>Método: {cuota.metodoPago ?? "-"}</p>

                      <p>Fecha pago: {cuota.fechaPago ?? "-"}</p>
                    </div>

                    <RevertirPagoButton
                      cuotaId={cuota.id}
                      onRevertido={onRevertido}
                    />
                  </>
                )}
                <button
                  onClick={() => onEditar(cuota)}
                  className="mt-3 px-3 py-1 rounded-lg"
                >
                  Editar
                </button>
                <button
                  onClick={() => onVerRecibo(cuota)}
                  className="mt-3 px-3 py-1 rounded-lg"
                >
                  Ver recibo
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CuotaResumen;
