import type { Sesion, Ficha } from "../../types";

type Props = {
  sesion: Sesion | undefined;
  clientes: Ficha[];
};

const SesionDetail = ({ sesion, clientes }: Props) => {
  if (!sesion) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">
        Seleccioná una sesión para ver el detalle.
      </div>
    );
  }

  // 👇 Buscar el cliente por ID
  const cliente = clientes.find((c) => c.id === sesion.atleta);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">Detalle de sesión</h3>
      <div className="mt-3 space-y-2 text-sm text-slate-700">
        <p>
          <span className="font-semibold">Cliente:</span>{" "}
          {cliente ? `${cliente.nombre} ${cliente.apellido}` : "Desconocido"}
        </p>
        <p>
          <span className="font-semibold">Ejercicios:</span> {sesion.ejercicios}
        </p>
        <p>
          <span className="font-semibold">Cargas:</span> {sesion.cargas}
        </p>
        <p>
          <span className="font-semibold">Observaciones:</span>{" "}
          {sesion.observaciones}
        </p>
      </div>
    </div>
  );
};

export default SesionDetail;
