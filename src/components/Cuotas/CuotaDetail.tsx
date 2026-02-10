import type { Cuota } from "../../types";

type Props = { cuota: Cuota | undefined };

const CuotaDetail = ({ cuota }: Props) => {
  if (!cuota) {
    return <div className="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">Seleccioná una cuota para ver su detalle.</div>;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">Detalle de cuota</h3>
      <div className="mt-3 space-y-2 text-sm text-slate-700">
        <p><span className="font-semibold">Cliente:</span> {cuota.atleta}</p>
        <p><span className="font-semibold">Monto:</span> ${cuota.monto.toLocaleString("es-AR")}</p>
        <p><span className="font-semibold">Estado:</span> {cuota.estado}</p>
        <p><span className="font-semibold">Último pago:</span> {cuota.ultimoPago ?? "No registrado"}</p>
      </div>
    </div>
  );
};

export default CuotaDetail;
