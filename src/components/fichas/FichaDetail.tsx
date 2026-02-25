import type { Ficha } from "../../types";

type Props = { ficha: Ficha | undefined };

const FichaDetail = ({ ficha }: Props) => {
  if (!ficha) {
    return <div className="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">Seleccioná una ficha para ver su detalle.</div>;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">Detalle de atleta</h3>
      <div className="mt-3 space-y-2 text-sm text-slate-700">
        <p><span className="font-semibold">Nombre:</span> {ficha.nombre} {ficha.apellido}</p>
        <p><span className="font-semibold">Lesiones:</span> {ficha.lesiones}</p>
        <p><span className="font-semibold">Evaluación inicial:</span> {ficha.evaluacionInicial}</p>
        <p><span className="font-semibold">Evaluación actual:</span> {ficha.evaluacionActual}</p>
      </div>
    </div>
  );
};

export default FichaDetail;






