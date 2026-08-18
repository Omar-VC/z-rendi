import {
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "../../../../firebase/firebase";

import { getAuth } from "firebase/auth";

import type { Invitacion } from "../types";

const INVITACIONES_COLLECTION = "invitaciones";

function generarToken(): string {
  return crypto.randomUUID();
}

export async function crearInvitacion(): Promise<Invitacion> {
  const auth = getAuth();

  const preparador = auth.currentUser;

  if (!preparador) {
    throw new Error("No hay un preparador autenticado.");
  }

  const token = generarToken();

  const invitacion = {
    token,
    preparadorId: preparador.uid,
    estado: "pendiente" as const,
    createdAt: new Date().toISOString(),
  };

  await setDoc(
    doc(db, INVITACIONES_COLLECTION, token),
    invitacion,
  );

  return {
    id: token,
    ...invitacion,
  };
}

export async function obtenerInvitacionPorToken(
  token: string,
): Promise<Invitacion | null> {

  const referencia = doc(
    db,
    INVITACIONES_COLLECTION,
    token,
  );

  const snapshot = await getDoc(referencia);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    token: data.token,
    preparadorId: data.preparadorId,
    estado: data.estado,
    createdAt: data.createdAt,
    usedAt: data.usedAt,
    clienteId: data.clienteId,
  };
}