import { useState } from "react";

import { actualizarFrecuenciaSemanal } from "../services/clientes.service";

import {
  Card,
  Button,
  Select,
} from "../../../../shared/ui";

interface ClienteTrainingConfigProps {
  clienteId: string;
  frecuenciaSemanal?: number;
  onGuardado?: (frecuencia: number) => void;
}

function ClienteTrainingConfig({
  clienteId,
  frecuenciaSemanal,
  onGuardado,
}: ClienteTrainingConfigProps) {
  const [frecuencia, setFrecuencia] = useState(frecuenciaSemanal ?? 3);
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando] = useState(frecuenciaSemanal === undefined);

  const guardarFrecuencia = async () => {
    try {
      setGuardando(true);
      await actualizarFrecuenciaSemanal(clienteId, frecuencia);
      setEditando(false);
      onGuardado?.(frecuencia);
    } catch (error) {
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  if (!editando) {
    return (
      <Card className="!p-3 bg-surface/40 border-border/40 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center font-black text-primary text-xs shrink-0">
              {frecuencia}x
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted">
                Frecuencia Semanal
              </p>
              <p className="text-xs font-extrabold text-text">
                {frecuencia} {frecuencia === 1 ? "día por semana" : "días por semana"}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            className="!min-h-0 !h-8 !px-3 text-xs font-semibold"
            onClick={() => setEditando(true)}
          >
            Ajustar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="!p-4 bg-surface/60 border-border/60">
      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-text">
            Frecuencia de Entrenamiento
          </h4>
          <p className="text-xs text-muted font-medium mt-0.5">
            Determina la base para el cálculo del % de asistencia.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 pt-1">
          <div className="flex-1">
            <Select
              label=""
              value={frecuencia}
              onChange={(e) => setFrecuencia(Number(e.target.value))}
              /* Se remueve !h-9 para evitar cortar el texto y se usa py-2 py-1 flex para centrado perfecto */
              className="py-2 text-sm font-semibold text-text bg-surface border-border rounded-lg leading-normal"
            >
              <option value={1}>1 día por semana</option>
              <option value={2}>2 días por semana</option>
              <option value={3}>3 días por semana</option>
              <option value={4}>4 días por semana</option>
              <option value={5}>5 días por semana</option>
              <option value={6}>6 días por semana</option>
            </Select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {frecuenciaSemanal !== undefined && (
              <Button
                variant="outline"
                className="!min-h-0 h-10 !px-3 text-xs font-semibold"
                onClick={() => {
                  setFrecuencia(frecuenciaSemanal);
                  setEditando(false);
                }}
                disabled={guardando}
              >
                Cancelar
              </Button>
            )}

            <Button
              variant="accent"
              className="!min-h-0 h-10 !px-4 text-xs font-bold shadow-[0_0_12px_rgba(255,85,0,0.25)]"
              onClick={guardarFrecuencia}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ClienteTrainingConfig;