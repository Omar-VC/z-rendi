import { useState } from "react";

import { useAuth } from "../../../../auth/useAuth";
import { crearBarrera } from "../services/barrerasService";
import { usePhysicalTests } from "../../biblioteca/pruebas/hooks/usePhysicalTests";

import type { PhysicalTest } from "../../biblioteca/pruebas/types/physicalTest";

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
  const [guardando, setGuardando] = useState(false);

  if (!user) return null;

  const preparadorId = user.uid;

  const { pruebas, loading: cargandoPruebas } = usePhysicalTests({
    preparadorId,
  });

  async function guardarBarrera() {
    if (!pruebaSeleccionada || !objetivo.trim()) {
      alert("Selecciona una prueba física e ingresa una meta u objetivo válido.");
      return;
    }

    try {
      setGuardando(true);
      await crearBarrera({
        clienteId,
        preparadorId,
        pruebaId: pruebaSeleccionada.id,
        nombre: pruebaSeleccionada.nombre,
        categoria: pruebaSeleccionada.categoria,
        subcategoria: pruebaSeleccionada.subcategoria,
        unidad: pruebaSeleccionada.unidad,
        objetivo: objetivo.trim(),
        estado: "pendiente",
        resultado: "",
      });

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

        {/* CAMPO DE OBJETIVO / META */}
        <div className="space-y-1.5">
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
        </div>
      </div>
    </Modal>
  );
}