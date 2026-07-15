import {
  addDoc,
  updateDoc,
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

export async function getCuotasCliente(clienteId: string): Promise<Cuota[]> {
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

export async function crearCuota(cuota: Omit<Cuota, "id">): Promise<void> {
  const cuotasRef = collection(db, CUOTAS_COLLECTION);

  await addDoc(cuotasRef, cuota);
}

export async function registrarPago(
  cuota: Cuota,
  metodoPago: "efectivo" | "transferencia"
): Promise<void> {
  // 1. Registrar el pago de la cuota actual
  await updateDoc(
    doc(db, CUOTAS_COLLECTION, cuota.id),
    {
      estado: "pagada",
      fechaPago: new Date().toISOString().split("T")[0],
      metodoPago,
    }
  );

  // 2. Calcular el mes siguiente
  const fechaActual = new Date(
    `${cuota.anio}-${String(
      obtenerNumeroMes(cuota.mes)
    ).padStart(2, "0")}-01`
  );

  fechaActual.setMonth(fechaActual.getMonth() + 1);

  const siguienteMesNumero = fechaActual.getMonth() + 1;
  const siguienteAnio = fechaActual.getFullYear();

  const siguienteMes = obtenerNombreMes(siguienteMesNumero);

  // 3. Comprobar si ya existe
  const cuotasRef = collection(db, CUOTAS_COLLECTION);

  const consultaExistente = query(
    cuotasRef,
    where("clienteId", "==", cuota.clienteId),
    where("mes", "==", siguienteMes),
    where("anio", "==", siguienteAnio)
  );

  const snapshot = await getDocs(consultaExistente);

  if (!snapshot.empty) {
    return;
  }

  // 4. Crear próxima cuota
  const fechaVencimientoActual =
    new Date(`${cuota.fechaVencimiento}T12:00:00`);

  fechaVencimientoActual.setMonth(
    fechaVencimientoActual.getMonth() + 1
  );

  const fechaVencimiento =
    fechaVencimientoActual
      .toISOString()
      .split("T")[0];

  await addDoc(cuotasRef, {
    clienteId: cuota.clienteId,
    mes: siguienteMes,
    anio: siguienteAnio,
    monto: cuota.monto,
    estado: "pendiente",
    fechaVencimiento,
  });
}

export async function editarCuota(
  cuotaId: string,
  datos: Partial<Cuota>
): Promise<void> {

  await updateDoc(
    doc(
      db,
      CUOTAS_COLLECTION,
      cuotaId
    ),
    datos
  );

}

export async function revertirPago(
  cuotaId: string
): Promise<void> {

  await updateDoc(
    doc(
      db,
      CUOTAS_COLLECTION,
      cuotaId
    ),
    {
      estado: "pendiente",
      fechaPago: null,
      metodoPago: null,
    }
  );

}


//OBTENER NOMBRE DEL MES A PARTIR DE SU NÚMERO
function obtenerNumeroMes(mes: string): number {
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

  return meses.indexOf(mes.toLowerCase()) + 1;
}

function obtenerNombreMes(numeroMes: number): string {
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