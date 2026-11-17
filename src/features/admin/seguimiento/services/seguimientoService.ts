import {

  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  
  where,
  deleteDoc,
  doc,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "../../../../firebase/firebase";

import type { SesionEntrenamiento } from "../types/seguimiento";


const COLLECTION = "sesiones";


// Más reciente primero: por día y, si empatan, por hora de finalización
const porRecientes = (a: SesionEntrenamiento, b: SesionEntrenamiento) =>
  b.fecha.getTime() - a.fecha.getTime() ||
  (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0);


export async function obtenerSesionesCliente(
  clienteId: string,
  desde?: Date,
  hasta?: Date,
): Promise<SesionEntrenamiento[]> {
  const hoy = new Date();

  const inicio = desde ?? new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const fin = hasta ?? new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);

  const q = query(
    collection(db, COLLECTION),
    where("clienteId", "==", clienteId),
    where("fecha", ">=", inicio),
    where("fecha", "<", fin),
    orderBy("fecha", "desc"),
  );

  const snapshot = await getDocs(q);

  const lista = snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      fecha: data.fecha?.toDate ? data.fecha.toDate() : new Date(data.fecha),
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : undefined,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : undefined,
      observaciones: data.observacionesCliente ?? data.observaciones ?? "",
    } as SesionEntrenamiento;
  });

  return lista.sort(porRecientes);
}




export async function eliminarSesion(
  id: string,
) {
  await deleteDoc(
    doc(db, COLLECTION, id)
  );
}

export function suscribirseUltimaSesionCliente(
  clienteId: string,
  onChange: (sesion: SesionEntrenamiento | null) => void,
): Unsubscribe {
  const q = query(
    collection(db, COLLECTION),
    where("clienteId", "==", clienteId),
    orderBy("fecha", "desc"),
    limit(10),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onChange(null);
        return;
      }

      const lista = snapshot.docs.map((documento) => {
        const data = documento.data();

        return {
          id: documento.id,
          clienteId: data.clienteId,
          preparadorId: data.preparadorId,
          fecha: data.fecha?.toDate?.() ?? new Date(data.fecha),
          mes: data.mes,
          anio: data.anio,
          libroId: data.libroId,
          libroNombre: data.libroNombre,
          ejercicios: data.ejercicios ?? [],
          bloques: data.bloques ?? [],
          bloquesRealizados: data.bloquesRealizados ?? [],
          duracion: data.duracion,
          rpe: data.rpe,
          carga: data.carga,
          observaciones: data.observacionesCliente ?? data.observaciones ?? "",
          createdAt: data.createdAt?.toDate?.() ?? undefined,
          updatedAt: data.updatedAt?.toDate?.() ?? undefined,
        } as SesionEntrenamiento;
      });

      onChange(lista.sort(porRecientes)[0]);
    },
    (error) => {
      console.error("Error cargando última sesión:", error);
      onChange(null);
    },
  );
}