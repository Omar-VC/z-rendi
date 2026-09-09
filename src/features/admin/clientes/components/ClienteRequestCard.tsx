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
  // Iniciales estilizadas
  const iniciales = `${cliente.nombre?.[0] || ""}${cliente.apellido?.[0] || ""}`.toUpperCase() || "AT";

  return (
    <Card className="!p-4 bg-surface/80 border-border/60 hover:border-border/90 transition-all duration-200 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* INFORMACIÓN DEL SOLICITANTE */}
        <div className="flex items-center gap-3 min-w-[240px]">
          <div className="w-10 h-10 rounded-xl bg-surfaceSoft border border-warning/40 flex items-center justify-center font-black text-warning text-xs shrink-0 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
            {iniciales}
          </div>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text truncate">
                {cliente.nombre} {cliente.apellido}
              </h3>
              <Badge variant="warning" className="text-[10px] px-1.5 py-0.5">
                Pendiente
              </Badge>
            </div>
            <p className="text-xs text-muted truncate mt-0.5">
              {cliente.email}
            </p>
          </div>
        </div>

        {/* ACCIONES DE APROBACIÓN */}
        <div className="flex items-center gap-2 justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-border/30 shrink-0">
          <Button
            variant="danger"
            className="!min-h-0 !h-8 !px-3 text-xs font-semibold opacity-80 hover:opacity-100"
            onClick={() => onRechazar(cliente.id)}
          >
            Rechazar
          </Button>

          <Button
            variant="success"
            className="!min-h-0 !h-8 !px-4 text-xs font-bold shadow-[0_0_12px_rgba(34,197,94,0.2)]"
            onClick={() => onAceptar(cliente.id)}
          >
            Aprobar
          </Button>
        </div>

      </div>
    </Card>
  );
}

export default ClienteRequestCard;