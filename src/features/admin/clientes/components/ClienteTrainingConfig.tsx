import { useState } from "react";
import { actualizarFrecuenciaSemanal } from "../services/clientes.service";

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
    <section className="p-6 rounded-xl border border-white/10">
      <h2 className="text-xl font-bold mb-4">Configuración de entrenamiento</h2>

      <div className="space-y-3">
        <label className="block">Frecuencia semanal</label>

        <select
          value={frecuencia}
          onChange={(e) => setFrecuencia(Number(e.target.value))}
          className="p-3 rounded-lg bg-white/10 border border-white/20 text-white"
        >
          <option value={1}>1 día por semana</option>

          <option value={2}>2 días por semana</option>

          <option value={3}>3 días por semana</option>

          <option value={4}>4 días por semana</option>

          <option value={5}>5 días por semana</option>

          <option value={6}>6 días por semana</option>
        </select>
        <button
          type="button"
          onClick={guardarFrecuencia}
          disabled={guardando}
          className="px-4 py-2 rounded-lg"
        >
          {guardando ? "Guardando..." : "Guardar frecuencia"}
        </button>
      </div>
    </section>
  );
}

export default ClienteTrainingConfig;
