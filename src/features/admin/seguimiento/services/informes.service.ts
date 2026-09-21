import { obtenerAsistenciaMensual } from "../../asistencia/services/asistenciaService";
import { obtenerBarreras } from "./barrerasService"; // Ambas están en seguimiento/services/
import type { Barrera } from "../types/barrera";

export type ResumenAtleta = {
  clienteId: string;
  nombre: string;
  asistencias: {
    completadasMes: number;     // Días con estado "presente"
    diasHabilesMes: number;     // Total días de Lunes a Viernes del mes actual
    porcentajeMes: number;      // % de cumplimiento
  };
  barreras: {
    nombre: string;             // Ej: Press Plano
    objetivo: string;           // Ej: "70"
    resultado: string;          // Ej: "60" o "En progreso"
    estado: string;             // "pendiente" | "superada"
    unidad: string;             // "kg"
    categoria?: string;
  }[];
};

/**
 * Calcula los días hábiles (Lunes a Viernes) del mes actual.
 */
function contarDiasHabilesMesActual(): number {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = ahora.getMonth();
  const totalDias = new Date(año, mes + 1, 0).getDate();
  let diasHabiles = 0;

  for (let dia = 1; dia <= totalDias; dia++) {
    const fecha = new Date(año, mes, dia);
    const diaSemana = fecha.getDay(); // 0 = Domingo, 6 = Sábado
    if (diaSemana !== 0 && diaSemana !== 6) {
      diasHabiles++;
    }
  }
  return diasHabiles;
}

export async function obtenerResumenAtletas(
  atletas: { id: string; nombre: string }[]
): Promise<ResumenAtleta[]> {
  try {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = ahora.getMonth();

    // Rango del mes en formato YYYY-MM-DD para asistencia
    const inicioMes = new Date(año, mes, 1).toISOString().split("T")[0];
    const finMes = new Date(año, mes + 1, 0).toISOString().split("T")[0];

    // Días hábiles Lunes-Viernes del mes en curso
    const diasHabilesMes = contarDiasHabilesMesActual();

    // Procesamos en paralelo para cada atleta pasando su clienteId de Firestore
    const resultados = await Promise.all(
      atletas.map(async (atleta) => {
        // 1. Asistencias
        const registrosAsistencia = await obtenerAsistenciaMensual(
          atleta.id,
          inicioMes,
          finMes
        );

        const presentes = registrosAsistencia.filter(
          (reg: any) => reg.estado === "presente"
        ).length;

        const porcentaje = Math.round((presentes / diasHabilesMes) * 100);

        // 2. Barreras de progreso guardadas en la colección "barrerasProgreso"
        const listaBarreras: Barrera[] = await obtenerBarreras(atleta.id);

        const barrerasMapeadas = listaBarreras.map((b: any) => {
          // Si b.resultado está vacío, intentamos obtener la última marca cargada en el historial
          let resultadoActual = b.resultado;
          if ((!resultadoActual || resultadoActual === "") && b.historial && b.historial.length > 0) {
            resultadoActual = b.historial[b.historial.length - 1].resultado;
          }

          return {
            nombre: b.nombre,
            objetivo: b.objetivo,
            resultado: resultadoActual && resultadoActual !== "" ? resultadoActual : "En progreso",
            estado: b.estado,
            unidad: b.unidad || "kg",
            categoria: b.categoria,
          };
        });

        return {
          clienteId: atleta.id,
          nombre: atleta.nombre,
          asistencias: {
            completadasMes: presentes,
            diasHabilesMes: diasHabilesMes,
            porcentajeMes: Math.min(porcentaje, 100),
          },
          barreras: barrerasMapeadas,
        };
      })
    );

    return resultados;
  } catch (error) {
    console.error("Error al obtener resumen de atletas:", error);
    return [];
  }
}

export function generarTextoWhatsApp(resumenes: ResumenAtleta[]): string {
  const mesNombre = new Date().toLocaleString("es-AR", { month: "long" }).toUpperCase();

  let mensaje = `📊 *INFORME GENERAL DE ATLETAS (${mesNombre})*\n`;
  mensaje += `-----------------------------------\n\n`;

  resumenes.forEach((atleta) => {
    mensaje += `👤 *${atleta.nombre.toUpperCase()}*\n`;
    mensaje += `🏋️ Asistencia: ${atleta.asistencias.completadasMes}/${atleta.asistencias.diasHabilesMes} días hábiles (${atleta.asistencias.porcentajeMes}%)\n`;

    if (atleta.barreras.length > 0) {
      mensaje += `🚀 *Seguimiento de Barreras:*\n`;
      atleta.barreras.forEach((b) => {
        const icono = b.estado === "superada" ? "✅" : "🎯";
        const resTexto = b.resultado !== "En progreso" ? ` | Actual: ${b.resultado} ${b.unidad}` : "";
        mensaje += `   ${icono} ${b.nombre}: Obj ${b.objetivo} ${b.unidad}${resTexto}\n`;
      });
    } else {
      mensaje += `   • Sin barreras registradas.\n`;
    }
    mensaje += `\n`;
  });

  mensaje += `💪 *Z-RENDI Performance*`;
  return mensaje;
}