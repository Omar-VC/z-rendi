import {
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db, auth } from "../../../../firebase/firebase";

const COLLECTION = "notasPrivadasInforme";

export type NotaPrivadaInforme = {
  clienteId: string;
  mes: number;
  anio: number;
  preparadorId: string;
  nota: string;
  actualizadoEn: any; // serverTimestamp()
};

/**
 * Genera el ID determinista del documento de nota privada.
 * Formato: clienteId_mes_anio
 */
function generarDocId(clienteId: string, mes: number, anio: number): string {
  return `${clienteId}_${mes}_${anio}`;
}

/**
 * Obtiene la nota privada de un atleta para un mes/año determinado.
 * Retorna null si no existe.
 */
export async function obtenerNotaPrivada(
  clienteId: string,
  mes: number,
  anio: number,
): Promise<string | null> {
  await auth.authStateReady();

  const uid = auth.currentUser?.uid;

  const docRef = doc(db, COLLECTION, generarDocId(clienteId, mes, anio));

  try {
    const snapshot = await getDoc(docRef);

    console.log("Nota consultada:", {
      clienteId,
      existe: snapshot.exists(),
      preparadorId: uid,
    });

    if (!snapshot.exists()) return null;

    const data = snapshot.data() as NotaPrivadaInforme;

    if (uid && data.preparadorId !== uid) return null;

    return data.nota ?? null;

  } catch (error) {
    console.error("Error leyendo nota del atleta:", clienteId, error);
    throw error;
  }
}

/**
 * Guarda o actualiza la nota privada de un atleta para un mes/año determinado.
 * Crea el documento si no existe, lo sobrescribe si ya existe.
 */
export async function guardarNotaPrivada(
  clienteId: string,
  mes: number,
  anio: number,
  nota: string,
): Promise<void> {
  await auth.authStateReady();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuario no autenticado");

  const docRef = doc(db, COLLECTION, generarDocId(clienteId, mes, anio));

  await setDoc(
    docRef,
    {
      clienteId,
      mes,
      anio,
      preparadorId: uid,
      nota,
      actualizadoEn: serverTimestamp(),
    },
    { merge: true },
  );
}

/**
 * Obtiene todas las notas privadas del preparador autenticado para un mes/año.
 * Útil para depuración o listados futuros.
 */
export async function listarNotasPrivadasPreparador(
  mes: number,
  anio: number,
): Promise<NotaPrivadaInforme[]> {
  await auth.authStateReady();
  const uid = auth.currentUser?.uid;
  if (!uid) return [];

  const q = query(
    collection(db, COLLECTION),
    where("mes", "==", mes),
    where("anio", "==", anio),
    where("preparadorId", "==", uid),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as unknown as NotaPrivadaInforme[];
}