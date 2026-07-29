import type { Cliente } from "../types";

import {
  Card,
  Badge,
} from "../../../../shared/ui";

interface ClienteHeaderProps {
  cliente: Cliente;
}

function ClienteHeader({
  cliente,
}: ClienteHeaderProps) {
  return (
    <Card>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

        {/* Información */}
        <div>

          <h1 className="text-4xl font-bold text-text">
            {cliente.nombre} {cliente.apellido}
          </h1>

          <p className="mt-2 text-muted">
            {cliente.email}
          </p>

        </div>

        {/* Estado */}
        <div className="flex flex-col items-start gap-3 md:items-end">

          <Badge
            variant={
              cliente.estado === "aprobado"
                ? "success"
                : "warning"
            }
          >
            {cliente.estado.toUpperCase()}
          </Badge>

          <p className="text-sm text-muted">

            Rol{" "}
            <span className="font-semibold text-text">
              {cliente.rol}
            </span>

          </p>

        </div>

      </div>

    </Card>
  );
}

export default ClienteHeader;