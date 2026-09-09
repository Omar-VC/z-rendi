import { useState } from "react";

import { guardarNuevoObjetivo } from "../services/barrerasService";

import type { Barrera } from "../types/barrera";

import {
  Modal,
  Card,
  Label,
  Input,
  Button,
  Badge,
} from "../../../../shared/ui";

type Props = {
  barrera: Barrera;
  onClose: () => void;
  onGuardado: () => void;
};

export default function NuevoObjetivoModal({
  barrera,
  onClose,
  onGuardado,
}: Props) {
  const [nuevoObjetivo, setNuevoObjetivo] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    if (!nuevoObjetivo.trim()) {
      alert("Ingresa una nueva meta u objetivo.");
      return;
    }

    try {
      setGuardando(true);
      await guardarNuevoObjetivo(barrera.id, nuevoObjetivo.trim());
      onGuardado();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al intentar actualizar el objetivo.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      title="Establecer Nuevo Objetivo"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            variant="secondary"
            className="!min-h-0 h-8 !px-3 text-xs font-semibold"
            onClick={onClose}
            disabled={guardando}
          >
            Cancelar
          </Button>

          <Button
            variant="accent"
            className="!min-h-0 h-8 !px-4 text-xs font-bold shadow-[0_0_12px_rgba(255,85,0,0.25)]"
            onClick={guardar}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Actualizar Objetivo"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-left">
        {/* RESUMEN DE LA BARRERA Y HISTORIAL PREVIO */}
        <Card className="!p-3.5 bg-surfaceSoft/50 border-border/40 rounded-xl space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-border/30 pb-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Prueba Física
              </p>
              <h4 className="text-xs font-extrabold text-text mt-0.5">
                {barrera.nombre}
              </h4>
            </div>

            {barrera.unidad && (
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 font-mono font-semibold">
                Unidad: {barrera.unidad}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-[11px] font-medium text-muted">Objetivo Anterior</p>
              <p className="font-semibold text-text/80 mt-0.5">
                {barrera.objetivo}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium text-muted">Último Resultado</p>
              <p className="font-bold text-accent mt-0.5 font-mono">
                {barrera.resultado || "Sin registro"}
              </p>
            </div>
          </div>
        </Card>

        {/* INPUT DEL NUEVO OBJETIVO */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-text">
              Nuevo Objetivo / Marca
            </Label>
            {barrera.unidad && (
              <span className="text-[10px] font-mono text-muted">
                Expresado en {barrera.unidad}
              </span>
            )}
          </div>

          <Input
            value={nuevoObjetivo}
            disabled={guardando}
            onChange={(e) => setNuevoObjetivo(e.target.value)}
            placeholder={
              barrera.unidad
                ? `Ej: 120 ${barrera.unidad}`
                : "Ej: Incrementar a 120 kg o reducir tiempo a 4 min"
            }
            className="bg-surfaceSoft border-border/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary/40 rounded-lg"
          />
        </div>
      </div>
    </Modal>
  );
}