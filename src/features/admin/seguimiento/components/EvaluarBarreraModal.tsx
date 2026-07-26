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

  const [resultado, setResultado] = useState(
    barrera.resultado ?? ""
  );

  const [observaciones, setObservaciones] = useState(
    barrera.observaciones ?? ""
  );

  async function guardar() {

    await actualizarBarrera(
      barrera.id,
      {
        resultado,
        observaciones,
        estado: "superada",
      }
    );

    onGuardado();

  }

  return (

    <Modal
      title="Evaluar prueba"
      onClose={onClose}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            variant="accent"
            onClick={guardar}
          >
            Marcar como superada
          </Button>
        </>
      }
    >

      <div className="space-y-5">

        <Card className="bg-slate-50">

          <p className="text-sm text-slate-500">
            Prueba
          </p>

          <p className="font-semibold">
            {barrera.nombre}
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Objetivo
          </p>

          <p className="font-semibold">
            {barrera.objetivo}
          </p>

        </Card>


        <div>

          <Label>
            Resultado obtenido
          </Label>

          <Input
            value={resultado}
            onChange={(e) =>
              setResultado(e.target.value)
            }
            placeholder="Ej: 110 kg"
          />

        </div>


        <div>

          <Label>
            Observaciones
          </Label>

          <Textarea
            value={observaciones}
            onChange={(e) =>
              setObservaciones(e.target.value)
            }
            placeholder="Observaciones de la evaluación..."
            rows={4}
          />

        </div>

      </div>

    </Modal>

  );

}