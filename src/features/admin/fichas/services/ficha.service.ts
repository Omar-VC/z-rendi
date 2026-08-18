import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "../../../../firebase/firebase";

import type { FichaCliente } from "../types";

const FICHAS_COLLECTION = "fichas";

export async function getFichaCliente(
  clienteId: string
): Promise<FichaCliente | null> {

  const fichasRef = collection(
    db,
    FICHAS_COLLECTION
  );

  const q = query(
    fichasRef,
    where("clienteId", "==", clienteId)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const documento = snapshot.docs[0];

  return {
    id: documento.id,
    ...documento.data(),
  } as FichaCliente;
}

export async function guardarFichaCliente(
  clienteId: string,
  ficha: FichaCliente
): Promise<void> {

  const fichaRef = doc(
    db,
    FICHAS_COLLECTION,
    clienteId
  );

  const snapshot = await getDoc(fichaRef);

  if (snapshot.exists()) {

    await updateDoc(
      fichaRef,
      {
        ...ficha,
        clienteId,
        updatedAt: new Date().toISOString(),
      }
    );

    return;
  }

  await setDoc(
    fichaRef,
    {
      ...ficha,
      clienteId,
      createdAt: new Date().toISOString(),
    }
  );
}