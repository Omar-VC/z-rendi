import { useState } from "react";

import type { TrainingBook, GrupoMuscular } from "../types/trainingBook";

import {
  Modal,
  Input,
  Select,
  Textarea,
  Button,
} from "../../../../../shared/ui";

interface Props {
  abierto: boolean;
  cerrar: () => void;
  agregarLibro: (libro: Omit<TrainingBook, "id">) => Promise<void>;
  preparadorId: string;
}

export default function NuevoLibroModal({
  abierto,
  cerrar,
  agregarLibro,
  preparadorId,
}: Props) {
  const [nombre, setNombre] = useState("");

  const [categoria, setCategoria] =
    useState<TrainingBook["categoria"]>("Fuerza");

  const [gruposMusculares, setGruposMusculares] = useState<GrupoMuscular[]>([]);

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

  const [observaciones, setObservaciones] = useState("");

  if (!abierto) return null;

  async function guardar() {
    if (!nombre.trim()) return;

    await agregarLibro({
      preparadorId,
      nombre,
      categoria,
      gruposMusculares,
      observaciones,
    });

    cerrar();

    setNombre("");
    setGruposMusculares([]);
    setObservaciones("");
  }

  return (
    <Modal title="Nuevo libro" onClose={cerrar}>
      <div className="space-y-6">
        <Input
          label="Nombre del libro"
          placeholder="Ej.: Fuerza Tren Inferior"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <Select
          label="Categoría"
          value={categoria}
          onChange={(e) =>
            setCategoria(e.target.value as TrainingBook["categoria"])
          }
        >
          <option>Fuerza</option>
          <option>Potencia</option>
          <option>Velocidad</option>
          <option>Resistencia</option>
          <option>Prevención</option>
        </Select>

        <div className="space-y-3">
          <label className="text-sm font-medium text-text">
            Grupos musculares
          </label>

          <div className="flex flex-wrap gap-2">
            {gruposDisponibles.map((grupo) => {
              const seleccionado = gruposMusculares.includes(grupo);

              return (
                <button
                  key={grupo}
                  type="button"
                  onClick={() => {
                    setGruposMusculares((actuales) =>
                      seleccionado
                        ? actuales.filter((item) => item !== grupo)
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
          onChange={(e) => setObservaciones(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={cerrar}>
            Cancelar
          </Button>

          <Button variant="accent" onClick={guardar}>
            Guardar libro
          </Button>
        </div>
      </div>
    </Modal>
  );
}
