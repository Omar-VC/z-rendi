import { useState } from "react";

import { guardarNuevoObjetivo } from "../services/barrerasService";

import type { Barrera } from "../types/barrera";

import {
  Modal,
  Card,
  Label,
  Input,
  Button,
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

  async function guardar() {

    if (!nuevoObjetivo.trim()) {

      alert("Ingresa un nuevo objetivo.");

      return;

    }

    await guardarNuevoObjetivo(
      barrera.id,
      nuevoObjetivo.trim(),
    );

    onGuardado();

  }

  return (

    <Modal
      title="Nuevo objetivo"
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
            Guardar
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
            Objetivo anterior
          </p>

          <p className="font-semibold">
            {barrera.objetivo}
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Resultado obtenido
          </p>

          <p className="font-semibold">
            {barrera.resultado || "-"}
          </p>

        </Card>


        <div>

          <Label>
            Nuevo objetivo
          </Label>

          <Input
            value={nuevoObjetivo}
            onChange={(e) =>
              setNuevoObjetivo(
                e.target.value,
              )
            }
            placeholder="Ej: 120 kg"
          />

        </div>

      </div>

    </Modal>

  );

}