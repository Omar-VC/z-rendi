import { useState } from "react";

import type { Cuota } from "../types";
import { crearCuota } from "../services/cuotas.service";

import { Card, Input, Label, Select, Button } from "../../../../shared/ui";

interface CuotaFormProps {
  clienteId: string;
  onGuardado: () => void;
  onCancelar: () => void;
}

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function CuotaForm({
  clienteId,
  onGuardado,
  onCancelar,
}: CuotaFormProps) {
  const [form, setForm] = useState({
    mes: meses[new Date().getMonth()],
    anio: new Date().getFullYear().toString(),
    monto: "",
    fechaVencimiento: "",
  });

  const [guardando, setGuardando] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setGuardando(true);

    try {
      const nuevaCuota: Omit<Cuota, "id"> = {
        clienteId,
        mes: form.mes,
        anio: Number(form.anio),
        monto: Number(form.monto),
        estado: "pendiente",
        fechaVencimiento: form.fechaVencimiento,
      };

      await crearCuota(nuevaCuota);

      onGuardado();
    } catch (error) {
      console.error("Error creando cuota", error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Card className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>Mes</Label>

          <Select name="mes" value={form.mes} onChange={handleChange}>
            <option value="">Seleccionar mes</option>

            {meses.map((mes) => (
              <option key={mes} value={mes}>
                {mes}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Año</Label>

          <Input
            name="anio"
            type="number"
            value={form.anio}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Monto</Label>

          <Input
            name="monto"
            type="number"
            placeholder="Ej: 25000"
            value={form.monto}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Fecha de vencimiento</Label>

          <Input
            name="fechaVencimiento"
            type="date"
            value={form.fechaVencimiento}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onCancelar} type="button">
            Cancelar
          </Button>

          <Button variant="accent" type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Crear cuota"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
