import { useMemo, useState } from "react";

import { useExercises } from "../hooks/useExercises";
import type { GrupoMuscular } from "../types/exercise";

import NuevoEjercicioModal from "./NuevoEjercicioModal";
import EjercicioCard from "./EjercicioCard";

import {
  Button,
  Input,
  Select,
  EmptyState,
  Loading,
} from "../../../../../shared/ui";

type Props = {
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

export default function BibliotecaEjercicios({
  preparadorId,
}: Props) {
  const {
    ejercicios,
    loading,
    recargar,
    agregarEjercicio,
  } = useExercises(preparadorId);

  const [mostrarNuevo, setMostrarNuevo] =
    useState(false);

  const [busqueda, setBusqueda] =
    useState("");

  const [grupoSeleccionado, setGrupoSeleccionado] =
    useState<GrupoMuscular | "Todos">("Todos");

  const ejerciciosFiltrados = useMemo(() => {
    const texto = busqueda
      .trim()
      .toLowerCase();

    return ejercicios.filter((ejercicio) => {
      const coincideNombre =
        !texto ||
        ejercicio.nombre
          .toLowerCase()
          .includes(texto);

      const coincideGrupo =
        grupoSeleccionado === "Todos" ||
        ejercicio.grupoMuscular ===
          grupoSeleccionado;

      return (
        coincideNombre &&
        coincideGrupo
      );
    });
  }, [
    ejercicios,
    busqueda,
    grupoSeleccionado,
  ]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      ">
        <div>
          <h2 className="
            text-2xl
            font-bold
            text-text
          ">
            Ejercicios
          </h2>

          <p className="
            mt-1
            text-sm
            text-muted
          ">
            Biblioteca de ejercicios disponibles
            para tus sesiones.
          </p>
        </div>

        <Button
          variant="accent"
          onClick={() =>
            setMostrarNuevo(true)
          }
        >
          + Nuevo ejercicio
        </Button>
      </div>

      {/* Filtros */}

      <div className="
        grid
        gap-4
        md:grid-cols-2
      ">
        <Input
          label="Buscar ejercicio"
          placeholder="Ej.: Sentadilla"
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
        />

        <Select
          label="Grupo muscular"
          value={grupoSeleccionado}
          onChange={(e) =>
            setGrupoSeleccionado(
              e.target.value as
                | GrupoMuscular
                | "Todos"
            )
          }
        >
          <option value="Todos">
            Todos
          </option>

          {gruposMusculares.map((grupo) => (
            <option
              key={grupo}
              value={grupo}
            >
              {grupo}
            </option>
          ))}
        </Select>
      </div>

      {/* Resultados */}

      {ejerciciosFiltrados.length === 0 ? (
        <EmptyState
          title={
            ejercicios.length === 0
              ? "Todavía no hay ejercicios."
              : "No se encontraron ejercicios."
          }
        />
      ) : (
        <div className="
          grid
          gap-5
          md:grid-cols-2
        ">
          {ejerciciosFiltrados.map(
            (ejercicio) => (
              <EjercicioCard
                key={ejercicio.id}
                ejercicio={ejercicio}
                onActualizado={recargar}
              />
            )
          )}
        </div>
      )}

      {/* Nuevo ejercicio */}

      {mostrarNuevo && (
        <NuevoEjercicioModal
          abierto={mostrarNuevo}
          cerrar={() =>
            setMostrarNuevo(false)
          }
          agregarEjercicio={
            agregarEjercicio
          }
          preparadorId={preparadorId}
        />
      )}

    </div>
  );
}