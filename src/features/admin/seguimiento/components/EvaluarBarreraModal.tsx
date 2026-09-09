import { useState } from "react";

import { actualizarBarrera } from "../services/barrerasService";

import type { Barrera } from "../types/barrera";

import {
  Modal,
  Card,
  Label,
  Input,
  Textarea,
  Button,
  Badge,
} from "../../../../shared/ui";

type Props = {
  barrera: Barrera;
  onClose: () => void;
  onGuardado: () => void;
};

export default function EvaluarBarreraModal({
  barrera,
  onClose,
  onGuardado,
}: Props) {
  const [resultado, setResultado] = useState(barrera.resultado ?? "");
  const [observaciones, setObservaciones] = useState(
    barrera.observaciones ?? "",
  );
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    if (!resultado.trim()) {
      alert("Por favor, ingresa el resultado obtenido.");
      return;
    }

    try {
      setGuardando(true);
      await actualizarBarrera(barrera.id, {
        resultado: resultado.trim(),
        observaciones: observaciones.trim(),
        estado: "superada",
      });

      onGuardado();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al intentar guardar la evaluación.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      title="Evaluar Prueba Física"
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
            {guardando ? "Guardando..." : "Marcar como Superada"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-left">
        {/* RESUMEN DE LA BARRERA / PRUEBA */}
        <Card className="!p-3.5 bg-surfaceSoft/50 border-border/40 rounded-xl space-y-2">
          <div className="flex items-center justify-between gap-2 border-b border-border/30 pb-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Prueba Evaluable
              </p>
              <h4 className="text-xs font-extrabold text-text mt-0.5">
                {barrera.nombre}
              </h4>
            </div>

            {barrera.unidad && (
              <Badge
                variant="neutral"
                className="text-[10px] px-2 py-0.5 font-mono font-semibold"
              >
                {barrera.unidad}
              </Badge>
            )}
          </div>

          <div className="text-xs">
            <p className="text-[11px] font-medium text-muted">Objetivo Propuesto</p>
            <p className="font-semibold text-text mt-0.5">
              {barrera.objetivo}
            </p>
          </div>
        </Card>

        {/* CAMPO: RESULTADO OBTENIDO */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-text">
              Resultado Obtenido
            </Label>
            {barrera.unidad && (
              <span className="text-[10px] font-mono text-muted">
                Unidad: {barrera.unidad}
              </span>
            )}
          </div>

          <Input
            value={resultado}
            disabled={guardando}
            onChange={(e) => setResultado(e.target.value)}
            placeholder={
              barrera.unidad
                ? `Ej: 110 ${barrera.unidad}`
                : "Ej: 110 kg o 3 min 45 sec"
            }
            className="bg-surfaceSoft border-border/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary/40 rounded-lg"
          />
        </div>

        {/* CAMPO: OBSERVACIONES */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-text">
            Observaciones de la Evaluación
          </Label>

          <Textarea
            value={observaciones}
            disabled={guardando}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Añade detalles sobre la ejecución, sensaciones del atleta o condiciones del test..."
            rows={3}
            className="bg-surfaceSoft border-border/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary/40 rounded-lg resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}