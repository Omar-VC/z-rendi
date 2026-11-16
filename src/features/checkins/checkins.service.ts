import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
import type { Checkin, DatosCheckin } from "./types";

const COLLECTION = "checkins";

function mapear(d: QueryDocumentSnapshot<DocumentData> | { id: string; data: () => DocumentData | undefined }): Checkin {
  const data = d.data() ?? {};
  return {
    id: d.id,
    clienteId: data.clienteId,
    preparadorId: data.preparadorId,
    fecha: data.fecha,
    asiste: data.asiste,
    motivoNo: data.motivoNo,
    sueno: data.sueno,
    fatiga: data.fatiga,
    molestia: data.molestia,
    comentario: data.comentario,
    actualizadoEn: data.actualizadoEn?.toDate?.(),
  };
}

export async function obtenerCheckin(
  clienteId: string,
  fecha: string,
): Promise<Checkin | null> {
  const snap = await getDoc(doc(db, COLLECTION, `${clienteId}_${fecha}`));
  if (!snap.exists()) return null;
  return mapear(snap);
}

export async function guardarCheckin(
  clienteId: string,
  fecha: string,
  datos: DatosCheckin,
): Promise<void> {
  // El preparador del atleta está en su documento de usuario
  const usuarioSnap = await getDoc(doc(db, "usuarios", clienteId));
  const preparadorId = usuarioSnap.data()?.preparadorId;

  if (!preparadorId) {
    throw new Error("Tu cuenta todavía no tiene preparador asignado.");
  }

  // Firestore rechaza campos undefined
  const limpio = Object.fromEntries(
    Object.entries(datos).filter(([, v]) => v !== undefined),
  );

  await setDoc(doc(db, COLLECTION, `${clienteId}_${fecha}`), {
    clienteId,
    preparadorId,
    fecha,
    ...limpio,
    actualizadoEn: new Date(),
  });
}

export function suscribirseCheckinsDelDia(
  preparadorId: string,
  fecha: string,
  onChange: (checkins: Checkin[]) => void,
  onError?: (e: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, COLLECTION),
    where("preparadorId", "==", preparadorId),
    where("fecha", "==", fecha),
  );

  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map(mapear)),
    (e) => {
      console.error("Error leyendo check-ins:", e);
      onError?.(e);
    },
  );
}