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


export async function obtenerSesionesCliente(
  clienteId: string,
  desde?: Date,
  hasta?: Date,
): Promise<SesionEntrenamiento[]> {
  const hoy = new Date();

  // Por defecto: mes actual. No depende de los campos mes/anio.
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

  return snapshot.docs.map((doc) => {
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
    limit(1),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onChange(null);
        return;
      }

      const documento = snapshot.docs[0];
      const data = documento.data();

      onChange({
        id: documento.id,
        clienteId: data.clienteId,
        preparadorId: data.preparadorId,
        fecha: data.fecha?.toDate?.() ?? new Date(data.fecha),
        mes: data.mes,
        anio: data.anio,
        libroId: data.libroId,
        libroNombre: data.libroNombre,
        ejercicios: data.ejercicios ?? [],
        duracion: data.duracion,
        rpe: data.rpe,
        carga: data.carga,
        observaciones: data.observacionesCliente ?? data.observaciones ?? "",
        createdAt: data.createdAt?.toDate?.() ?? undefined,
        updatedAt: data.updatedAt?.toDate?.() ?? undefined,
      } as SesionEntrenamiento);
    },
    (error) => {
      console.error("Error cargando última sesión:", error);
      onChange(null);
    },
  );
}