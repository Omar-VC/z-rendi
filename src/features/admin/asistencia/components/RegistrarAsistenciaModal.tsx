import { useState } from "react";

import type { Cliente } from "../../clientes/types";
import type { EstadoAsistencia } from "../types/asistencia.types";
import { guardarAsistencia } from "../services/asistenciaService";

interface RegistrarAsistenciaModalProps {
  cliente: Cliente;
  onCerrar: () => void;
  onGuardado?: () => void;
}

function RegistrarAsistenciaModal({
  cliente,
  onCerrar,
  onGuardado,
}: RegistrarAsistenciaModalProps) {
  const [fecha, setFecha] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [estado, setEstado] = useState<EstadoAsistencia | null>(null);
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    if (!estado) return;

    try {
      setGuardando(true);

      await guardarAsistencia(
        cliente.id,
        fecha,
        estado,
        cliente.frecuenciaSemanal ?? 0
      );

      onGuardado?.();
      onCerrar();
    } catch (error) {
      console.error("Error al guardar asistencia:", error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="mt-4 p-4 rounded-lg border border-white/10">
      <h4 className="font-semibold">
        Registrar asistencia
      </h4>

      <p className="mt-1 opacity-70">
        {cliente.nombre} {cliente.apellido}
      </p>

      <input
        type="date"
        value={fecha}
        onChange={(event) => setFecha(event.target.value)}
        className="mt-4 p-3 rounded-lg bg-white/10 border border-white/20"
      />

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => setEstado("presente")}
          className={`px-4 py-2 rounded-lg ${
            estado === "presente"
              ? "bg-green-600"
              : "bg-white/10"
          }`}
        >
          Presente
        </button>

        <button
          type="button"
          onClick={() => setEstado("falta")}
          className={`px-4 py-2 rounded-lg ${
            estado === "falta"
              ? "bg-red-600"
              : "bg-white/10"
          }`}
        >
          Falta
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={handleGuardar}
          disabled={!estado || guardando}
          className="px-4 py-2 rounded-lg"
        >
          {guardando ? "Guardando..." : "Guardar"}
        </button>

        <button
          type="button"
          onClick={onCerrar}
          disabled={guardando}
          className="px-4 py-2 rounded-lg"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default RegistrarAsistenciaModal;