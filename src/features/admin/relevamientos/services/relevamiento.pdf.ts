import jsPDF from "jspdf";

import type { Relevamiento } from "../types/relevamiento";

export function exportarRelevamientoPDF(
  relevamiento: Relevamiento,
) {
  const pdf = new jsPDF();

  const margen = 20;
  const anchoPagina = pdf.internal.pageSize.getWidth();
  const altoPagina = pdf.internal.pageSize.getHeight();

  let y = 20;

  function verificarPagina(alturaNecesaria = 10) {
    if (y + alturaNecesaria > altoPagina - 20) {
      pdf.addPage();
      y = 20;
    }
  }

  function titulo(texto: string) {
    verificarPagina(15);

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text(texto, margen, y);

    y += 10;
  }

  function campo(label: string, valor: string) {
    verificarPagina(18);

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text(label, margen, y);

    y += 5;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    const lineas = pdf.splitTextToSize(
      valor || "Sin responder",
      anchoPagina - margen * 2,
    );

    pdf.text(lineas, margen, y);

    y += lineas.length * 5 + 6;
  }

  // Encabezado
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.text("Z-RENDI", margen, y);

  y += 10;

  pdf.setFontSize(18);
  pdf.text("Relevamiento profesional", margen, y);

  y += 8;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `${relevamiento.club || "Club sin nombre"} · ${
      relevamiento.disciplina || "Sin disciplina"
    }`,
    margen,
    y,
  );

  y += 12;

  // Datos generales
  titulo("1. Datos generales");

  campo("Fecha", formatearFecha(relevamiento.fecha));
  campo("Club", relevamiento.club);
  campo("Disciplina", relevamiento.disciplina);
  campo("Ciudad", relevamiento.ciudad);
  campo("Contacto", relevamiento.contactoNombre);
  campo("Cargo", relevamiento.contactoCargo);

  // Estructura
  titulo("2. Estructura");

  campo("Categorías", relevamiento.categorias);

  campo(
    "Cantidad aproximada de deportistas",
    relevamiento.cantidadDeportistas !== null
      ? String(relevamiento.cantidadDeportistas)
      : "Sin responder",
  );

  // Situación actual
  titulo("3. Situación actual");

  campo(
    "¿Cuenta con preparador físico?",
    respuestaSiNo(relevamiento.tienePF),
  );

  campo(
    "Preparación física actual",
    relevamiento.preparacionFisicaActual,
  );

  campo(
    "¿Existe planificación física?",
    respuestaSiNo(relevamiento.tienePlanificacionFisica),
  );

  campo(
    "¿Realizan evaluaciones físicas?",
    respuestaSiNo(relevamiento.realizaEvaluaciones),
  );

  campo(
    "¿Trabajan prevención de lesiones?",
    respuestaSiNo(relevamiento.trabajaPrevencion),
  );

  // Necesidades
  titulo("4. Necesidades");

  campo(
    "Necesidades manifestadas",
    relevamiento.necesidades,
  );

  campo(
    "¿Existe una categoría o grupo que requiera atención?",
    respuestaSiNo(relevamiento.categoriaEspecialAtencion),
  );

  campo(
    "Detalle de atención especial",
    relevamiento.categoriaEspecialAtencionDetalle,
  );

  campo(
    "Principal problema físico",
    relevamiento.principalProblemaFisico,
  );

  // Recursos
  titulo("5. Recursos y posibilidades");

  campo(
    "Espacios y materiales disponibles",
    relevamiento.recursosDisponibles,
  );

  campo(
    "Disponibilidad para trabajo físico",
    relevamiento.disponibilidadTrabajoFisico,
  );

  // Proyecto
  titulo("6. Proyecto deportivo");

  campo(
    "Objetivos deportivos",
    relevamiento.objetivosDeportivos,
  );

  campo(
    "Expectativas respecto al preparador físico",
    relevamiento.expectativasPF,
  );

  // Análisis profesional
  titulo("7. Análisis profesional de Z-Rendi");

  campo(
    "Diagnóstico profesional",
    relevamiento.diagnostico,
  );

  campo(
    "Necesidad principal",
    relevamiento.necesidadPrincipal,
  );

  campo(
    "Propuesta",
    relevamiento.propuesta,
  );

  campo(
    "Próximo paso",
    relevamiento.proximoPaso,
  );

  // Pie de página
  const paginas = pdf.getNumberOfPages();

  for (let pagina = 1; pagina <= paginas; pagina++) {
    pdf.setPage(pagina);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");

    pdf.text(
      `Z-Rendi · Relevamiento profesional · Página ${pagina} de ${paginas}`,
      margen,
      altoPagina - 10,
    );
  }

  const nombreClub =
    relevamiento.club
      ?.trim()
      .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, "")
      .replace(/\s+/g, "_") || "Club";

  pdf.save(`Relevamiento_${nombreClub}.pdf`);
}

function respuestaSiNo(
  valor: boolean | null,
) {
  if (valor === null) return "Sin responder";

  return valor ? "Sí" : "No";
}

function formatearFecha(fecha: string) {
  if (!fecha) return "Sin fecha";

  return new Date(`${fecha}T12:00:00`).toLocaleDateString(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );
}