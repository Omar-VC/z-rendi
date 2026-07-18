import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../../firebase/firebase";
import type { Cliente } from "../types";
import { getAuth } from "firebase/auth";

const USUARIOS_COLLECTION = "usuarios";

export async function getClientes(): Promise<Cliente[]> {
  const snapshot = await getDocs(collection(db, USUARIOS_COLLECTION));

  return snapshot.docs
    .map((documento) => {
      const data = documento.data();

      return {
        id: documento.id,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        estado: data.estado,
        rol: data.rol,
        createdAt: data.CreatedAt,
        frecuenciaSemanal: data.frecuenciaSemanal,
      } as Cliente;
    })
    .filter((usuario) => usuario.rol === "cliente");
}

export async function getClienteById(id: string): Promise<Cliente | null> {
  const clienteRef = doc(db, USUARIOS_COLLECTION, id);
  const snapshot = await getDoc(clienteRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
    estado: data.estado,
    rol: data.rol,
    createdAt: data.CreatedAt,
    frecuenciaSemanal: data.frecuenciaSemanal,
  } as Cliente;
}

export async function aprobarCliente(id: string): Promise<void> {
  const auth = getAuth();
  const preparador = auth.currentUser;

  if (!preparador) {
    throw new Error("No hay usuario autenticado.");
  }

  const clienteRef = doc(db, USUARIOS_COLLECTION, id);

  await updateDoc(clienteRef, {
    estado: "aprobado",
    preparadorId: preparador.uid,
  });
}

export async function rechazarCliente(id: string): Promise<void> {
  const clienteRef = doc(db, USUARIOS_COLLECTION, id);

  await deleteDoc(clienteRef);
}

//Frecuncia semanal
export async function actualizarFrecuenciaSemanal(
  id: string,
  frecuenciaSemanal: number,
): Promise<void> {
  const clienteRef = doc(db, USUARIOS_COLLECTION, id);

  await updateDoc(clienteRef, {
    frecuenciaSemanal,
  });
}
