import { useState } from "react";

import type { TrainingBook } from "../types/trainingBook";

import { eliminarLibro } from "../services/trainingBooksService";

import EditarLibroModal from "./EditarLibroModal";

import {
  Card,
  Button,
  Badge,
} from "../../../../../shared/ui";

type Props = {
  libro: TrainingBook;
  onActualizado: () => void;
};

export default function LibroCard({
  libro,
  onActualizado,
}: Props) {
  const [mostrarEditar, setMostrarEditar] = useState(false);

  async function borrarLibro() {
    const confirmar = window.confirm(
      "¿Eliminar este tipo de sesión?",
    );

    if (!confirmar) return;

    await eliminarLibro(libro.id);

    onActualizado();
  }

  return (
    <Card>
      <div className="flex flex-col gap-5">

        {/* Header */}

        <div>
          <h3 className="text-xl font-bold text-text">
            {libro.nombre}
          </h3>

          <div className="mt-3">
            <Badge variant="info">
              {libro.categoria}
            </Badge>
          </div>
        </div>

        {/* Grupos musculares */}

        <div>
          <p className="mb-3 text-sm font-semibold text-text">
            Grupos musculares
          </p>

          <div className="flex flex-wrap gap-2">
            {libro.gruposMusculares.map((grupo) => (
              <Badge
                key={grupo}
                variant="neutral"
              >
                {grupo}
              </Badge>
            ))}
          </div>

          {libro.gruposMusculares.length === 0 && (
            <p className="text-sm text-muted">
              Sin grupos musculares definidos.
            </p>
          )}
        </div>

        {/* Acciones */}

        <div
          className="
            flex
            justify-end
            gap-3
            pt-4
            border-t
            border-border
          "
        >
          <Button
            variant="secondary"
            onClick={() => setMostrarEditar(true)}
          >
            Editar
          </Button>

          <Button
            variant="danger"
            onClick={borrarLibro}
          >
            Eliminar
          </Button>
        </div>

      </div>

      {mostrarEditar && (
        <EditarLibroModal
          libro={libro}
          onClose={() => setMostrarEditar(false)}
          onGuardado={() => {
            onActualizado();
            setMostrarEditar(false);
          }}
        />
      )}
    </Card>
  );
}