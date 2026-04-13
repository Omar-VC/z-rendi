// src/components/seguimiento/AtletaForm.tsx
import React, { useEffect, useState } from "react";
import type { Atleta } from "../../types/seguimiento";


interface AtletaFormProps {
  initialData?: Atleta & { id?: string };
  onSave: (data: Atleta, id?: string) => void;
  onCancel: () => void;
}

const AtletaForm: React.FC<AtletaFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    altura: "",
    peso: "",
    deporte: "",
    posicion: "",
    lesiones: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre ?? "",
        apellido: initialData.apellido ?? "",
        fechaNacimiento: initialData.fechaNacimiento
          ? (initialData.fechaNacimiento instanceof Date
              ? initialData.fechaNacimiento.toISOString().slice(0, 10)
              : new Date(initialData.fechaNacimiento).toISOString().slice(0, 10))
          : "",
        altura: initialData.altura != null ? String(initialData.altura) : "",
        peso: initialData.peso != null ? String(initialData.peso) : "",
        deporte: initialData.deporte ?? "",
        posicion: initialData.posicion ?? "",
        lesiones: initialData.lesiones ?? "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Atleta = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim() || null,
      fechaNacimiento: formData.fechaNacimiento ? new Date(formData.fechaNacimiento) : null,
      altura: formData.altura ? Number(formData.altura) : null,
      peso: formData.peso ? Number(formData.peso) : null,
      deporte: formData.deporte || null,
      posicion: formData.posicion || null,
      lesiones: formData.lesiones || null,
      actualizado: new Date(),
    };

    if (initialData?.id) {
      onSave(payload, initialData.id);
    } else {
      onSave({ ...payload, creado: new Date() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold">{initialData ? "Editar atleta" : "Nuevo atleta"}</h2>

      <div className="grid grid-cols-2 gap-3">
        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="input" required />
        <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" className="input" />
        <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className="input" />
        <input type="number" step="0.1" name="altura" value={formData.altura} onChange={handleChange} placeholder="Altura (cm)" className="input" />
        <input type="number" step="0.1" name="peso" value={formData.peso} onChange={handleChange} placeholder="Peso (kg)" className="input" />
        <input name="deporte" value={formData.deporte} onChange={handleChange} placeholder="Deporte" className="input" />
        <input name="posicion" value={formData.posicion} onChange={handleChange} placeholder="Posición" className="input" />
        <textarea name="lesiones" value={formData.lesiones} onChange={handleChange} placeholder="Historial de lesiones" className="input" />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </div>
    </form>
  );
};

export default AtletaForm;
