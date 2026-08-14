import { useState } from "react";

import {
  Modal,
  Input,
  Textarea,
  Button,
  Label,
} from "../../../../shared/ui";

type Props = {
  onClose: () => void;
  onGuardar: (datos: {
    duracion: number;
    rpe: number;
    observaciones: string;
  }) => Promise<void>;
};

export default function CompletarSesionModal({
  onClose,
  onGuardar,
}: Props) {
  const [duracion, setDuracion] = useState("");
  const [rpe, setRpe] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [guardando, setGuardando] = useState(false);

  const duracionNumero = Number(duracion);
  const rpeNumero = Number(rpe);

  const carga =
    duracionNumero > 0 && rpeNumero > 0
      ? duracionNumero * rpeNumero
      : 0;

  async function handleGuardar() {
    if (!duracionNumero || duracionNumero <= 0) {
      alert("Ingresá la duración de la sesión.");
      return;
    }

    if (
      !rpeNumero ||
      rpeNumero < 1 ||
      rpeNumero > 10
    ) {
      alert("El RPE debe estar entre 1 y 10.");
      return;
    }

    try {
      setGuardando(true);

      await onGuardar({
        duracion: duracionNumero,
        rpe: rpeNumero,
        observaciones,
      });

    } catch (error) {
      console.error(error);
      alert("No se pudo completar la sesión.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      title="Completar sesión"
      onClose={onClose}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={guardando}
          >
            Cancelar
          </Button>

          <Button
            variant="accent"
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Finalizar sesión"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">

        {/* Duración */}

        <div>
          <Label>
            Duración (minutos)
          </Label>

          <Input
            type="number"
            min={1}
            placeholder="Ej: 60"
            value={duracion}
            onChange={(e) =>
              setDuracion(e.target.value)
            }
          />
        </div>


        {/* RPE */}

        <div>
          <Label>
            Percepción del esfuerzo
          </Label>

          <p className="
            text-sm
            text-muted
            mb-2
          ">
            1 = muy fácil · 10 = máximo esfuerzo
          </p>

          <Input
            type="number"
            min={1}
            max={10}
            placeholder="Ej: 7"
            value={rpe}
            onChange={(e) =>
              setRpe(e.target.value)
            }
          />
        </div>


        {/* Carga */}

        <div className="
          rounded-xl
          border
          border-border
          bg-surface-soft
          p-5
        ">

          <p className="
            text-sm
            text-muted
          ">
            Carga de entrenamiento
          </p>

          <p className="
            mt-1
            text-3xl
            font-bold
            text-accent
          ">
            {carga}
          </p>

          <p className="
            text-xs
            text-muted
          ">
            Duración × RPE
          </p>

        </div>


        {/* Observaciones */}

        <div>
          <Label>
            Observaciones
          </Label>

          <Textarea
            placeholder="¿Cómo te sentiste durante el entrenamiento?"
            value={observaciones}
            onChange={(e) =>
              setObservaciones(e.target.value)
            }
          />
        </div>

      </div>
    </Modal>
  );
}