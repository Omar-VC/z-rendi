import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "../../../../firebase/firebase";

import type { Cuota } from "../types";

const CUOTAS_COLLECTION = "cuotas";

/**
 * Obtiene todas las cuotas de un cliente,
 * ordenadas desde la más reciente a la más antigua.
 */
export async function getCuotasCliente(
  clienteId: string,
): Promise<Cuota[]> {
  const cuotasRef = collection(db, CUOTAS_COLLECTION);

  const q = query(
    cuotasRef,
    where("clienteId", "==", clienteId),
    orderBy("fechaVencimiento", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  })) as Cuota[];
}

/**
 * Crea una cuota solamente si no existe
 * otra cuota para el mismo cliente,
 * mes y año.
 */
export async function crearCuota(
  cuota: Omit<Cuota, "id">,
): Promise<void> {
  const cuotasRef = collection(db, CUOTAS_COLLECTION);

  const consultaExistente = query(
    cuotasRef,
    where("clienteId", "==", cuota.clienteId),
    where("mes", "==", cuota.mes),
    where("anio", "==", cuota.anio),
  );

  const snapshot = await getDocs(consultaExistente);

  if (!snapshot.empty) {
    throw new Error(
      `Ya existe una cuota para ${cuota.mes} ${cuota.anio}.`,
    );
  }

  await addDoc(cuotasRef, cuota);
}

/**
 * Registra el pago de una cuota y genera
 * automáticamente la cuota del período siguiente.
 *
 * La fecha de pago es independiente del período
 * y del vencimiento de la cuota.
 */
export async function registrarPago(
  cuota: Cuota,
  metodoPago: "efectivo" | "transferencia",
): Promise<void> {
  const cuotasRef = collection(db, CUOTAS_COLLECTION);

  // --------------------------------------------------
  // 1. Marcar cuota actual como pagada
  // --------------------------------------------------

  await updateDoc(
    doc(db, CUOTAS_COLLECTION, cuota.id),
    {
      estado: "pagada",
      fechaPago: new Date().toISOString().split("T")[0],
      metodoPago,
    },
  );

  // --------------------------------------------------
  // 2. Determinar el período siguiente
  // --------------------------------------------------

  const numeroMesActual = obtenerNumeroMes(cuota.mes);

  if (numeroMesActual === 0) {
    throw new Error(
      `Mes inválido en la cuota: ${cuota.mes}`,
    );
  }

  let siguienteMesNumero = numeroMesActual + 1;
  let siguienteAnio = cuota.anio;

  if (siguienteMesNumero > 12) {
    siguienteMesNumero = 1;
    siguienteAnio += 1;
  }

  const siguienteMes =
    obtenerNombreMes(siguienteMesNumero);

  // --------------------------------------------------
  // 3. Comprobar si ya existe la próxima cuota
  // --------------------------------------------------

  const consultaExistente = query(
    cuotasRef,
    where("clienteId", "==", cuota.clienteId),
    where("mes", "==", siguienteMes),
    where("anio", "==", siguienteAnio),
  );

  const snapshot = await getDocs(consultaExistente);

  // Si ya existe, no hacemos nada.
  if (!snapshot.empty) {
    return;
  }

  // --------------------------------------------------
  // 4. Calcular vencimiento de la próxima cuota
  // --------------------------------------------------

  const fechaVencimiento =
    calcularFechaVencimiento(
      siguienteMesNumero,
      siguienteAnio,
    );

  // --------------------------------------------------
  // 5. Crear próxima cuota
  // --------------------------------------------------

  await addDoc(cuotasRef, {
    clienteId: cuota.clienteId,
    mes: siguienteMes,
    anio: siguienteAnio,
    monto: cuota.monto,
    estado: "pendiente",
    fechaVencimiento,
  });
}

/**
 * Edita una cuota existente.
 */
export async function editarCuota(
  cuotaId: string,
  datos: Partial<Cuota>,
): Promise<void> {
  await updateDoc(
    doc(
      db,
      CUOTAS_COLLECTION,
      cuotaId,
    ),
    datos,
  );
}

/**
 * Revierte el pago de una cuota.
 */
export async function revertirPago(
  cuotaId: string,
): Promise<void> {
  await updateDoc(
    doc(
      db,
      CUOTAS_COLLECTION,
      cuotaId,
    ),
    {
      estado: "pendiente",
      fechaPago: null,
      metodoPago: null,
    },
  );
}

// --------------------------------------------------
// UTILIDADES
// --------------------------------------------------

/**
 * Obtiene el número del mes a partir de su nombre.
 */
function obtenerNumeroMes(
  mes: string,
): number {
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  return meses.indexOf(
    mes.toLowerCase(),
  ) + 1;
}

/**
 * Obtiene el nombre del mes a partir de su número.
 */
function obtenerNombreMes(
  numeroMes: number,
): string {
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  return meses[numeroMes - 1];
}

/**
 * Calcula el vencimiento de una cuota.
 *
 * Regla de negocio:
 * Todas las cuotas vencen el día 10
 * del mes correspondiente.
 */
function calcularFechaVencimiento(
  numeroMes: number,
  anio: number,
): string {
  let mesVencimiento = numeroMes + 1;
  let anioVencimiento = anio;

  if (mesVencimiento > 12) {
    mesVencimiento = 1;
    anioVencimiento += 1;
  }

  return `${anioVencimiento}-${String(
    mesVencimiento,
  ).padStart(2, "0")}-10`;
}

/**
 * Elimina una cuota.
 *
 * Se utiliza para corregir cuotas creadas por error.
 */
export async function eliminarCuota(
  cuotaId: string,
): Promise<void> {
  await deleteDoc(
    doc(
      db,
      CUOTAS_COLLECTION,
      cuotaId,
    ),
  );
}