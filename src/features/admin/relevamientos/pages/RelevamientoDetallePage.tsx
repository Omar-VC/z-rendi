import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Card, Button } from "../../../../shared/ui";
import { getRelevamientoById } from "../services/relevamientos.service";
import type { Relevamiento } from "../types/relevamiento";
import { exportarRelevamientoPDF } from "../services/relevamiento.pdf";

export default function RelevamientoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [relevamiento, setRelevamiento] =
    useState<Relevamiento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      if (!id) return;

      try {
        const data = await getRelevamientoById(id);
        setRelevamiento(data);
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-full bg-background p-6">
        <p className="text-sm text-muted">
          Cargando relevamiento...
        </p>
      </div>
    );
  }

  if (!relevamiento) {
    return (
      <div className="min-h-full bg-background p-6">
        <Card>
          <div className="py-10 text-center">
            <h2 className="text-lg font-bold text-text">
              Relevamiento no encontrado
            </h2>

            <Button
              className="mt-5"
              onClick={() => navigate("/relevamientos")}
            >
              Volver
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background p-4 sm:p-6 lg:p-8">
      {/* Encabezado */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/relevamientos")}
            className="mb-3 text-sm font-medium text-muted transition hover:text-text"
          >
            ← Volver a relevamientos
          </button>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Relevamiento
          </p>

          <h1 className="mt-1 text-2xl font-black text-text">
            {relevamiento.club}
          </h1>

          <p className="mt-1 text-sm text-muted">
            {relevamiento.disciplina} · {relevamiento.ciudad}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary">
            Editar
          </Button>

          <Button variant="primary" onClick={() => exportarRelevamientoPDF(relevamiento)}>
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Datos generales */}
      <Section title="Datos generales">
        <Info label="Fecha" value={formatearFecha(relevamiento.fecha)} />
        <Info label="Club" value={relevamiento.club} />
        <Info label="Disciplina" value={relevamiento.disciplina} />
        <Info label="Ciudad" value={relevamiento.ciudad} />
        <Info
          label="Contacto"
          value={relevamiento.contactoNombre}
        />
        <Info
          label="Cargo"
          value={relevamiento.contactoCargo}
        />
      </Section>

      {/* Estructura */}
      <Section title="Estructura">
        <Info
          label="Categorías"
          value={relevamiento.categorias}
        />

        <Info
          label="Cantidad de deportistas"
          value={
            relevamiento.cantidadDeportistas !== null
              ? String(relevamiento.cantidadDeportistas)
              : "Sin responder"
          }
        />
      </Section>

      {/* Situación actual */}
      <Section title="Situación actual">
        <InfoSiNo
          label="¿Cuenta con preparador físico?"
          value={relevamiento.tienePF}
        />

        {relevamiento.tienePF && (
          <InfoTexto
            label="¿Cómo se trabaja actualmente la preparación física?"
            value={relevamiento.preparacionFisicaActual}
          />
        )}

        <InfoSiNo
          label="¿Existe planificación física?"
          value={relevamiento.tienePlanificacionFisica}
        />

        <InfoSiNo
          label="¿Realizan evaluaciones físicas?"
          value={relevamiento.realizaEvaluaciones}
        />

        <InfoSiNo
          label="¿Trabajan prevención de lesiones?"
          value={relevamiento.trabajaPrevencion}
        />
      </Section>

      {/* Necesidades */}
      <Section title="Necesidades">
        <InfoTexto
          label="Necesidades detectadas por el club"
          value={relevamiento.necesidades}
        />

        <InfoSiNo
          label="¿Hay una categoría o grupo que requiera especial atención?"
          value={relevamiento.categoriaEspecialAtencion}
        />

        {relevamiento.categoriaEspecialAtencion && (
          <InfoTexto
            label="Detalle"
            value={relevamiento.categoriaEspecialAtencionDetalle}
          />
        )}

        <InfoTexto
          label="Principal problema o dificultad física"
          value={relevamiento.principalProblemaFisico}
        />
      </Section>

      {/* Recursos */}
      <Section title="Recursos y posibilidades">
        <InfoTexto
          label="Espacios y materiales disponibles"
          value={relevamiento.recursosDisponibles}
        />

        <InfoTexto
          label="Disponibilidad para trabajo físico"
          value={relevamiento.disponibilidadTrabajoFisico}
        />
      </Section>

      {/* Proyecto */}
      <Section title="Proyecto deportivo">
        <InfoTexto
          label="Objetivos deportivos"
          value={relevamiento.objetivosDeportivos}
        />

        <InfoTexto
          label="Expectativas respecto al preparador físico"
          value={relevamiento.expectativasPF}
        />
      </Section>

      {/* Análisis profesional */}
      <Section title="Análisis profesional de Z-Rendi">
        <InfoTexto
          label="Diagnóstico profesional"
          value={relevamiento.diagnostico}
        />

        <InfoTexto
          label="Necesidad principal"
          value={relevamiento.necesidadPrincipal}
        />

        <InfoTexto
          label="Propuesta"
          value={relevamiento.propuesta}
        />

        <InfoTexto
          label="Próximo paso"
          value={relevamiento.proximoPaso}
        />
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mb-5">
      <h2 className="mb-5 text-lg font-bold text-text">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {children}
      </div>
    </Card>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surfaceSoft/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>

      <p className="mt-1 text-sm text-text">
        {value || "Sin responder"}
      </p>
    </div>
  );
}

function InfoTexto({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="md:col-span-2 rounded-xl border border-border bg-surfaceSoft/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text/90">
        {value || "Sin responder"}
      </p>
    </div>
  );
}

function InfoSiNo({
  label,
  value,
}: {
  label: string;
  value: boolean | null;
}) {
  return (
    <Info
      label={label}
      value={
        value === null
          ? "Sin responder"
          : value
            ? "Sí"
            : "No"
      }
    />
  );
}

function formatearFecha(fecha: string) {
  if (!fecha) return "Sin fecha";

  return new Date(`${fecha}T12:00:00`).toLocaleDateString(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
}