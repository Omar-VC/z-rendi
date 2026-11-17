import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import { auth, db } from "../../firebase/firebase";
import type { Aviso, TipoAviso } from "./types";

const COLLECTION = "avisos";

function mapear(d: QueryDocumentSnapshot<DocumentData>): Aviso {
  const data = d.data();
  return {
    id: d.id,
    clienteId: data.clienteId,
    preparadorId: data.preparadorId,
    tipo: data.tipo,
    texto: data.texto,
    leido: !!data.leido,
    creadoEn: data.creadoEn?.toDate?.() ?? new Date(data.creadoEn),
    leidoEn: data.leidoEn?.toDate?.(),
  };
}

const masRecientes = (a: Aviso, b: Aviso) =>
  b.creadoEn.getTime() - a.creadoEn.getTime();

export async function crearAviso(
  clienteId: string,
  tipo: TipoAviso,
  texto: string,
): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("No hay un preparador autenticado.");

  await addDoc(collection(db, COLLECTION), {
    clienteId,
    preparadorId: uid,
    tipo,
    texto: texto.trim(),
    leido: false,
    creadoEn: new Date(),
  });
}

// Lado atleta: sus avisos (se ordena en memoria, sin índice)
export function suscribirseAvisosAtleta(
  clienteId: string,
  onChange: (avisos: Aviso[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, COLLECTION),
    where("clienteId", "==", clienteId),
  );

  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map(mapear).sort(masRecientes)),
    (e) => console.error("Error leyendo avisos:", e),
  );
}

// Lado preparador: lo que le envió a un atleta
export function suscribirseAvisosEnviados(
  clienteId: string,
  preparadorId: string,
  onChange: (avisos: Aviso[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, COLLECTION),
    where("clienteId", "==", clienteId),
    where("preparadorId", "==", preparadorId),
  );

  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map(mapear).sort(masRecientes)),
    (e) => console.error("Error leyendo avisos enviados:", e),
  );
}

export async function marcarAvisoLeido(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    leido: true,
    leidoEn: new Date(),
  });
}