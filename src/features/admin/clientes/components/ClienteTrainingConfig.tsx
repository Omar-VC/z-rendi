import { useState } from "react";

import { actualizarFrecuenciaSemanal } from "../services/clientes.service";

import {
  Card,
  Button,
  Select,
  SectionTitle,
} from "../../../../shared/ui";

interface ClienteTrainingConfigProps {
  clienteId: string;
  frecuenciaSemanal?: number;
  onGuardado?: (frecuencia: number) => void;
}

function ClienteTrainingConfig({
  clienteId,
  frecuenciaSemanal,
  onGuardado,
}: ClienteTrainingConfigProps) {
  const [frecuencia, setFrecuencia] = useState(
    frecuenciaSemanal ?? 3,
  );

  const [guardando, setGuardando] = useState(false);

  const [editando, setEditando] = useState(
    frecuenciaSemanal === undefined,
  );

  const guardarFrecuencia = async () => {
    try {
      setGuardando(true);

      await actualizarFrecuenciaSemanal(
        clienteId,
        frecuencia,
      );

      setEditando(false);
      onGuardado?.(frecuencia);
    } catch (error) {
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  if (!editando) {
    return (
      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted">
              Configuración de entrenamiento
            </p>

            <p className="mt-1 font-semibold text-text">
              {frecuencia}{" "}
              {frecuencia === 1
                ? "día por semana"
                : "días por semana"}
            </p>
          </div>

          <Button
            variant="secondary"
            className="!h-9 !px-3 !py-1 text-sm"
            onClick={() => setEditando(true)}
          >
            Cambiar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionTitle
        title="Configuración de entrenamiento"
        description="Definí la frecuencia semanal utilizada para calcular la asistencia."
      />

      <div
        className="
          mt-6
          grid
          gap-5
          md:grid-cols-[1fr_auto]
          md:items-end
        "
      >
        <Select
          label="Frecuencia semanal"
          value={frecuencia}
          onChange={(e) =>
            setFrecuencia(Number(e.target.value))
          }
        >
          <option value={1}>1 día por semana</option>
          <option value={2}>2 días por semana</option>
          <option value={3}>3 días por semana</option>
          <option value={4}>4 días por semana</option>
          <option value={5}>5 días por semana</option>
          <option value={6}>6 días por semana</option>
        </Select>

        <Button
          variant="accent"
          onClick={guardarFrecuencia}
          disabled={guardando}
        >
          {guardando ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </Card>
  );
}

export default ClienteTrainingConfig;