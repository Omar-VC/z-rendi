import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
  type Unsubscribe,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../../../firebase/firebase";
import type { SesionPendiente } from "../types/sesionPendiente";
import type { EjercicioRealizado } from "../types/registroEjercicio";
import {
  crearRegistrosEjercicio,
  normalizarEjerciciosRealizados,
} from "./registrosEjercicio.service";

const SESIONES_COLLECTION = "sesionesPendientes";

type CrearSesionPendiente = Omit<
  SesionPendiente,
  "id" | "createdAt" | "estado"
>;

export async function crearSesionPendiente(
  payload: CrearSesionPendiente,
): Promise<void> {
  await addDoc(collection(db, SESIONES_COLLECTION), {
    ...payload,
    estado: "pendiente",
    createdAt: new Date(),
  });
}

export function suscribirseSesionesPendientes(
  clienteId: string,
  preparadorId: string,
  onChange: (sesiones: SesionPendiente[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, SESIONES_COLLECTION),
    where("clienteId", "==", clienteId),
    where("preparadorId", "==", preparadorId),
    where("estado", "==", "pendiente"),
  );

  return onSnapshot(q, (snapshot) => {
    const sesiones: SesionPendiente[] = snapshot.docs.map((documento) => {
      const data = documento.data();

      return {
        id: documento.id,

        clienteId: data.clienteId,
        preparadorId: data.preparadorId,

        fecha: data.fecha?.toDate?.() ?? new Date(data.fecha),

        estado: data.estado,

        libroId: data.libroId,
        libroNombre: data.libroNombre,

        gruposMusculares: data.gruposMusculares ?? [],
        bloques: data.bloques ?? [],

        objetivo: data.objetivo,

        observacionesPreparador: data.observacionesPreparador,

        duracion: data.duracion,
        rpe: data.rpe,
        carga: data.carga,

        observacionesCliente: data.observacionesCliente,

        createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
      };
    });

    onChange(sesiones);
  });
}

export async function obtenerSesionPendiente(
  id: string,
): Promise<SesionPendiente | null> {
  const referencia = doc(db, SESIONES_COLLECTION, id);

  const snapshot = await getDoc(referencia);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,

    clienteId: data.clienteId,
    preparadorId: data.preparadorId,

    fecha: data.fecha?.toDate?.() ?? new Date(data.fecha),

    estado: data.estado,

    libroId: data.libroId,
    libroNombre: data.libroNombre,

    gruposMusculares: data.gruposMusculares ?? [],
    bloques: data.bloques ?? [],

    objetivo: data.objetivo,

    observacionesPreparador: data.observacionesPreparador,

    duracion: data.duracion,
    rpe: data.rpe,
    carga: data.carga,

    observacionesCliente: data.observacionesCliente,

    createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
  };
}

