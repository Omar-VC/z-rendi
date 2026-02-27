import type { Ficha } from "../../types";

type Props = { 
  ficha: Ficha | undefined; 
  onDelete?: (id: string) => void; 
  onClose?: () => void; 
};

const FichaDetail = ({ ficha, onDelete, onClose }: Props) => {
  if (!ficha) {
    return (
      <div className="rounded-xl border border-white/20 bg-secondary/30 backdrop-blur-md p-6 text-gray-300 text-center">
        Seleccioná una ficha para ver su detalle.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/20 bg-secondary/40 backdrop-blur-md shadow-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">
        Detalle de atleta
      </h3>
      <div className="space-y-2 text-sm text-gray-200">
        <p><span className="font-semibold">Nombre:</span> {ficha.nombre} {ficha.apellido}</p>
        <p><span className="font-semibold">Edad:</span> {ficha.edad}</p>
        <p><span className="font-semibold">Altura:</span> {ficha.altura} cm</p>
        <p><span className="font-semibold">Deporte:</span> {ficha.deporte}</p>
        <p><span className="font-semibold">Puesto:</span> {ficha.puesto}</p>
        <p><span className="font-semibold">Teléfono:</span> {ficha.telefono}</p>
        <p><span className="font-semibold">Lesiones:</span> {ficha.lesiones}</p>
      </div>

      <div className="mt-6 flex space-x-3">
  {onDelete && (
    <button
      onClick={() => onDelete(ficha.id)}
      className="btn btn-danger"
    >
      Eliminar Ficha
    </button>
  )}
  {onClose && (
    <button onClick={onClose} className="btn btn-secondary">
      Cerrar
    </button>
  )}
</div>




    </div>
  );
};


export default FichaDetail;