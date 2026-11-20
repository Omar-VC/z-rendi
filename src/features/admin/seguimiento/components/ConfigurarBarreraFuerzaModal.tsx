import { useState } from "react";

import { useAuth } from "../../../../auth/useAuth";
import { actualizarBarrera } from "../services/barrerasService";
import { useExercises } from "../../biblioteca/ejercicios/hooks/useExercises";
import type { Barrera } from "../types/barrera";
import type { Exercise } from "../../biblioteca/ejercicios/types/exercise";
import { Button, Input, Label, Modal, Select } from "../../../../shared/ui";

type Props = {
  barrera: Barrera;
  onClose: () => void;
  onGuardado: () => void;
};

export default function ConfigurarBarreraFuerzaModal({
  barrera,
  onClose,
  onGuardado,
}: Props) {
  const { user } = useAuth();
  const [ejercicioId, setEjercicioId] = useState(barrera.ejercicioId ?? "");
  const [ejercicioSeleccionado, setEjercicioSeleccionado] =
    useState<Exercise | null>(null);
  const [peso, setPeso] = useState(
    barrera.pesoObjetivo != null ? String(barrera.pesoObjetivo) : "",
  );
  const [repeticiones, setRepeticiones] = useState(
    barrera.repeticionesObjetivo != null
      ? String(barrera.repeticionesObjetivo)
      : "",
  );
  const [guardando, setGuardando] = useState(false);
  const preparadorId = user?.uid ?? "";
  const { ejercicios, loading } = useExercises(preparadorId);

  async function guardar() {
    const pesoNumero = Number(peso);
    const repeticionesNumero = Number(repeticiones);
    const ejercicio =
      ejercicioSeleccionado ??
      ejercicios.find((item) => item.id === ejercicioId) ??
      null;

    if (
      !ejercicio ||
      !Number.isFinite(pesoNumero) ||
      pesoNumero <= 0 ||
      !Number.isInteger(repeticionesNumero) ||
      repeticionesNumero <= 0
    ) {
      alert("Selecciona un ejercicio e ingresa el peso y las repeticiones objetivo.");
      return;
    }

    try {
      setGuardando(true);
      await actualizarBarrera(barrera.id, {
        ejercicioId: ejercicio.id,
        ejercicioNombre: ejercicio.nombre,
        pesoObjetivo: pesoNumero,
        repeticionesObjetivo: repeticionesNumero,
        unidad: "kg",
        objetivo: `${pesoNumero} kg × ${repeticionesNumero} repeticiones`,
      });
      onGuardado();
    } catch (error) {
      console.error(error);
      alert("No se pudo configurar la automatización de esta barrera.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      title="Activar barrera automática de fuerza"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={guardando}>
            Cancelar
          </Button>
          <Button variant="accent" onClick={guardar} disabled={guardando || loading}>
            {guardando ? "Guardando..." : "Guardar objetivo"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-left">
        <p className="text-xs text-muted">
          Se conservará el historial de esta barrera. Al alcanzar el nuevo objetivo,
          se marcará como superada y se generará el siguiente con un 10% más.
        </p>
        <div className="space-y-1.5">
          <Label>Ejercicio</Label>
          <Select
            value={ejercicioId}
            disabled={loading || guardando}
            onChange={(event) => {
              const id = event.target.value;
              setEjercicioId(id);
              setEjercicioSeleccionado(
                ejercicios.find((item) => item.id === id) ?? null,
              );
            }}
          >
            <option value="">{loading ? "Cargando ejercicios..." : "— Seleccionar ejercicio —"}</option>
            {ejercicios.map((ejercicio) => (
              <option key={ejercicio.id} value={ejercicio.id}>
                {ejercicio.nombre}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Peso objetivo (kg)</Label>
            <Input
              type="number"
              min="0.5"
              step="0.5"
              value={peso}
              onChange={(event) => setPeso(event.target.value)}
              disabled={guardando}
              placeholder="Ej: 70"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Repeticiones mínimas</Label>
            <Input
              type="number"
              min="1"
              step="1"
              value={repeticiones}
              onChange={(event) => setRepeticiones(event.target.value)}
              disabled={guardando}
              placeholder="Ej: 2"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
