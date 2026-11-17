import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { auth, db } from "../../../../firebase/firebase";

import type { Cliente } from "../types";
import { getAuth } from "firebase/auth";

const USUARIOS_COLLECTION = "usuarios";
const FICHAS_COLLECTION = "fichas";

export async function getClientes(): Promise<Cliente[]> {
  await auth.authStateReady();
  const uid = auth.currentUser?.uid;

  if (!uid) return [];

  const snapshot = await getDocs(
    query(
      collection(db, USUARIOS_COLLECTION),
      where("preparadorId", "==", uid),
    ),
  );

  const clientesPromesas = snapshot.docs.map(async (documento) => {
    // ...el resto queda exactamente igual
    const data = documento.data();

    // Intentamos obtener la foto desde la ficha asociada
    let fotoUrl: string | undefined = data.fotoUrl || data.photoURL;

    if (!fotoUrl) {
      try {
        const fichaSnap = await getDoc(doc(db, FICHAS_COLLECTION, documento.id));
        if (fichaSnap.exists()) {
          fotoUrl = fichaSnap.data().fotoUrl;
        }
      } catch (error) {
        console.error("Error al obtener la ficha para el cliente:", documento.id, error);
      }
    }

    return {
      id: documento.id,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      estado: data.estado,
      estadoCuenta: data.estadoCuenta ?? "activo",
      rol: data.rol,
      createdAt: data.CreatedAt,
      frecuenciaSemanal: data.frecuenciaSemanal,
      fotoUrl, // 👈 Sincronizado
    } as Cliente;
  });

  const usuarios = await Promise.all(clientesPromesas);
  return usuarios.filter((usuario) => usuario.rol === "cliente");
}

export async function getClienteById(id: string): Promise<Cliente | null> {
  const clienteRef = doc(db, USUARIOS_COLLECTION, id);
  const snapshot = await getDoc(clienteRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  let fotoUrl: string | undefined = data.fotoUrl || data.photoURL;

  if (!fotoUrl) {
    try {
      const fichaSnap = await getDoc(doc(db, FICHAS_COLLECTION, id));
      if (fichaSnap.exists()) {
        fotoUrl = fichaSnap.data().fotoUrl;
      }
    } catch (error) {
      console.error("Error al obtener la ficha del cliente:", id, error);
    }
  }

  return {
    id: snapshot.id,
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
    estado: data.estado,
    estadoCuenta: data.estadoCuenta ?? "activo",
    rol: data.rol,
    createdAt: data.CreatedAt,
    frecuenciaSemanal: data.frecuenciaSemanal,
    fotoUrl, // 👈 Sincronizado
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
    estadoCuenta: "activo",
    preparadorId: preparador.uid,
  });
}

export async function rechazarCliente(id: string): Promise<void> {
  const clienteRef = doc(db, USUARIOS_COLLECTION, id);

  await deleteDoc(clienteRef);
}

export async function darDeBajaCliente(id: string): Promise<void> {
  const clienteRef = doc(db, USUARIOS_COLLECTION, id);

  await updateDoc(clienteRef, {
    estadoCuenta: "inactivo",
  });
}

export async function reactivarCliente(id: string): Promise<void> {
  const clienteRef = doc(db, USUARIOS_COLLECTION, id);

  await updateDoc(clienteRef, {
    estadoCuenta: "activo",
  });
}

// Frecuencia semanal
export async function actualizarFrecuenciaSemanal(
  id: string,
  frecuenciaSemanal: number,
): Promise<void> {
  const clienteRef = doc(db, USUARIOS_COLLECTION, id);

  await updateDoc(clienteRef, {
    frecuenciaSemanal,
  });
}
