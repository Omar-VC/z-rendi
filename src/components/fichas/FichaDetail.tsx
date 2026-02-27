import type { Ficha } from "../../types";

type Props = { 
  ficha: Ficha | undefined; 
  onDelete?: (id: string) => void; 
  onClose?: () => void; 
};

const FichaDetail = ({ ficha, onDelete, onClose }: Props) => {
  if (!ficha) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">
        Seleccioná una ficha para ver su detalle.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">Detalle de atleta</h3>
      <div className="mt-3 space-y-2 text-sm text-slate-700">
        <p><span className="font-semibold">Nombre:</span> {ficha.nombre} {ficha.apellido}</p>
        <p><span className="font-semibold">Edad:</span> {ficha.edad}</p>
        <p><span className="font-semibold">Altura:</span> {ficha.altura} cm</p>
        <p><span className="font-semibold">Deporte:</span> {ficha.deporte}</p>
        <p><span className="font-semibold">Puesto:</span> {ficha.puesto}</p>
        <p><span className="font-semibold">Teléfono:</span> {ficha.telefono}</p>
        <p><span className="font-semibold">Lesiones:</span> {ficha.lesiones}</p>
      </div>

      {/* 👇 Botones de acción */}
      <div className="mt-4 flex space-x-2">
        {onDelete && (
          <button onClick={() => onDelete(ficha.id)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Eliminar Ficha
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="bg-gray-500 text-white px-3 py-1 rounded" >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};

export default FichaDetail;
