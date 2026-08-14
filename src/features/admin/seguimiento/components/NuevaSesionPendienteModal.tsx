import { useState } from "react";

import { useAuth } from "../../../../auth/useAuth";
import { useTrainingBooks } from "../../biblioteca/tipo-sesion/hooks/useTrainingBooks";

import {
  crearSesionPendiente,
} from "../services/sesionesPendientes.service";

import {
  Modal,
  Input,
  Select,
  Textarea,
  Button,
  Label,
} from "../../../../shared/ui";

type Props = {
  clienteId: string;
  onClose: () => void;
  onGuardado: () => void;
};

export default function NuevaSesionPendienteModal({
  clienteId,
  onClose,
  onGuardado,
}: Props) {
  const { user } = useAuth();

  const [libroId, setLibroId] = useState("");
  const [fecha, setFecha] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [objetivo, setObjetivo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [guardando, setGuardando] = useState(false);

  if (!user) return null;

const preparadorId = user.uid;

const { libros } = useTrainingBooks(preparadorId);

  const libroSeleccionado = libros.find(
    (libro) => libro.id === libroId,
  );

  async function guardarSesion() {
    if (!libroSeleccionado) {
      alert("Selecciona un libro.");
      return;
    }

    if (!objetivo.trim()) {
      alert("Escribe el objetivo de la sesión.");
      return;
    }

    try {
      setGuardando(true);

      const fechaSesion = new Date(`${fecha}T00:00:00`);

      await crearSesionPendiente({
        clienteId,
        preparadorId,

        fecha: fechaSesion,

        libroId: libroSeleccionado.id,
        libroNombre: libroSeleccionado.nombre,
        ejercicios: libroSeleccionado.ejercicios,

        objetivo: objetivo.trim(),

        observacionesPreparador:
          observaciones.trim() || undefined,
      });

      onGuardado();
    } catch (error) {
      console.error(error);
      alert("No se pudo crear la sesión.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      title="Nueva sesión"
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
            onClick={guardarSesion}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Crear sesión"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">

        <div>
          <Label>Libro de entrenamiento</Label>

          <Select
            value={libroId}
            onChange={(e) => setLibroId(e.target.value)}
          >
            <option value="">
              Seleccionar libro
            </option>

            {libros.map((libro) => (
              <option
                key={libro.id}
                value={libro.id}
              >
                {libro.nombre}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Fecha</Label>

          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div>
          <Label>Objetivo de la sesión</Label>

          <Input
            placeholder="Ej: Potencia del tren inferior"
            value={objetivo}
            onChange={(e) =>
              setObjetivo(e.target.value)
            }
          />
        </div>

        <div>
          <Label>Indicaciones</Label>

          <Textarea
            placeholder="Indicaciones para el atleta..."
            value={observaciones}
            onChange={(e) =>
              setObservaciones(e.target.value)
            }
          />
        </div>

        {libroSeleccionado && (
          <div className="
            rounded-xl
            border
            border-border
            bg-surface-soft
            p-4
          ">
            <p className="text-sm text-muted">
              Libro seleccionado
            </p>

            <p className="mt-1 font-semibold text-text">
              {libroSeleccionado.nombre}
            </p>

            <p className="mt-2 text-sm text-muted">
              Los ejercicios del libro se asignarán
              automáticamente a la sesión.
            </p>
          </div>
        )}

      </div>
    </Modal>
  );
}