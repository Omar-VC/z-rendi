import { useState } from "react";

import { actualizarFrecuenciaSemanal } from "../services/clientes.service";

import { Card, Button, Select, SectionTitle } from "../../../../shared/ui";

interface ClienteTrainingConfigProps {
  clienteId: string;
  frecuenciaSemanal?: number;
}

function ClienteTrainingConfig({
  clienteId,
  frecuenciaSemanal,
}: ClienteTrainingConfigProps) {
  const [frecuencia, setFrecuencia] = useState(frecuenciaSemanal ?? 3);
  const [guardando, setGuardando] = useState(false);

  const guardarFrecuencia = async () => {
    try {
      setGuardando(true);

      await actualizarFrecuenciaSemanal(clienteId, frecuencia);
    } catch (error) {
      console.error("Error guardando frecuencia:", error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    
    <Card>

      <SectionTitle
        title="Configuración de entrenamiento"
        description="Definí la frecuencia semanal utilizada para calcular la asistencia."
      />

      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-600">
            Frecuencia semanal
          </label>

          <Select
            value={frecuencia}
            onChange={(e) => setFrecuencia(Number(e.target.value))}
          >
            <option value={1}>1 día por semana</option>
            <option value={2}>2 días por semana</option>
            <option value={3}>3 días por semana</option>
            <option value={4}>4 días por semana</option>
            <option value={5}>5 días por semana</option>
            <option value={6}>6 días por semana</option>
          </Select>
        </div>

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
