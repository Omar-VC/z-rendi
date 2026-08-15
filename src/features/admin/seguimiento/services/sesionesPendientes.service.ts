import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  deleteDoc,
  query,
  where,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "../../../../firebase/firebase";

import type { SesionPendiente } from "../types/sesionPendiente";

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
  },
): Promise<void> {
  const referencia = doc(db, SESIONES_COLLECTION, id);

  const snapshot = await getDoc(referencia);

  if (!snapshot.exists()) {
    throw new Error("La sesión pendiente no existe.");
  }

  const data = snapshot.data();

  await setDoc(doc(db, "sesiones", id), {
    clienteId: data.clienteId,
    preparadorId: data.preparadorId,

    fecha: data.fecha,

    mes: data.fecha?.toDate
      ? data.fecha.toDate().getMonth() + 1
      : new Date(data.fecha).getMonth() + 1,

    anio: data.fecha?.toDate
      ? data.fecha.toDate().getFullYear()
      : new Date(data.fecha).getFullYear(),

    libroId: data.libroId,
    libroNombre: data.libroNombre,

    gruposMusculares: data.gruposMusculares ?? [],
    bloques: data.bloques ?? [],

    objetivo: data.objetivo,

    observacionesPreparador: data.observacionesPreparador ?? "",

    duracion: datos.duracion,
    rpe: datos.rpe,
    carga: datos.carga,

    observacionesCliente: datos.observacionesCliente ?? "",

    createdAt: new Date(),
  });

  await deleteDoc(referencia);
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
