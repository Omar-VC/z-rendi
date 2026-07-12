import type { Cliente } from "../types";

interface ClienteRequestCardProps {
  cliente: Cliente;
  onAceptar: (id: string) => void;
  onRechazar: (id: string) => void;
}

function ClienteRequestCard({
  cliente,
  onAceptar,
  onRechazar,
}: ClienteRequestCardProps) {
  return (
    <div className="p-5 rounded-xl border border-white/10">
      <div>
        <h3 className="text-lg font-semibold">
          {cliente.nombre} {cliente.apellido}
        </h3>

        <p className="text-sm opacity-70">
          {cliente.email}
        </p>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onAceptar(cliente.id)}
          className="px-4 py-2 rounded-lg"
        >
          Aceptar
        </button>

        <button
          onClick={() => onRechazar(cliente.id)}
          className="px-4 py-2 rounded-lg"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}

export default ClienteRequestCard;