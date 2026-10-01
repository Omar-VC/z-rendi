export type EstadoRelevamiento = "borrador" | "completado";

export interface Relevamiento {
  id: string;
  preparadorId: string;

  // Datos generales
  fecha: string;
  club: string;
  disciplina: string;
  ciudad: string;
  contactoNombre: string;
  contactoCargo: string;

  // 1. Estructura
  categorias: string;
  cantidadDeportistas: number | null;

  // 2. Situación actual
  tienePF: boolean | null;
  preparacionFisicaActual: string;
  tienePlanificacionFisica: boolean | null;
  realizaEvaluaciones: boolean | null;
  trabajaPrevencion: boolean | null;

  // 3. Necesidades
  necesidades: string;
  categoriaEspecialAtencion: boolean | null;
  categoriaEspecialAtencionDetalle: string;
  principalProblemaFisico: string;

  // 4. Recursos y posibilidades
  recursosDisponibles: string;
  disponibilidadTrabajoFisico: string;

  // 5. Proyecto
  objetivosDeportivos: string;
  expectativasPF: string;

  // Diagnóstico profesional
  diagnostico: string;
  necesidadPrincipal: string;
  propuesta: string;
  proximoPaso: string;

  // Estado
  estado: EstadoRelevamiento;
}