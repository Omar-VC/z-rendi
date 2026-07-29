import type { Cliente } from "../types";

import {
  Card,
  Button,
  Badge,
} from "../../../../shared/ui";

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
    <Card>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        <div>

          <h3 className="text-xl font-bold text-text">
            {cliente.nombre} {cliente.apellido}
          </h3>

          <p className="mt-2 text-muted">
            {cliente.email}
          </p>

        </div>

        <Badge variant="warning">
          Pendiente
        </Badge>

      </div>

      {/* Acciones */}
      <div className="mt-6 flex gap-3">

        <Button
          variant="success"
          onClick={() => onAceptar(cliente.id)}
        >
          Aprobar
        </Button>

        <Button
          variant="danger"
          onClick={() => onRechazar(cliente.id)}
        >
          Rechazar
        </Button>

      </div>

    </Card>
  );
}

export default ClienteRequestCard;