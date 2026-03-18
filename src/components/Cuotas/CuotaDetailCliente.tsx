import { CreditCardIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import type { Cuota } from "../../types";

type Props = {
  cuota?: Cuota;
  onClose: () => void;
};

const CuotaDetailCliente = ({ cuota, onClose }: Props) => {
  if (!cuota) {
    return (
      <div className="card text-center animate-zoomFadeIn">
        <p className="text-slate-300">Todavía no tenés cuota asignada.</p>
        <button onClick={onClose} className="btn btn-secondary mt-4">
          Cerrar
        </button>
      </div>
    );
  }

  const estadoClass =
    cuota.estado === "pagada" ? "btn btn-success" : "btn btn-danger";

  return (
    <div className="card animate-zoomFadeIn">
      {/* Encabezado con ícono */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <CreditCardIcon className="w-6 h-6 text-highlight" />
          <h2 className="text-2xl">Mi cuota</h2>
        </div>
        <span className={`${estadoClass} text-sm px-3 py-1 rounded-full`}>
          {cuota.estado.toUpperCase()}
        </span>
      </div>

      {/* Monto */}
      <div className="text-4xl font-extrabold mb-2">${cuota.monto}</div>

      {/* Vencimiento con ícono */}
      <div className="flex items-center gap-2 text-sm opacity-80 mb-4">
        <CalendarDaysIcon className="w-5 h-5 text-white/70" />
        <span>
          Vence el <span className="font-semibold">{cuota.fechaVencimiento}</span>
        </span>
      </div>

      {/* Botón cerrar */}
      <div className="flex justify-end">
        <button onClick={onClose} className="btn btn-secondary">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default CuotaDetailCliente;
