import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../../firebase/firebase";

import type { Barrera } from "../types/barrera";


const COLLECTION = "barrerasProgreso";


export async function obtenerBarreras(
  clienteId: string
): Promise<Barrera[]> {


  const q = query(
    collection(db, COLLECTION),
    where(
      "clienteId",
      "==",
      clienteId
    )
  );


  const snapshot = await getDocs(q);

  console.log(
    "Barreras encontradas:",
    snapshot.size
  );


  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Barrera[];

}



export async function crearBarrera(
  barrera: Omit<Barrera, "id">
){

  await addDoc(
    collection(db, COLLECTION),
    {
      ...barrera,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

}



export async function actualizarBarrera(
  id:string,
  cambios:Partial<Barrera>
){

  await updateDoc(
    doc(db,COLLECTION,id),
    {
      ...cambios,
      updatedAt:serverTimestamp()
    }
  );

}

export async function guardarNuevoObjetivo(
  id: string,
  objetivo: string
): Promise<void> {

  const ref = doc(db, COLLECTION, id);

  await updateDoc(ref, {
    objetivo,
    resultado: "",
    observaciones: "",
    estado: "pendiente",
    updatedAt: serverTimestamp(),
  });

}

export async function eliminarBarrera(
  id: string
): Promise<void> {

  await deleteDoc(
    doc(db, COLLECTION, id)
  );

}