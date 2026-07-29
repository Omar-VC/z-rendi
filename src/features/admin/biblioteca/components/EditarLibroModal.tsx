import { useState } from "react";

import type { TrainingBook } from "../types/trainingBook";

import { actualizarLibro } from "../services/trainingBooksService";

import {
  Modal,
  Input,
  Select,
  Textarea,
  Button,
  Badge,
} from "../../../../shared/ui";

type Props = {
  libro: TrainingBook;
  onClose: () => void;
  onGuardado: () => void;
};

export default function EditarLibroModal({
  libro,
  onClose,
  onGuardado,
}: Props) {

  const [nombre, setNombre] =
    useState(libro.nombre);

  const [categoria, setCategoria] =
    useState<TrainingBook["categoria"]>(
      libro.categoria
    );

  const [ejercicios, setEjercicios] =
    useState(
      libro.ejercicios.join("\n")
    );

  const [observaciones, setObservaciones] =
    useState(
      libro.observaciones || ""
    );

  async function guardar() {

    await actualizarLibro(libro.id, {

      nombre,

      categoria,

      ejercicios: ejercicios
        .split("\n")
        .map((e) => e.trim())
        .filter(Boolean),

      observaciones,

    });

    onGuardado();

  }

  return (

    <Modal
      title="Editar libro"
      onClose={onClose}
    >

      <div className="space-y-6">

        <Input
          label="Nombre"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
        />

        <Select
          label="Categoría"
          value={categoria}
          onChange={(e) =>
            setCategoria(
              e.target.value as TrainingBook["categoria"]
            )
          }
        >

          <option value="Fuerza">
            Fuerza
          </option>

          <option value="Potencia">
            Potencia
          </option>

          <option value="Velocidad">
            Velocidad
          </option>

          <option value="Resistencia">
            Resistencia
          </option>

          <option value="Prevención">
            Prevención
          </option>

        </Select>

        <div className="space-y-3">

          <div className="flex items-center justify-between">

            <label className="text-sm font-medium text-text">
              Ejercicios
            </label>

            <Badge variant="info">
              {
                ejercicios
                  .split("\n")
                  .filter((e) => e.trim())
                  .length
              } ejercicios
            </Badge>

          </div>

          <Textarea
            rows={8}
            placeholder="Un ejercicio por línea"
            value={ejercicios}
            onChange={(e) =>
              setEjercicios(e.target.value)
            }
          />

        </div>

        <Textarea
          label="Observaciones"
          placeholder="Notas adicionales..."
          value={observaciones}
          onChange={(e) =>
            setObservaciones(e.target.value)
          }
        />

        <div className="flex justify-end gap-3">

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
            Guardar cambios
          </Button>

        </div>

      </div>

    </Modal>

  );
}