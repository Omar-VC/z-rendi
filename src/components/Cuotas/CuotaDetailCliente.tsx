const CuotaDetailCliente = ({ cuota, onClose }) => {
  if (!cuota) {
    return (
      <div className="text-center">
        <p className="text-slate-600">Todavía no tenés cuota asignada.</p>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white px-3 py-1 rounded"
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Mi cuota</h2>
      <p><span className="font-semibold">Monto:</span> {cuota.monto}</p>
      <p><span className="font-semibold">Estado:</span> {cuota.estado}</p>
      <p><span className="font-semibold">Vencimiento:</span> {cuota.fechaVencimiento}</p>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default CuotaDetailCliente;
