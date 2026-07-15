import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
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


  const fichasRef = collection(
    db,
    FICHAS_COLLECTION
  );


  const q = query(
    fichasRef,
    where("clienteId", "==", clienteId)
  );


  const snapshot = await getDocs(q);



  if (!snapshot.empty) {

    const fichaExistente = snapshot.docs[0];


    await updateDoc(
      doc(
        db,
        FICHAS_COLLECTION,
        fichaExistente.id
      ),
      {
        ...ficha,
        clienteId,
        updatedAt: new Date().toISOString(),
      }
    );


    return;
  }



  await addDoc(
    fichasRef,
    {
      ...ficha,
      clienteId,
      createdAt: new Date().toISOString(),
    }
  );
}