import { useState } from "react";

import type { FichaCliente } from "../types";
import { guardarFichaCliente } from "../services/ficha.service";

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
    <section className="p-6 rounded-xl border border-white/10">
      <h2 className="text-xl font-bold mb-6">
        {ficha ? "Editar ficha" : "Crear ficha"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Datos personales</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
            />

            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
            />

            <input
              name="edad"
              type="number"
              value={form.edad}
              onChange={handleChange}
              placeholder="Edad"
              className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
            />

            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Datos físicos</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="peso"
              type="number"
              value={form.peso}
              onChange={handleChange}
              placeholder="Peso (kg)"
              className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
            />

            <input
              name="altura"
              type="number"
              value={form.altura}
              onChange={handleChange}
              placeholder="Altura (cm)"
              className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Datos deportivos</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="deporte"
              value={form.deporte}
              onChange={handleChange}
              placeholder="Deporte"
              className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
            />

            <input
              name="puesto"
              value={form.puesto}
              onChange={handleChange}
              placeholder="Puesto"
              className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
            />

            <input
              name="nivel"
              value={form.nivel}
              onChange={handleChange}
              placeholder="Nivel"
              className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
            />

            <input
              name="experiencia"
              value={form.experiencia}
              onChange={handleChange}
              placeholder="Experiencia"
              className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Objetivos</h3>

          <textarea
            name="objetivoPrincipal"
            value={form.objetivoPrincipal}
            onChange={handleChange}
            placeholder="Objetivo principal"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        <div>
          <h3 className="font-semibold mb-3">Salud</h3>

          <textarea
            name="lesiones"
            value={form.lesiones}
            onChange={handleChange}
            placeholder="Lesiones"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        <div>
          <h3 className="font-semibold mb-3">Observaciones</h3>

          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            placeholder="Observaciones"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={guardando}
            className="px-4 py-2 rounded-lg"
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>

          <button
            type="button"
            onClick={onCancelar}
            disabled={guardando}
            className="px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}

export default FichaForm;