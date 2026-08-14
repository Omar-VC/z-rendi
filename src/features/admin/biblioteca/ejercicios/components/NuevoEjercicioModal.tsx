import { useState } from "react";

import type {
  Exercise,
  GrupoMuscular,
} from "../types/exercise";

import {
  Modal,
  Input,
  Select,
  Textarea,
  Button,
} from "../../../../../shared/ui";

type Props = {
  abierto: boolean;
  cerrar: () => void;
  agregarEjercicio: (
    ejercicio: Omit<Exercise, "id">
  ) => Promise<void>;
  preparadorId: string;
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

export default function NuevoEjercicioModal({
  abierto,
  cerrar,
  agregarEjercicio,
  preparadorId,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [grupoMuscular, setGrupoMuscular] =
    useState<GrupoMuscular>("Cuádriceps");
  const [descripcion, setDescripcion] = useState("");

  const [guardando, setGuardando] = useState(false);

  if (!abierto) return null;

  async function guardar() {
    if (!nombre.trim()) {
      alert("Escribí el nombre del ejercicio.");
      return;
    }

    try {
      setGuardando(true);

      await agregarEjercicio({
        preparadorId,
        nombre: nombre.trim(),
        grupoMuscular,
        descripcion: descripcion.trim() || undefined,
      });

      setNombre("");
      setGrupoMuscular("Cuádriceps");
      setDescripcion("");

      cerrar();
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar el ejercicio.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      title="Nuevo ejercicio"
      onClose={cerrar}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={cerrar}
            disabled={guardando}
          >
            Cancelar
          </Button>

          <Button
            variant="accent"
            onClick={guardar}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar ejercicio"}
          </Button>
        </>
      }
    >
      <div className="space-y-6">

        <Input
          label="Nombre del ejercicio"
          placeholder="Ej.: Sentadilla"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
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
            <option key={grupo} value={grupo}>
              {grupo}
            </option>
          ))}
        </Select>

        <Textarea
          label="Descripción"
          placeholder="Descripción técnica o información útil del ejercicio..."
          value={descripcion}
          onChange={(e) =>
            setDescripcion(e.target.value)
          }
        />

      </div>
    </Modal>
  );
}