import { useState, type FormEvent } from "react";

import type { Relevamiento } from "../types/relevamiento";

import { Card, Input, Label, Button } from "../../../../shared/ui";

interface Props {
  onGuardar: (
    datos: Omit<Relevamiento, "id" | "preparadorId">,
  ) => Promise<void>;
  onCancelar: () => void;
}

const inputClassName =
  "!bg-[#1F2937] !text-white placeholder:!text-gray-400";

export default function NuevoRelevamientoForm({
  onGuardar,
  onCancelar,
}: Props) {
  const [formulario, setFormulario] = useState<
    Omit<Relevamiento, "id" | "preparadorId">
  >({
    fecha: new Date().toISOString().split("T")[0],
    club: "",
    disciplina: "",
    ciudad: "",
    contactoNombre: "",
    contactoCargo: "",
    categorias: "",
    cantidadDeportistas: null,
    tienePF: null,
    preparacionFisicaActual: "",
    tienePlanificacionFisica: null,
    realizaEvaluaciones: null,
    trabajaPrevencion: null,
    necesidades: "",
    categoriaEspecialAtencion: null,
    categoriaEspecialAtencionDetalle: "",
    principalProblemaFisico: "",
    recursosDisponibles: "",
    disponibilidadTrabajoFisico: "",
    objetivosDeportivos: "",
    expectativasPF: "",
    diagnostico: "",
    necesidadPrincipal: "",
    propuesta: "",
    proximoPaso: "",
    estado: "borrador",
  });

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarCampo = <
    K extends keyof typeof formulario
  >(
    campo: K,
    valor: (typeof formulario)[K],
  ) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const manejarSubmit = async (
    evento: FormEvent<HTMLFormElement>,
  ) => {
    evento.preventDefault();
    setError(null);
    setGuardando(true);

    try {
      await onGuardar(formulario);
    } catch (error) {
      console.error("Error guardando relevamiento:", error);
      setError("No se pudo guardar el relevamiento.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={manejarSubmit} className="space-y-5">
      {/* ENCABEZADO */}
      <Card>
        <div>
          <h1 className="text-2xl font-bold text-text">
            Nuevo relevamiento
          </h1>

          <p className="mt-1 text-sm text-muted">
            Registrá la situación actual del club, sus necesidades
            y las expectativas respecto al trabajo de preparación física.
          </p>
        </div>
      </Card>

      {/* DATOS GENERALES */}
      <Card>
        <SectionTitle
          title="Datos generales"
          description="Información básica del club y de la persona entrevistada."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Club"
            placeholder="Nombre del club"
            value={formulario.club}
            onChange={(e) =>
              actualizarCampo("club", e.target.value)
            }
            className={inputClassName}
            required
          />

          <Input
            label="Deporte / disciplina"
            placeholder="Ej: Rugby, fútbol, vóley"
            value={formulario.disciplina}
            onChange={(e) =>
              actualizarCampo("disciplina", e.target.value)
            }
            className={inputClassName}
          />

          <Input
            label="Ciudad"
            placeholder="Ciudad"
            value={formulario.ciudad}
            onChange={(e) =>
              actualizarCampo("ciudad", e.target.value)
            }
            className={inputClassName}
          />

          <Input
            label="Fecha"
            type="date"
            value={formulario.fecha}
            onChange={(e) =>
              actualizarCampo("fecha", e.target.value)
            }
            className={`${inputClassName} [color-scheme:dark]`}
          />

          <Input
            label="Nombre del contacto"
            placeholder="Nombre y apellido"
            value={formulario.contactoNombre}
            onChange={(e) =>
              actualizarCampo(
                "contactoNombre",
                e.target.value,
              )
            }
            className={inputClassName}
          />

          <Input
            label="Cargo / función"
            placeholder="Ej: Presidente, entrenador, coordinador"
            value={formulario.contactoCargo}
            onChange={(e) =>
              actualizarCampo(
                "contactoCargo",
                e.target.value,
              )
            }
            className={inputClassName}
          />
        </div>
      </Card>

      {/* ESTRUCTURA */}
      <Card>
        <SectionTitle
          title="Estructura"
          description="Conocé cómo está compuesto actualmente el club."
        />

        <div className="space-y-4">
          <TextAreaField
            label="Deportes y categorías"
            placeholder="¿Qué deportes y categorías tiene actualmente el club?"
            value={formulario.categorias}
            onChange={(e) =>
              actualizarCampo("categorias", e.target.value)
            }
          />

          <Input
            label="Cantidad aproximada de deportistas"
            type="number"
            min="0"
            placeholder="Ej: 120"
            value={formulario.cantidadDeportistas ?? ""}
            onChange={(e) =>
              actualizarCampo(
                "cantidadDeportistas",
                e.target.value === ""
                  ? null
                  : Number(e.target.value),
              )
            }
            className={inputClassName}
          />
        </div>
      </Card>

      {/* SITUACIÓN ACTUAL */}
      <Card>
        <SectionTitle
          title="Situación actual"
          description="Cómo se desarrolla actualmente la preparación física."
        />

        <div className="space-y-5">
          <PreguntaSiNo
            pregunta="¿Actualmente cuentan con preparador físico?"
            valor={formulario.tienePF}
            onChange={(valor) =>
              actualizarCampo("tienePF", valor)
            }
          />

          {formulario.tienePF === true && (
            <TextAreaField
              label="Trabajo de preparación física actual"
              placeholder="¿Cómo se trabaja actualmente la preparación física?"
              value={formulario.preparacionFisicaActual}
              onChange={(e) =>
                actualizarCampo(
                  "preparacionFisicaActual",
                  e.target.value,
                )
              }
            />
          )}

          <PreguntaSiNo
            pregunta="¿Existe una planificación física organizada durante la temporada?"
            valor={formulario.tienePlanificacionFisica}
            onChange={(valor) =>
              actualizarCampo(
                "tienePlanificacionFisica",
                valor,
              )
            }
          />

          <PreguntaSiNo
            pregunta="¿Realizan evaluaciones físicas y registran sus resultados?"
            valor={formulario.realizaEvaluaciones}
            onChange={(valor) =>
              actualizarCampo(
                "realizaEvaluaciones",
                valor,
              )
            }
          />

          <PreguntaSiNo
            pregunta="¿Trabajan específicamente en prevención de lesiones?"
            valor={formulario.trabajaPrevencion}
            onChange={(valor) =>
              actualizarCampo(
                "trabajaPrevencion",
                valor,
              )
            }
          />
        </div>
      </Card>

      {/* NECESIDADES */}
      <Card>
        <SectionTitle
          title="Necesidades"
          description="Detectá dónde está hoy la principal necesidad del club."
        />

        <div className="space-y-5">
          <TextAreaField
            label="Necesidades percibidas"
            placeholder="¿Qué consideran que necesitan mejorar actualmente en sus deportistas?"
            value={formulario.necesidades}
            onChange={(e) =>
              actualizarCampo("necesidades", e.target.value)
            }
          />

          <PreguntaSiNo
            pregunta="¿Hay alguna categoría, equipo o grupo que requiera especial atención?"
            valor={formulario.categoriaEspecialAtencion}
            onChange={(valor) =>
              actualizarCampo(
                "categoriaEspecialAtencion",
                valor,
              )
            }
          />

          {formulario.categoriaEspecialAtencion === true && (
            <TextAreaField
              label="Detalle"
              placeholder="¿Cuál y por qué?"
              value={
                formulario.categoriaEspecialAtencionDetalle
              }
              onChange={(e) =>
                actualizarCampo(
                  "categoriaEspecialAtencionDetalle",
                  e.target.value,
                )
              }
            />
          )}

          <TextAreaField
            label="Principal problema físico"
            placeholder="¿Cuál es hoy el principal problema o dificultad en el desarrollo físico de los deportistas?"
            value={formulario.principalProblemaFisico}
            onChange={(e) =>
              actualizarCampo(
                "principalProblemaFisico",
                e.target.value,
              )
            }
          />
        </div>
      </Card>

      {/* RECURSOS */}
      <Card>
        <SectionTitle
          title="Recursos y posibilidades"
          description="Qué recursos existen y qué posibilidades reales de trabajo hay."
        />

        <div className="space-y-4">
          <TextAreaField
            label="Espacios y materiales"
            placeholder="¿Qué espacios y materiales tienen disponibles para el trabajo físico?"
            value={formulario.recursosDisponibles}
            onChange={(e) =>
              actualizarCampo(
                "recursosDisponibles",
                e.target.value,
              )
            }
          />

          <TextAreaField
            label="Disponibilidad para trabajo físico"
            placeholder="¿Qué disponibilidad tienen para incorporar trabajo físico específico?"
            value={formulario.disponibilidadTrabajoFisico}
            onChange={(e) =>
              actualizarCampo(
                "disponibilidadTrabajoFisico",
                e.target.value,
              )
            }
          />
        </div>
      </Card>

      {/* PROYECTO */}
      <Card>
        <SectionTitle
          title="Proyecto deportivo"
          description="Objetivos del club y expectativas sobre el preparador físico."
        />

        <div className="space-y-4">
          <TextAreaField
            label="Objetivos deportivos"
            placeholder="¿Cuáles son los principales objetivos deportivos del club para esta temporada?"
            value={formulario.objetivosDeportivos}
            onChange={(e) =>
              actualizarCampo(
                "objetivosDeportivos",
                e.target.value,
              )
            }
          />

          <TextAreaField
            label="Expectativas sobre el preparador físico"
            placeholder="¿Qué esperan concretamente de un preparador físico?"
            value={formulario.expectativasPF}
            onChange={(e) =>
              actualizarCampo(
                "expectativasPF",
                e.target.value,
              )
            }
          />
        </div>
      </Card>

      {/* ANÁLISIS PROFESIONAL */}
      <Card className="border-primary/20">
        <SectionTitle
          title="Análisis profesional"
          description="Completá esta sección después de la conversación."
        />

        <div className="space-y-4">
          <TextAreaField
            label="Diagnóstico profesional"
            placeholder="¿Cuál es tu lectura profesional de la situación actual?"
            value={formulario.diagnostico}
            onChange={(e) =>
              actualizarCampo("diagnostico", e.target.value)
            }
          />

          <TextAreaField
            label="Necesidad principal"
            placeholder="¿Cuál considerás que es la necesidad principal?"
            value={formulario.necesidadPrincipal}
            onChange={(e) =>
              actualizarCampo(
                "necesidadPrincipal",
                e.target.value,
              )
            }
          />

          <TextAreaField
            label="Propuesta"
            placeholder="¿Qué propuesta de trabajo realizarías?"
            value={formulario.propuesta}
            onChange={(e) =>
              actualizarCampo("propuesta", e.target.value)
            }
          />

          <TextAreaField
            label="Próximo paso"
            placeholder="¿Cuál sería el siguiente paso después de esta reunión?"
            value={formulario.proximoPaso}
            onChange={(e) =>
              actualizarCampo(
                "proximoPaso",
                e.target.value,
              )
            }
          />
        </div>
      </Card>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-danger-border bg-danger-bg px-4 py-3 text-sm text-danger-text">
          {error}
        </div>
      )}

      {/* ACCIONES */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
          isLoading={guardando}
        >
          Guardar relevamiento
        </Button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENTES AUXILIARES                                                     */
/* -------------------------------------------------------------------------- */

interface SectionTitleProps {
  title: string;
  description: string;
}

function SectionTitle({
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="mb-5 border-b border-border pb-4">
      <h2 className="text-lg font-bold text-text">
        {title}
      </h2>

      <p className="mt-1 text-sm text-muted">
        {description}
      </p>
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
}

function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
}: TextAreaFieldProps) {
  return (
    <div className="w-full space-y-1.5">
      <Label>{label}</Label>

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="
          w-full
          min-h-[110px]
          resize-y
          rounded-button
          border
          border-border
          bg-[#1F2937]
          px-4
          py-3
          text-sm
          text-white
          placeholder:text-gray-400
          transition
          duration-150
          ease-in-out
          focus:border-accent
          focus:outline-none
          focus:ring-2
          focus:ring-primary/20
        "
      />
    </div>
  );
}

interface PreguntaSiNoProps {
  pregunta: string;
  valor: boolean | null;
  onChange: (valor: boolean) => void;
}

function PreguntaSiNo({
  pregunta,
  valor,
  onChange,
}: PreguntaSiNoProps) {
  return (
    <div className="space-y-2">
      <Label>{pregunta}</Label>

      <div className="grid grid-cols-2 gap-2 rounded-button border border-border bg-[#111827] p-1">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`
            h-10
            rounded-lg
            text-sm
            font-semibold
            transition-all
            ${
              valor === true
                ? "border border-success-border bg-success-bg text-success-text"
                : "text-muted hover:bg-white/[0.05] hover:text-text"
            }
          `}
        >
          Sí
        </button>

        <button
          type="button"
          onClick={() => onChange(false)}
          className={`
            h-10
            rounded-lg
            text-sm
            font-semibold
            transition-all
            ${
              valor === false
                ? "border border-white/20 bg-white/[0.08] text-text"
                : "text-muted hover:bg-white/[0.05] hover:text-text"
            }
          `}
        >
          No
        </button>
      </div>
    </div>
  );
}