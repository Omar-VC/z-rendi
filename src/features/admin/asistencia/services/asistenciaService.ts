import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../../../../firebase/firebase";

import type { EstadoAsistencia } from "../types/asistencia.types";

const ASISTENCIAS_COLLECTION = "asistencias";


// Crear o actualizar la asistencia de un cliente en una fecha
export async function guardarAsistencia(
  clienteId: string,
  fecha: string,
  estado: EstadoAsistencia,
  frecuenciaSemanalMes: number
): Promise<void> {
  const asistenciasRef = collection(
    db,
    ASISTENCIAS_COLLECTION
  );

  const q = query(
    asistenciasRef,
    where("clienteId", "==", clienteId),
    where("fecha", "==", fecha)
  );

  const snapshot = await getDocs(q);

  // Si ya existe, actualizar el registro
  if (!snapshot.empty) {
    const documentoExistente = snapshot.docs[0];

    await updateDoc(documentoExistente.ref, {
      estado,
      frecuenciaSemanalMes,
      updatedAt: new Date().toISOString(),
    });

    return;
  }

  // Si no existe, crear uno nuevo
  await addDoc(asistenciasRef, {
    clienteId,
    fecha,
    estado,
    frecuenciaSemanalMes,
    createdAt: new Date().toISOString(),
  });
}


// Obtener asistencias de un cliente en un mes
export async function obtenerAsistenciaMensual(
  clienteId: string,
  inicioMes: string,
  finMes: string
) {
  const asistenciasRef = collection(
    db,
    ASISTENCIAS_COLLECTION
  );

  const q = query(
    asistenciasRef,
    where("clienteId", "==", clienteId),
    where("fecha", ">=", inicioMes),
    where("fecha", "<=", finMes)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  }));
}