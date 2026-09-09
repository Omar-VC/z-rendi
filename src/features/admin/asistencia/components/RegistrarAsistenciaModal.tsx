import { useState } from "react";

import type { Cliente } from "../../clientes/types";
import type { EstadoAsistencia } from "../types/asistencia.types";

import { guardarAsistencia } from "../services/asistenciaService";

import {
  Modal,
  Input,
  Button,
} from "../../../../shared/ui";

interface RegistrarAsistenciaModalProps {
  cliente: Cliente;
  onCerrar: () => void;
  onGuardado?: () => void;
}

export default function RegistrarAsistenciaModal({
  cliente,
  onCerrar,
  onGuardado,
}: RegistrarAsistenciaModalProps) {
  const [fecha, setFecha] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [estado, setEstado] = useState<EstadoAsistencia | null>(null);
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    if (!estado) return;

    try {
      setGuardando(true);
      await guardarAsistencia(
        cliente.id,
        fecha,
        estado,
        cliente.frecuenciaSemanal ?? 0
      );
      onGuardado?.();
      onCerrar();
    } catch (error) {
      console.error("Error al guardar asistencia:", error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal title="Registrar asistencia" onClose={onCerrar}>
      <div className="space-y-5">
        {/* Información del Atleta */}
        <div className="p-3 bg-surfaceSoft/50 rounded-card border border-border/40">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">
            Atleta
          </p>
          <p className="text-sm font-bold text-primary mt-0.5">
            {cliente.nombre} {cliente.apellido}
          </p>
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
            Fecha
          </label>
          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            Estado
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={estado === "presente" ? "success" : "secondary"}
              className="w-full !min-h-[40px]"
              onClick={() => setEstado("presente")}
            >
              Presente
            </Button>

            <Button
              type="button"
              variant={estado === "falta" ? "danger" : "secondary"}
              className="w-full !min-h-[40px]"
              onClick={() => setEstado("falta")}
            >
              Falta
            </Button>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-3 border-t border-border/40">
          <Button
            type="button"
            variant="secondary"
            onClick={onCerrar}
            disabled={guardando}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="accent"
            onClick={handleGuardar}
            disabled={!estado || guardando}
          >
            {guardando ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}