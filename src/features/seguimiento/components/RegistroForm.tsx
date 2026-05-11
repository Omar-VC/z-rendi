// src/components/seguimiento/RegistroForm.tsx
import React, { useEffect, useState } from "react";

import type { Registro, Atleta } from "../types";
import { formatDateInput } from "../../../utils/date";
interface RegistroFormProps {
  atletas?: Atleta[];
  onSave: (data: Registro, id?: string) => void;
  onCancel: () => void;
  initialData?: Registro & { id?: string };
}

const RegistroForm: React.FC<RegistroFormProps> = ({
  atletas = [],
  onSave,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    atletaId: "",
    tipo: "diario",
    fecha: "",
    estadoAnimo: "",
    rpe: "",
    duracion: "",
    carga: "",
    fuerzaPress: "",
    fuerzaSentadillas: "",
    saltoHorizontal: "",
    velocidadDistancia: "",
    velocidadTiempo: "",
    resistenciaAerobica: "",
    resistenciaAnaerobica: "",
    broncoTest: "",
    observaciones: "",
  });

  

  useEffect(() => {
    if (initialData) {
      setFormData({
        atletaId: initialData.atletaId ?? "",
        tipo: initialData.tipo ?? "diario",
        fecha: formatDateInput(initialData.fecha),
        estadoAnimo:
          initialData.estadoAnimo != null
            ? String(initialData.estadoAnimo)
            : "",
        rpe: initialData.rpe != null ? String(initialData.rpe) : "",
        duracion:
          initialData.duracion != null ? String(initialData.duracion) : "",
        carga: initialData.carga != null ? String(initialData.carga) : "",
        fuerzaPress:
          initialData.fuerzaPress != null
            ? String(initialData.fuerzaPress)
            : "",
        fuerzaSentadillas:
          initialData.fuerzaSentadillas != null
            ? String(initialData.fuerzaSentadillas)
            : "",
        saltoHorizontal:
          initialData.saltoHorizontal != null
            ? String(initialData.saltoHorizontal)
            : "",
        velocidadDistancia:
          initialData.velocidadDistancia != null
            ? String(initialData.velocidadDistancia)
            : "",
        velocidadTiempo:
          initialData.velocidadTiempo != null
            ? String(initialData.velocidadTiempo)
            : "",
        resistenciaAerobica:
          initialData.resistenciaAerobica != null
            ? String(initialData.resistenciaAerobica)
            : "",
        resistenciaAnaerobica:
          initialData.resistenciaAnaerobica != null
            ? String(initialData.resistenciaAnaerobica)
            : "",
        broncoTest:
          initialData.broncoTest != null ? String(initialData.broncoTest) : "",
        observaciones: initialData.observaciones ?? "",
      });
    } else {
      setFormData((s) => ({
        ...s,
        fecha: formatDateInput(new Date()),
      }));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Registro = {
      atletaId: formData.atletaId,
      tipo: formData.tipo as Registro["tipo"],
      fecha: formData.fecha ? new Date(formData.fecha) : new Date(),
      estadoAnimo: formData.estadoAnimo ? Number(formData.estadoAnimo) : null,
      rpe: formData.rpe ? Number(formData.rpe) : null,
      duracion: formData.duracion ? Number(formData.duracion) : null,
      carga: formData.carga ? Number(formData.carga) : null,
      fuerzaPress: formData.fuerzaPress ? Number(formData.fuerzaPress) : null,
      fuerzaSentadillas: formData.fuerzaSentadillas
        ? Number(formData.fuerzaSentadillas)
        : null,
      saltoHorizontal: formData.saltoHorizontal
        ? Number(formData.saltoHorizontal)
        : null,
      velocidadDistancia: formData.velocidadDistancia
        ? Number(formData.velocidadDistancia)
        : null,
      velocidadTiempo: formData.velocidadTiempo
        ? Number(formData.velocidadTiempo)
        : null,
      resistenciaAerobica: formData.resistenciaAerobica
        ? Number(formData.resistenciaAerobica)
        : null,
      resistenciaAnaerobica: formData.resistenciaAnaerobica
        ? Number(formData.resistenciaAnaerobica)
        : null,
      broncoTest: formData.broncoTest ? Number(formData.broncoTest) : null,
      observaciones: formData.observaciones || null,
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
      <h2 className="text-lg font-semibold">
        {initialData ? "Editar registro" : "Nuevo registro"}
      </h2>

      <select
        name="atletaId"
        value={formData.atletaId}
        onChange={handleChange}
        className="input"
        required
      >
        <option value="">Seleccionar atleta</option>
        {atletas.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nombre} {a.apellido || ""}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-3">
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          className="input"
        >
          <option value="diario">Control diario</option>
          <option value="test">Test físico</option>
          <option value="observacion">Observación</option>
        </select>

        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          className="input"
        />
      </div>

      {formData.tipo === "diario" && (
        <div className="grid grid-cols-4 gap-3">
          <input
            type="number"
            min="1"
            max="5"
            name="estadoAnimo"
            value={formData.estadoAnimo}
            onChange={handleChange}
            placeholder="Estado ánimo (1-5)"
            className="input"
          />
          <input
            type="number"
            min="0"
            max="10"
            name="rpe"
            value={formData.rpe}
            onChange={handleChange}
            placeholder="RPE (0-10)"
            className="input"
          />
          <input
            type="number"
            name="duracion"
            value={formData.duracion}
            onChange={handleChange}
            placeholder="Duración (min)"
            className="input"
          />
          <input
            type="number"
            value={
              formData.rpe && formData.duracion
                ? Number(formData.rpe) * Number(formData.duracion)
                : ""
            }
            placeholder="Carga (automática)"
            className="input"
            disabled
          />
        </div>
      )}

      {formData.tipo === "test" && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              name="fuerzaPress"
              value={formData.fuerzaPress}
              onChange={handleChange}
              placeholder="Press (kg)"
              className="input"
            />
            <input
              type="number"
              name="fuerzaSentadillas"
              value={formData.fuerzaSentadillas}
              onChange={handleChange}
              placeholder="Sentadilla (kg)"
              className="input"
            />
            <input
              type="number"
              name="saltoHorizontal"
              value={formData.saltoHorizontal}
              onChange={handleChange}
              placeholder="Salto horizontal (cm)"
              className="input"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              name="velocidadDistancia"
              value={formData.velocidadDistancia}
              onChange={handleChange}
              placeholder="Velocidad - distancia (m)"
              className="input"
            />
            <input
              type="number"
              name="velocidadTiempo"
              value={formData.velocidadTiempo}
              onChange={handleChange}
              placeholder="Velocidad - tiempo (s)"
              className="input"
            />
            <input
              type="number"
              name="broncoTest"
              value={formData.broncoTest}
              onChange={handleChange}
              placeholder="Bronco test (opcional)"
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="resistenciaAerobica"
              value={formData.resistenciaAerobica}
              onChange={handleChange}
              placeholder="Resistencia aeróbica"
              className="input"
            />
            <input
              type="number"
              name="resistenciaAnaerobica"
              value={formData.resistenciaAnaerobica}
              onChange={handleChange}
              placeholder="Resistencia anaeróbica"
              className="input"
            />
          </div>
        </>
      )}

      {formData.tipo === "observacion" && (
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          placeholder="Observaciones del entrenador"
          className="input"
        />
      )}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </div>
    </form>
  );
};

export default RegistroForm;
