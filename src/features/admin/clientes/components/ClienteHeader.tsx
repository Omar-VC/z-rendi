import type { Cliente } from "../types";

import { Card } from "../../../../shared/ui";

interface ClienteHeaderProps {
  cliente: Cliente;
}

function ClienteHeader({ cliente }: ClienteHeaderProps) {
  return (
    <Card>

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-4xl font-bold text-primary">
            {cliente.nombre} {cliente.apellido}
          </h1>

          <p className="mt-2 text-slate-500">
            {cliente.email}
          </p>

        </div>



        <div className="flex flex-col items-start md:items-end gap-3">

          <span
            className="
              inline-flex
              px-4
              py-1.5
              rounded-full
              text-sm
              font-semibold
              bg-green-100
              text-green-700
            "
          >
            {cliente.estado.toUpperCase()}
          </span>

          <p className="text-sm text-slate-500">
            Rol: <span className="font-medium text-primary">{cliente.rol}</span>
          </p>

        </div>

      </div>

    </Card>
  );
}

export default ClienteHeader;