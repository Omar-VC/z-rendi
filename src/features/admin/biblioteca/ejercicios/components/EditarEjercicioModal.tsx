import { useState } from "react";

import type {
  Exercise,
  GrupoMuscular,
} from "../types/exercise";

import { actualizarEjercicio } from "../services/exerciseService";

import {
  Modal,
  Input,
  Select,
  Textarea,
  Button,
} from "../../../../../shared/ui";

type Props = {
  ejercicio: Exercise;
  onClose: () => void;
  onGuardado: () => void;
};

const gruposMusculares: GrupoMuscular[] = [
  "Cuádriceps",
  "Isquiosurales",
  "Glúteos",
  "Bíceps",
  "Tríceps",
  "Pectoral",
  "Espalda",
  "Hombros",
  "Abdominales",
  "Pantorrillas",
  "Otro",
];

export default function EditarEjercicioModal({
  ejercicio,
  onClose,
  onGuardado,
}: Props) {
  const [nombre, setNombre] = useState(ejercicio.nombre);

  const [grupoMuscular, setGrupoMuscular] =
    useState<GrupoMuscular>(
      ejercicio.grupoMuscular
    );

  const [descripcion, setDescripcion] =
    useState(
      ejercicio.descripcion ?? ""
    );

  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    if (!nombre.trim()) {
      alert("Escribí el nombre del ejercicio.");
      return;
    }

    try {
      setGuardando(true);

      await actualizarEjercicio(
        ejercicio.id,
        {
          nombre: nombre.trim(),
          grupoMuscular,
          descripcion:
            descripcion.trim() || undefined,
        }
      );

      onGuardado();
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el ejercicio.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      title="Editar ejercicio"
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
            onClick={guardar}
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Guardar cambios"}
          </Button>
        </>
      }
    >
      <div className="space-y-6">

        <Input
          label="Nombre del ejercicio"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
        />

        <Select
          label="Grupo muscular"
          value={grupoMuscular}
          onChange={(e) =>
            setGrupoMuscular(
              e.target.value as GrupoMuscular
            )
          }
        >
          {gruposMusculares.map((grupo) => (
            <option
              key={grupo}
              value={grupo}
            >
              {grupo}
            </option>
          ))}
        </Select>

        <Textarea
          label="Descripción"
          placeholder="Descripción técnica o información útil..."
          value={descripcion}
          onChange={(e) =>
            setDescripcion(e.target.value)
          }
        />

      </div>
    </Modal>
  );
}