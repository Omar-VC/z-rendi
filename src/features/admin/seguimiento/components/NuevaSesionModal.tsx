import { useMemo, useState } from "react";

import { useAuth } from "../../../../auth/useAuth";

import { useTrainingBooks } from "../../biblioteca/hooks/useTrainingBooks";
import { useSeguimiento } from "../hooks/useSeguimiento";

import {
  Modal,
  Input,
  Select,
  Textarea,
  Button,
  Card,
  Label,
} from "../../../../shared/ui";

type Props = {
  clienteId: string;
  onClose: () => void;
  onGuardado: () => void;
};

export default function NuevaSesionModal({
  clienteId,
  onClose,
  onGuardado,
}: Props) {
  const { user } = useAuth();

  if (!user) return null;

  const preparadorId = user.uid;

  const { libros } = useTrainingBooks(preparadorId);

  const { agregarSesion } = useSeguimiento(clienteId);

  const [libroId, setLibroId] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [duracion, setDuracion] = useState(60);
  const [rpe, setRpe] = useState(5);
  const [observaciones, setObservaciones] = useState("");

  const carga = useMemo(() => {
    return duracion * rpe;
  }, [duracion, rpe]);

  async function guardarSesion() {
    const libro = libros.find((l) => l.id === libroId);

    if (!libro) {
      alert("Selecciona un libro.");
      return;
    }

    const fechaSesion = new Date(fecha);

    await agregarSesion({
      clienteId,
      preparadorId,

      fecha: fechaSesion,
      mes: fechaSesion.getMonth() + 1,
      anio: fechaSesion.getFullYear(),

      libroId: libro.id,
      libroNombre: libro.nombre,

      duracion,
      rpe,
      carga,
      observaciones,
    });
    onGuardado();
  }

  return (
    <Modal
      title="Nueva sesión"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>

          <Button variant="accent" onClick={guardarSesion}>
            Guardar
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <Label>Libro de entrenamiento</Label>

          <Select value={libroId} onChange={(e) => setLibroId(e.target.value)}>
            <option value="">Seleccionar libro</option>

            {libros.map((libro) => (
              <option key={libro.id} value={libro.id}>
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
          <Label>Duración (minutos)</Label>

          <Input
            type="number"
            placeholder="Ej: 60"
            value={duracion}
            onChange={(e) => setDuracion(Number(e.target.value))}
          />
        </div>

        <div>
          <Label>RPE (1 a 10)</Label>

          <Input
            type="number"
            min={1}
            max={10}
            placeholder="Ej: 5"
            value={rpe}
            onChange={(e) => setRpe(Number(e.target.value))}
          />
        </div>

        <Card className="bg-slate-50">
          <p className="text-sm text-slate-500">Carga de entrenamiento</p>

          <p className="mt-1 text-3xl font-bold text-accent">{carga}</p>

          <p className="text-xs text-slate-500">Duración × RPE</p>
        </Card>

        <div>
          <Label>Observaciones</Label>

          <Textarea
            placeholder="Escriba alguna observación de la sesión..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