export async function completarSesionPendiente(
  id: string,
  datos: {
    duracion: number;
    rpe: number;
    carga: number;
    observacionesCliente?: string;
    ejerciciosRealizados?: EjercicioRealizado[];
    duracionPlanificada?: number;
  },
): Promise<void> {
  const referenciaPendiente = doc(db, SESIONES_COLLECTION, id);

  const snapshot = await getDoc(referenciaPendiente);

  if (!snapshot.exists()) {
    throw new Error("La sesión pendiente no existe.");
  }

  const data = snapshot.data();
  const fecha = data.fecha?.toDate?.() ?? new Date(data.fecha);

  const bloques: Array<{
    duracion?: number;
    ejercicios?: Array<{ ejercicioId: string }>;
  }> = Array.isArray(data.bloques) ? data.bloques : [];

  const duracionPlanificada =
    datos.duracionPlanificada ??
    bloques.reduce((acc, b) => acc + (b.duracion || 0), 0);

  const ejerciciosRealizados = normalizarEjerciciosRealizados(
    datos.ejerciciosRealizados ?? [],
  );

  const batch = writeBatch(db);

  // 1. Doc en sesiones con el MISMO ID de la pendiente (lo exige la regla de create)
  batch.set(doc(db, "sesiones", id), {
    id,
    clienteId: data.clienteId,
    preparadorId: data.preparadorId,

    fecha,
    mes: fecha.getMonth() + 1,
    anio: fecha.getFullYear(),

    libroId: data.libroId ?? "",
    libroNombre: data.libroNombre ?? "",
    gruposMusculares: data.gruposMusculares ?? [],

    // Snapshot de lo asignado (lo usa la clonación de sesiones)
    bloques,
    objetivo: data.objetivo ?? "",
    observacionesPreparador: data.observacionesPreparador ?? "",
    ejercicios: bloques.flatMap((b) =>
      (b.ejercicios ?? []).map((e) => e.ejercicioId),
    ),

    // Lo que el atleta informó
    duracion: datos.duracion,
    rpe: datos.rpe,
    carga: datos.carga,
    observaciones:
      datos.observacionesCliente || data.observacionesPreparador || "",
    observacionesCliente: datos.observacionesCliente ?? "",

    // Lo que realmente hizo
    bloquesRealizados: ejerciciosRealizados,
    sesionPendienteId: id,
    duracionPlanificada,
    barrerasFuerzaProcesadas: false,

    createdAt: new Date(),
  });

  // 2. Registros por ejercicio (solo series válidas)
  crearRegistrosEjercicio(
    batch,
    id,
    data.clienteId,
    data.preparadorId,
    ejerciciosRealizados,
  );

  // 3. Borrar la pendiente
  batch.delete(referenciaPendiente);

  await batch.commit();
}

export async function eliminarSesionPendiente(id: string): Promise<void> {
  await deleteDoc(doc(db, SESIONES_COLLECTION, id));
}

export function suscribirseSesionesPendientesCliente(
  clienteId: string,
  onChange: (sesiones: SesionPendiente[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, SESIONES_COLLECTION),
    where("clienteId", "==", clienteId),
    where("estado", "==", "pendiente"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const sesiones: SesionPendiente[] = snapshot.docs.map((documento) => {
        const data = documento.data();

        return {
          id: documento.id,
          clienteId: data.clienteId,
          preparadorId: data.preparadorId,

          fecha: data.fecha?.toDate?.() ?? new Date(data.fecha),

          estado: data.estado,

          libroId: data.libroId,
          libroNombre: data.libroNombre,

          gruposMusculares: data.gruposMusculares ?? [],
          bloques: data.bloques ?? [],

          objetivo: data.objetivo,

          observacionesPreparador: data.observacionesPreparador,

          duracion: data.duracion,
          rpe: data.rpe,
          carga: data.carga,

          observacionesCliente: data.observacionesCliente,

          createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
        };
      });

      onChange(sesiones);
    },
    (error) => {
      console.error("Error al suscribirse a sesiones pendientes:", error);

      onError?.(error);
    },
  );
}


export async function obtenerUltimasSesionesCliente(
  clienteId: string,
  limite: number = 5
): Promise<SesionPendiente[]> {
  try {
    // Busca en la colección de sesiones completadas
    const qCompletadas = query(
      collection(db, "sesiones"),
      where("clienteId", "==", clienteId),
      orderBy("fecha", "desc"),
      limit(limite)
    );

    const snapshot = await getDocs(qCompletadas);

    return snapshot.docs.map((documento) => {
      const data = documento.data();
      return {
        id: documento.id,
        clienteId: data.clienteId,
        preparadorId: data.preparadorId,
        fecha: data.fecha?.toDate?.() ?? new Date(data.fecha),
        estado: "completada",
        libroId: data.libroId,
        libroNombre: data.libroNombre,
        gruposMusculares: data.gruposMusculares ?? [],
        bloques: data.bloques ?? [],
        objetivo: data.objetivo ?? "",
        observacionesPreparador: data.observacionesPreparador,
        duracion: data.duracion,
        rpe: data.rpe,
        carga: data.carga,
        observacionesCliente: data.observacionesCliente,
        createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
      };
    });
  } catch (error) {
    console.error("Error al obtener últimas sesiones:", error);
    return [];
  }
}
