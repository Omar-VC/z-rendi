// src/features/admin/fichas/services/ficha.service.ts
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import type { FichaCliente } from "../types";

const FICHAS_COLLECTION = "fichas";

export async function getFichaCliente(clienteId: string): Promise<FichaCliente | null> {
  if (!clienteId) return null;
  
  const fichaRef = doc(db, FICHAS_COLLECTION, clienteId);
  const snapshot = await getDoc(fichaRef);

  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as FichaCliente;
  }

  // Fallback por si la ficha usaba autoid en lugar de clienteId como Document ID
  const fichasRef = collection(db, FICHAS_COLLECTION);
  const q = query(fichasRef, where("clienteId", "==", clienteId));
  const querySnap = await getDocs(q);

  if (!querySnap.empty) {
    const docSnap = querySnap.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as FichaCliente;
  }

  return null;
}

export async function guardarFichaCliente(
  clienteId: string,
  ficha: Partial<FichaCliente>
): Promise<void> {
  const fichaRef = doc(db, FICHAS_COLLECTION, clienteId);
  const snapshot = await getDoc(fichaRef);

  const now = new Date().toISOString();

  if (snapshot.exists()) {
    await setDoc(fichaRef, { ...ficha, clienteId, updatedAt: now }, { merge: true });
  } else {
    await setDoc(fichaRef, { ...ficha, clienteId, createdAt: now, updatedAt: now }, { merge: true });
  }
}