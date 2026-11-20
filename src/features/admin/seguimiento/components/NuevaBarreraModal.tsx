import { useState } from "react";

import { useAuth } from "../../../../auth/useAuth";
import { crearBarrera } from "../services/barrerasService";
import { usePhysicalTests } from "../../biblioteca/pruebas/hooks/usePhysicalTests";
import { useExercises } from "../../biblioteca/ejercicios/hooks/useExercises";

import type { PhysicalTest } from "../../biblioteca/pruebas/types/physicalTest";
import type { Exercise } from "../../biblioteca/ejercicios/types/exercise";
import type { Barrera } from "../types/barrera";

import {
  Modal,
  Select,
  Input,
  Button,
  Label,
  Card,
  Badge,
} from "../../../../shared/ui";

type Props = {
  clienteId: string;
  onClose: () => void;
  onGuardado: () => void;
};

export default function NuevaBarreraModal({
  clienteId,
  onClose,
  onGuardado,
}: Props) {
  const { user } = useAuth();

  const [pruebaId, setPruebaId] = useState("");
  const [pruebaSeleccionada, setPruebaSeleccionada] = useState<PhysicalTest | null>(null);
  const [objetivo, setObjetivo] = useState("");
  const [ejercicioId, setEjercicioId] = useState("");
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState<Exercise | null>(null);
  const [pesoObjetivo, setPesoObjetivo] = useState("");
  const [repeticionesObjetivo, setRepeticionesObjetivo] = useState("");
  const [guardando, setGuardando] = useState(false);

  const preparadorId = user?.uid ?? "";

  const { pruebas, loading: cargandoPruebas } = usePhysicalTests({
    preparadorId,
  });
  const { ejercicios, loading: cargandoEjercicios } = useExercises(preparadorId);
  const esFuerza = pruebaSeleccionada?.categoria === "Fuerza";

  if (!user) return null;

  async function guardarBarrera() {
    const peso = Number(pesoObjetivo);
    const repeticiones = Number(repeticionesObjetivo);
    if (
      !pruebaSeleccionada ||
      (esFuerza && (!ejercicioSeleccionado || !Number.isInteger(peso) || peso < 5 || peso % 5 !== 0 || !Number.isInteger(repeticiones) || repeticiones <= 0)) ||
      (!esFuerza && !objetivo.trim())
    ) {
      alert(esFuerza
        ? "Selecciona un ejercicio, un peso entero en múltiplos de 5 kg y las repeticiones objetivo."
        : "Selecciona una prueba física e ingresa una meta u objetivo válido.");
      return;
    }

    try {
      setGuardando(true);
      const datosBarrera: Omit<Barrera, "id"> = {
        clienteId,
        preparadorId,
        pruebaId: pruebaSeleccionada.id,
        nombre: pruebaSeleccionada.nombre,
        categoria: pruebaSeleccionada.categoria,
        subcategoria: pruebaSeleccionada.subcategoria,
        unidad: pruebaSeleccionada.unidad,
        objetivo: esFuerza
          ? `${peso} kg × ${repeticiones} repeticiones`
          : objetivo.trim(),
        estado: "pendiente",
        resultado: "",
      };
      await crearBarrera(esFuerza
        ? {
            ...datosBarrera,
            ejercicioId: ejercicioSeleccionado!.id,
            ejercicioNombre: ejercicioSeleccionado!.nombre,
            pesoObjetivo: peso,
            repeticionesObjetivo: repeticiones,
          }
        : datosBarrera);

      onGuardado();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al intentar crear la barrera.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      title="Nueva Barrera de Progreso"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            variant="secondary"
            className="!min-h-0 h-8 !px-3 text-xs font-semibold"
            onClick={onClose}
            disabled={guardando}
          >
            Cancelar
          </Button>

          <Button
            variant="accent"
            className="!min-h-0 h-8 !px-4 text-xs font-bold shadow-[0_0_12px_rgba(255,85,0,0.25)]"
            onClick={guardarBarrera}
            disabled={guardando || cargandoPruebas}
          >
            {guardando ? "Guardando..." : "Crear Barrera"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-left">
        {/* SELECCIÓN DE PRUEBA FÍSICA */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-text">
            Prueba Física Evaluativa
          </Label>

          <Select
            value={pruebaId}
            disabled={cargandoPruebas || guardando}
            className="w-full bg-surfaceSoft border-border/50 text-xs font-medium focus:border-primary focus:ring-1 focus:ring-primary/40 rounded-lg"
            onChange={(e) => {
              const selectedId = e.target.value;
              const prueba = pruebas.find((p) => p.id === selectedId);

              setPruebaId(selectedId);
              setPruebaSeleccionada(prueba ?? null);
              setEjercicioId("");
              setEjercicioSeleccionado(null);
            }}
          >
            <option value="">
              {cargandoPruebas
                ? "Cargando catálogo de pruebas..."
                : "— Seleccionar prueba de la biblioteca —"}
            </option>

            {pruebas.map((prueba) => (
              <option key={prueba.id} value={prueba.id}>
                {prueba.nombre} {prueba.categoria ? `(${prueba.categoria})` : ""}
              </option>
            ))}
          </Select>
        </div>

        {/* DETALLE PREVIO DE LA PRUEBA SELECCIONADA */}
        {pruebaSeleccionada && (
          <Card className="!p-3 bg-surfaceSoft/50 border-border/40 rounded-lg space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                Parámetros de Evaluación
              </span>
              {pruebaSeleccionada.unidad && (
                <Badge variant="neutral" className="text-[10px] px-2 py-0.5 font-mono font-semibold">
                  Unidad: {pruebaSeleccionada.unidad}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              {pruebaSeleccionada.categoria && (
                <p className="text-text/90 font-medium">
                  <strong className="text-muted font-normal">Categoría:</strong>{" "}
                  {pruebaSeleccionada.categoria}
                </p>
              )}
              {pruebaSeleccionada.subcategoria && (
                <p className="text-text/90 font-medium">
                  <strong className="text-muted font-normal">Subcategoría:</strong>{" "}
                  {pruebaSeleccionada.subcategoria}
                </p>
              )}
            </div>
          </Card>
        )}

        {esFuerza && (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-text">Ejercicio asociado</Label>
              <Select
                value={ejercicioId}
                disabled={cargandoEjercicios || guardando}
                onChange={(e) => {
                  const id = e.target.value;
                  setEjercicioId(id);
                  setEjercicioSeleccionado(ejercicios.find((ejercicio) => ejercicio.id === id) ?? null);
                }}
                className="w-full bg-surfaceSoft border-border/50 text-xs font-medium rounded-lg"
              >
                <option value="">{cargandoEjercicios ? "Cargando ejercicios..." : "— Seleccionar ejercicio —"}</option>
                {ejercicios.map((ejercicio) => (
                  <option key={ejercicio.id} value={ejercicio.id}>{ejercicio.nombre}</option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-text">Peso objetivo (kg)</Label>
                <Input type="number" min="5" step="5" value={pesoObjetivo} onChange={(e) => setPesoObjetivo(e.target.value)} disabled={guardando} placeholder="Ej: 70" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-text">Repeticiones mínimas</Label>
                <Input type="number" min="1" step="1" value={repeticionesObjetivo} onChange={(e) => setRepeticionesObjetivo(e.target.value)} disabled={guardando} placeholder="Ej: 2" />
              </div>
            </div>
            <p className="text-[11px] text-muted">Al alcanzar la meta, se creará otra con al menos 10% más, redondeada al siguiente múltiplo de 5 kg.</p>
          </>
        )}

        {/* CAMPO DE OBJETIVO / META para pruebas manuales */}
        {!esFuerza && <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-text">
              Objetivo / Marca a Alcanzar
            </Label>
            {pruebaSeleccionada?.unidad && (
              <span className="text-[10px] font-mono text-muted">
                Ejemplo en {pruebaSeleccionada.unidad}
              </span>
            )}
          </div>

          <Input
            value={objetivo}
            disabled={guardando}
            onChange={(e) => setObjetivo(e.target.value)}
            placeholder={
              pruebaSeleccionada?.unidad
                ? `Ej: 100 ${pruebaSeleccionada.unidad}`
                : "Ej: Superar 100 kg o completar bajo 5 mins"
            }
            className="bg-surfaceSoft border-border/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary/40 rounded-lg"
          />
        </div>}
      </div>
    </Modal>
  );
}
