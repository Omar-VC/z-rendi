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
        CreatedAt: data.CreatedAt,
      } as Cliente;
    })
    .filter((usuario) => usuario.rol === "cliente");
}

export async function getClienteById(
  id: string
): Promise<Cliente | null> {
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
    CreatedAt: data.CreatedAt,
  } as Cliente;
}

export async function aprobarCliente(id: string): Promise<void> {
  const clienteRef = doc(db, USUARIOS_COLLECTION, id);

  await updateDoc(clienteRef, {
    estado: "aprobado",
  });
}

export async function rechazarCliente(id: string): Promise<void> {
  const clienteRef = doc(db, USUARIOS_COLLECTION, id);

  await deleteDoc(clienteRef);
}