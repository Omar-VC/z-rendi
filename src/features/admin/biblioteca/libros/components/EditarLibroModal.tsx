import { useState } from "react";

import type {
  TrainingBook,
  GrupoMuscular,
} from "../types/trainingBook";

import { actualizarLibro } from "../services/trainingBooksService";

import {
  Modal,
  Input,
  Select,
  Textarea,
  Button,
} from "../../../../../shared/ui";

type Props = {
  libro: TrainingBook;
  onClose: () => void;
  onGuardado: () => void;
};

const gruposDisponibles: GrupoMuscular[] = [
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

export default function EditarLibroModal({
  libro,
  onClose,
  onGuardado,
}: Props) {
  const [nombre, setNombre] = useState(libro.nombre);

  const [categoria, setCategoria] =
    useState<TrainingBook["categoria"]>(libro.categoria);

  const [gruposMusculares, setGruposMusculares] =
    useState<GrupoMuscular[]>(libro.gruposMusculares ?? []);

  const [observaciones, setObservaciones] =
    useState(libro.observaciones || "");

  async function guardar() {
    await actualizarLibro(libro.id, {
      nombre,
      categoria,
      gruposMusculares,
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
          onChange={(e) => setNombre(e.target.value)}
        />

        <Select
          label="Categoría"
          value={categoria}
          onChange={(e) =>
            setCategoria(
              e.target.value as TrainingBook["categoria"],
            )
          }
        >
          <option value="Fuerza">Fuerza</option>
          <option value="Potencia">Potencia</option>
          <option value="Velocidad">Velocidad</option>
          <option value="Resistencia">Resistencia</option>
          <option value="Prevención">Prevención</option>
        </Select>

        <div className="space-y-3">
          <label className="text-sm font-medium text-text">
            Grupos musculares
          </label>

          <div className="flex flex-wrap gap-2">
            {gruposDisponibles.map((grupo) => {
              const seleccionado =
                gruposMusculares.includes(grupo);

              return (
                <button
                  key={grupo}
                  type="button"
                  onClick={() => {
                    setGruposMusculares((actuales) =>
                      seleccionado
                        ? actuales.filter(
                            (item) => item !== grupo,
                          )
                        : [...actuales, grupo],
                    );
                  }}
                  className={`
                    rounded-lg
                    border
                    px-3
                    py-2
                    text-sm
                    transition
                    ${
                      seleccionado
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-surface text-text hover:bg-surfaceHover"
                    }
                  `}
                >
                  {grupo}
                </button>
              );
            })}
          </div>
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