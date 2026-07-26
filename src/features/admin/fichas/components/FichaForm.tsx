import { useState } from "react";

import type { FichaCliente } from "../types";
import { guardarFichaCliente } from "../services/ficha.service";
import {
  Card,
  Input,
  Textarea,
  Button,
} from "../../../../shared/ui";

interface FichaFormProps {
  clienteId: string;
  ficha: FichaCliente | null;
  onGuardado: () => void;
  onCancelar: () => void;
}

function FichaForm({
  clienteId,
  ficha,
  onGuardado,
  onCancelar,
}: FichaFormProps) {
  const [form, setForm] = useState({
    nombre: ficha?.nombre ?? "",
    apellido: ficha?.apellido ?? "",
    edad: ficha?.edad?.toString() ?? "",
    telefono: ficha?.telefono ?? "",
    peso: ficha?.peso?.toString() ?? "",
    altura: ficha?.altura?.toString() ?? "",
    deporte: ficha?.deporte ?? "",
    puesto: ficha?.puesto ?? "",
    nivel: ficha?.nivel ?? "",
    experiencia: ficha?.experiencia ?? "",
    objetivoPrincipal: ficha?.objetivoPrincipal ?? "",
    lesiones: ficha?.lesiones ?? "",
    observaciones: ficha?.observaciones ?? "",
  });

  const [guardando, setGuardando] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setGuardando(true);

    try {
      const fichaParaGuardar: FichaCliente = {
        id: ficha?.id ?? "",
        clienteId,
        nombre: form.nombre,
        apellido: form.apellido,
        edad: form.edad ? Number(form.edad) : undefined,
        telefono: form.telefono,
        peso: form.peso ? Number(form.peso) : undefined,
        altura: form.altura ? Number(form.altura) : undefined,
        deporte: form.deporte,
        puesto: form.puesto,
        nivel: form.nivel,
        experiencia: form.experiencia,
        objetivoPrincipal: form.objetivoPrincipal,
        lesiones: form.lesiones,
        observaciones: form.observaciones,
      };

      await guardarFichaCliente(clienteId, fichaParaGuardar);

      onGuardado();
    } catch (error) {
      console.error("Error al guardar la ficha:", error);
    } finally {
      setGuardando(false);
    }
  };

  return (
  <Card>

    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >

      <div>

        <h2 className="text-2xl font-bold">
          {ficha ? "Editar ficha" : "Crear ficha"}
        </h2>

        <p className="text-muted mt-1">
          Información general y deportiva del atleta.
        </p>

      </div>


      <div>

        <h3 className="text-lg font-semibold mb-4">
          Datos personales
        </h3>

        <div className="grid gap-4 md:grid-cols-2">

          <Input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
          />

          <Input
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            placeholder="Apellido"
          />

          <Input
            name="edad"
            type="number"
            value={form.edad}
            onChange={handleChange}
            placeholder="Edad"
          />

          <Input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
          />

        </div>

      </div>


      <div>

        <h3 className="text-lg font-semibold mb-4">
          Datos físicos
        </h3>

        <div className="grid gap-4 md:grid-cols-2">

          <Input
            name="peso"
            type="number"
            value={form.peso}
            onChange={handleChange}
            placeholder="Peso (kg)"
          />

          <Input
            name="altura"
            type="number"
            value={form.altura}
            onChange={handleChange}
            placeholder="Altura (cm)"
          />

        </div>

      </div>


      <div>

        <h3 className="text-lg font-semibold mb-4">
          Datos deportivos
        </h3>

        <div className="grid gap-4 md:grid-cols-2">

          <Input
            name="deporte"
            value={form.deporte}
            onChange={handleChange}
            placeholder="Deporte"
          />

          <Input
            name="puesto"
            value={form.puesto}
            onChange={handleChange}
            placeholder="Puesto"
          />

          <Input
            name="nivel"
            value={form.nivel}
            onChange={handleChange}
            placeholder="Nivel"
          />

          <Input
            name="experiencia"
            value={form.experiencia}
            onChange={handleChange}
            placeholder="Experiencia"
          />

        </div>

      </div>


      <div>

        <h3 className="text-lg font-semibold mb-4">
          Objetivos
        </h3>

        <Textarea
          name="objetivoPrincipal"
          value={form.objetivoPrincipal}
          onChange={handleChange}
          placeholder="Objetivo principal"
        />

      </div>


      <div>

        <h3 className="text-lg font-semibold mb-4">
          Salud
        </h3>

        <Textarea
          name="lesiones"
          value={form.lesiones}
          onChange={handleChange}
          placeholder="Lesiones o antecedentes importantes"
        />

      </div>


      <div>

        <h3 className="text-lg font-semibold mb-4">
          Observaciones
        </h3>

        <Textarea
          name="observaciones"
          value={form.observaciones}
          onChange={handleChange}
          placeholder="Observaciones generales"
        />

      </div>


      <div className="flex justify-end gap-3 pt-2">

        <Button
          variant="secondary"
          type="button"
          onClick={onCancelar}
          disabled={guardando}
        >
          Cancelar
        </Button>


        <Button
          variant="accent"
          type="submit"
          disabled={guardando}
        >
          {guardando
            ? "Guardando..."
            : "Guardar"}
        </Button>

      </div>


    </form>

  </Card>
);
}

export default FichaForm;