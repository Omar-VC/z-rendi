import { useNavigate } from "react-router-dom";
import type { Cliente } from "../types";

interface ClienteCardProps {
  cliente: Cliente;
}

function ClienteCard({ cliente }: ClienteCardProps) {
  const navigate = useNavigate();

  return (
    <div className="p-5 rounded-xl border border-white/10">
      <div className="flex justify-between items-start gap-4">

        <div>
          <h3 className="text-lg font-semibold">
            {cliente.nombre} {cliente.apellido}
          </h3>

          <p className="mt-2 text-sm">
            🟢 Activo
          </p>
        </div>

        <button
          onClick={() => navigate(`/clientes/${cliente.id}`)}
          className="px-4 py-2 rounded-lg"
        >
          Ver
        </button>

      </div>


      <div className="mt-5 space-y-2 text-sm">

        <p>
          Cuota:
          <span className="ml-2 opacity-70">
            Sin información
          </span>
        </p>

        <p>
          Asistencia:
          <span className="ml-2 opacity-70">
            Sin información
          </span>
        </p>

        <p>
          Seguimiento:
          <span className="ml-2 opacity-70">
            Sin información
          </span>
        </p>

      </div>

    </div>
  );
}

export default ClienteCard;