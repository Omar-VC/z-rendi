import {
  addDoc,
  collection,
  getDoc,
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
  objetivoNuevo: string
): Promise<void> {

  const ref = doc(db, COLLECTION, id);

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("La barrera no existe");
  }

  const barrera = snapshot.data();


  const historialActual = barrera.historial || [];


  const nuevoRegistro = {

    fecha: new Date(),

    objetivo: barrera.objetivo,

    resultado: barrera.resultado || "",

    observaciones: barrera.observaciones || "",

  };


  await updateDoc(ref, {

    objetivo: objetivoNuevo,

    resultado: "",

    observaciones: "",

    estado: "pendiente",

    historial: [
      ...historialActual,
      nuevoRegistro,
    ],

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