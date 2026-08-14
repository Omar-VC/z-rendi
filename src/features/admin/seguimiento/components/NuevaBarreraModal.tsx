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

  const [pruebaSeleccionada, setPruebaSeleccionada] =
    useState<PhysicalTest | null>(null);

  const [objetivo, setObjetivo] = useState("");

  if (!user) return null;

  const preparadorId = user.uid;

  const { pruebas } = usePhysicalTests({
    preparadorId,
  });

  async function guardarBarrera() {

    if (!pruebaSeleccionada || !objetivo) {

      alert(
        "Selecciona una prueba y completa el objetivo."
      );

      return;

    }

    await crearBarrera({

      clienteId,

      preparadorId,

      pruebaId: pruebaSeleccionada.id,

      nombre: pruebaSeleccionada.nombre,

      categoria: pruebaSeleccionada.categoria,

      subcategoria:
        pruebaSeleccionada.subcategoria,

      unidad: pruebaSeleccionada.unidad,

      objetivo,

      estado: "pendiente",

      resultado: "",

    });

    onGuardado();

  }

  return (

    <Modal
      title="Nueva barrera"
      onClose={onClose}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            variant="accent"
            onClick={guardarBarrera}
          >
            Guardar
          </Button>
        </>
      }
    >

      <div className="space-y-5">

        <div>

          <Label>
            Prueba física
          </Label>

          <Select
            value={pruebaId}
            onChange={(e) => {

              const prueba =
                pruebas.find(
                  (p) =>
                    p.id ===
                    e.target.value,
                );

              setPruebaId(
                e.target.value,
              );

              setPruebaSeleccionada(
                prueba ?? null,
              );

            }}
          >

            <option value="">
              Seleccionar prueba
            </option>

            {pruebas.map((prueba) => (

              <option
                key={prueba.id}
                value={prueba.id}
              >
                {prueba.nombre}
              </option>

            ))}

          </Select>

        </div>


        {pruebaSeleccionada && (

          <Card className="bg-slate-50">

            <p className="text-sm text-slate-500">
              Categoría
            </p>

            <p className="font-semibold">
              {pruebaSeleccionada.categoria}
            </p>

            {pruebaSeleccionada.unidad && (

              <>
                <p className="mt-3 text-sm text-slate-500">
                  Unidad
                </p>

                <p className="font-semibold">
                  {pruebaSeleccionada.unidad}
                </p>
              </>

            )}

          </Card>

        )}


        <div>

          <Label>
            Objetivo
          </Label>

          <Input
            value={objetivo}
            onChange={(e) =>
              setObjetivo(
                e.target.value,
              )
            }
            placeholder="Ej: 100 kg"
          />

        </div>

      </div>

    </Modal>

  );

}