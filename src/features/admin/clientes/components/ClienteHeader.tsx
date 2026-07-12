import type { Cliente } from "../types";

interface ClienteHeaderProps {
  cliente: Cliente;
}

function ClienteHeader({ cliente }: ClienteHeaderProps) {
  return (
    <div className="p-6 rounded-xl border border-white/10">
      <h1 className="text-3xl font-bold">
        {cliente.nombre} {cliente.apellido}
      </h1>

      <div className="mt-4 space-y-2">
        <p>
          Email: {cliente.email}
        </p>

        <p>
          Estado: {cliente.estado}
        </p>

        <p>
          Rol: {cliente.rol}
        </p>
      </div>
    </div>
  );
}

export default ClienteHeader;