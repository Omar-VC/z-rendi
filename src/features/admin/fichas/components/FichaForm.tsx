// src/features/admin/fichas/components/FichaForm.tsx
import React, { useState } from "react";
import type { FichaCliente } from "../types";
import { guardarFichaCliente } from "../services/ficha.service";
import { Card, Input, Textarea, Button, Label } from "../../../../shared/ui";

interface FichaFormProps {
  clienteId: string;
  ficha: FichaCliente | null;
  onGuardado: () => void;
  onCancelar?: () => void;
}

export default function FichaForm({ clienteId, ficha, onGuardado, onCancelar }: FichaFormProps) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const fichaParaGuardar: Partial<FichaCliente> = {
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
    <Card className="bg-surfaceSoft/40 border border-border/50 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-border/30 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-accent rounded-full inline-block"></span>
            {ficha ? "Editar Ficha Técnica" : "Crear Ficha Técnica"}
          </h2>
          <p className="text-xs text-muted font-medium mt-0.5">
            Información biomecánica, perfil deportivo y salud del atleta.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos Personales */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold tracking-wider text-muted uppercase">Datos Personales</span>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs mb-1">Nombre</Label>
              <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej. Juan" />
            </div>
            <div>
              <Label className="text-xs mb-1">Apellido</Label>
              <Input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Ej. Pérez" />
            </div>
            <div>
              <Label className="text-xs mb-1">Edad</Label>
              <Input name="edad" type="number" className="font-mono" value={form.edad} onChange={handleChange} placeholder="Ej. 24" />
            </div>
            <div>
              <Label className="text-xs mb-1">Teléfono</Label>
              <Input name="telefono" value={form.telefono} onChange={handleChange} placeholder="+54 9..." />
            </div>
          </div>
        </div>

        {/* Datos Físicos */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold tracking-wider text-muted uppercase">Antropometría Básica</span>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs mb-1">Peso (kg)</Label>
              <Input name="peso" type="number" step="0.1" className="font-mono" value={form.peso} onChange={handleChange} placeholder="75.5" />
            </div>
            <div>
              <Label className="text-xs mb-1">Altura (cm)</Label>
              <Input name="altura" type="number" className="font-mono" value={form.altura} onChange={handleChange} placeholder="178" />
            </div>
          </div>
        </div>

        {/* Datos Deportivos */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold tracking-wider text-muted uppercase">Perfil Deportivo</span>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs mb-1">Deporte</Label>
              <Input name="deporte" value={form.deporte} onChange={handleChange} placeholder="Ej. Fútbol / Atletismo" />
            </div>
            <div>
              <Label className="text-xs mb-1">Puesto / Posición</Label>
              <Input name="puesto" value={form.puesto} onChange={handleChange} placeholder="Ej. Mediocampista" />
            </div>
            <div>
              <Label className="text-xs mb-1">Nivel</Label>
              <Input name="nivel" value={form.nivel} onChange={handleChange} placeholder="Ej. Amateur / Semi-pro" />
            </div>
            <div>
              <Label className="text-xs mb-1">Experiencia</Label>
              <Input name="experiencia" value={form.experiencia} onChange={handleChange} placeholder="Ej. 3 años entrenando" />
            </div>
          </div>
        </div>

        {/* Salud y Objetivos */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold tracking-wider text-muted uppercase">Salud & Objetivos</span>
          <div className="space-y-3">
            <div>
              <Label className="text-xs mb-1">Objetivo Principal</Label>
              <Textarea name="objetivoPrincipal" rows={2} value={form.objetivoPrincipal} onChange={handleChange} placeholder="Describir objetivo clave..." />
            </div>
            <div>
              <Label className="text-xs mb-1">Lesiones o Antecedentes</Label>
              <Textarea name="lesiones" rows={2} value={form.lesiones} onChange={handleChange} placeholder="Molestias actuales, cirugías, patologías..." />
            </div>
            <div>
              <Label className="text-xs mb-1">Observaciones del Entrenador / Atleta</Label>
              <Textarea name="observaciones" rows={2} value={form.observaciones} onChange={handleChange} placeholder="Notas extra..." />
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-2 pt-3 border-t border-border/30">
          {onCancelar && (
            <Button
              variant="secondary"
              type="button"
              onClick={onCancelar}
              disabled={guardando}
              className="!min-h-0 h-8 !px-3 text-xs"
            >
              Cancelar
            </Button>
          )}
          <Button
            variant="accent"
            type="submit"
            disabled={guardando}
            className="!min-h-0 h-8 !px-3 text-xs shadow-[0_0_12px_rgba(255,85,0,0.25)]"
          >
            {guardando ? "Guardando..." : "Guardar Ficha"}
          </Button>
        </div>
      </form>
    </Card>
  );
}