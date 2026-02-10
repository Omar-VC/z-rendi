import type { Sesion } from "../../types";

type Props = { sesion: Sesion | undefined };

const SesionDetail = ({ sesion }: Props) => {
  if (!sesion) {
    return <div className="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">Seleccioná una sesión para ver el detalle.</div>;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">Detalle de sesión</h3>
      <div className="mt-3 space-y-2 text-sm text-slate-700">
        <p><span className="font-semibold">Atleta:</span> {sesion.atleta}</p>
        <p><span className="font-semibold">Ejercicios:</span> {sesion.ejercicios}</p>
        <p><span className="font-semibold">Cargas:</span> {sesion.cargas}</p>
        <p><span className="font-semibold">Observaciones:</span> {sesion.observaciones}</p>
      </div>
    </div>
  );
};

export default SesionDetail;
