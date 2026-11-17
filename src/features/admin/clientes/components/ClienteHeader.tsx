import { useState } from "react";

import type { Cliente } from "../types";
import { Card, Badge, Button } from "../../../../shared/ui";
import EnviarAvisoModal from "../../../avisos/components/EnviarAvisoModal";

interface ClienteHeaderProps {
  cliente: Cliente;
}

function ClienteHeader({ cliente }: ClienteHeaderProps) {
  const [avisoAbierto, setAvisoAbierto] = useState(false);

  const iniciales =
    `${cliente.nombre?.[0] || ""}${cliente.apellido?.[0] || ""}`.toUpperCase() ||
    "AT";

  return (
    <Card className="!p-5 bg-surface/80 border-border/60 shadow-lg backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-surfaceSoft border border-primary/40 flex items-center justify-center font-black text-primary text-xl shrink-0 shadow-[0_0_15px_rgba(255,85,0,0.15)]">
            {iniciales}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-black text-text tracking-tight">
              {cliente.nombre} {cliente.apellido}
            </h1>
            <p className="text-xs md:text-sm text-muted font-medium mt-0.5">
              {cliente.email}
            </p>
          </div>
        </div>

        <div className="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 border-border/40 pt-3 md:pt-0 gap-2">
          <Badge
            variant={cliente.estado === "aprobado" ? "success" : "warning"}
            className="text-xs px-2.5 py-1 font-bold tracking-wider uppercase"
          >
            {cliente.estado}
          </Badge>

          <Button
            variant="accent"
            className="!min-h-0 h-8 !px-3 text-xs font-bold"
            onClick={() => setAvisoAbierto(true)}
          >
            Enviar aviso
          </Button>
        </div>
      </div>

      {avisoAbierto && (
        <EnviarAvisoModal
          clienteId={cliente.id}
          nombre={cliente.nombre ?? "atleta"}
          onClose={() => setAvisoAbierto(false)}
        />
      )}
    </Card>
  );
}

export default ClienteHeader;