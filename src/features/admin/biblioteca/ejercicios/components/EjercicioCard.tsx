import { useState } from "react";

import type { Exercise } from "../types/exercise";

import { eliminarEjercicio } from "../services/exerciseService";

import EditarEjercicioModal from "./EditarEjercicioModal";

import {
  Card,
  Button,
  Badge,
} from "../../../../../shared/ui";

type Props = {
  ejercicio: Exercise;
  onActualizado: () => void;
};

export default function EjercicioCard({
  ejercicio,
  onActualizado,
}: Props) {
  const [mostrarEditar, setMostrarEditar] =
    useState(false);

  async function borrarEjercicio() {
    const confirmar = window.confirm(
      `¿Eliminar el ejercicio "${ejercicio.nombre}"?`
    );

    if (!confirmar) return;

    try {
      await eliminarEjercicio(ejercicio.id);

      onActualizado();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el ejercicio.");
    }
  }

  return (
    <Card>
      <div className="flex flex-col gap-5">

        <div>
          <h3 className="text-xl font-bold text-text">
            {ejercicio.nombre}
          </h3>

          <div className="mt-3">
            <Badge variant="info">
              {ejercicio.grupoMuscular}
            </Badge>
          </div>
        </div>

        {ejercicio.descripcion && (
          <div>
            <p className="mb-2 text-sm font-semibold text-text">
              Descripción
            </p>

            <p className="text-sm text-muted whitespace-pre-line">
              {ejercicio.descripcion}
            </p>
          </div>
        )}

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
            onClick={() =>
              setMostrarEditar(true)
            }
          >
            Editar
          </Button>

          <Button
            variant="danger"
            onClick={borrarEjercicio}
          >
            Eliminar
          </Button>
        </div>
      </div>

      {mostrarEditar && (
        <EditarEjercicioModal
          ejercicio={ejercicio}
          onClose={() =>
            setMostrarEditar(false)
          }
          onGuardado={() => {
            onActualizado();
            setMostrarEditar(false);
          }}
        />
      )}
    </Card>
  );
}