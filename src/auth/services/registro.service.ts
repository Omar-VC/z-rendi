import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import {
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../../firebase/firebase";

import type { Invitacion } from "../../features/admin/invitaciones/types";
import type { FichaCliente } from "../../features/admin/fichas/types";

import { guardarFichaCliente } from "../../features/admin/fichas/services/ficha.service";

interface DatosRegistro {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  edad: number;
  telefono: string;
  deporte: string;
}

export async function registrarCliente(
  invitacion: Invitacion,
  datos: DatosRegistro,
): Promise<void> {

  if (invitacion.estado !== "pendiente") {
    throw new Error("Esta invitación ya no está disponible.");
  }

  const credencial = await createUserWithEmailAndPassword(
    auth,
    datos.email,
    datos.password,
  );

  const clienteId = credencial.user.uid;

  await setDoc(
    doc(db, "usuarios", clienteId),
    {
      nombre: datos.nombre,
      apellido: datos.apellido,
      email: datos.email,

      rol: "cliente",

      estado: "aprobado",
      estadoCuenta: "activo",

      preparadorId: invitacion.preparadorId,

      frecuenciaSemanal: 0,

      createdAt: new Date().toISOString(),
    },
  );

  const fichaInicial: FichaCliente = {
    id: "",
    clienteId,

    nombre: datos.nombre,
    apellido: datos.apellido,

    edad: datos.edad,
    telefono: datos.telefono,

    deporte: datos.deporte,

    nivel: "",
    experiencia: "",

    objetivoPrincipal: "",
    objetivosSecundarios: [],

    lesiones: "Ninguna",

    observaciones: "",
  };

  await guardarFichaCliente(
    clienteId,
    fichaInicial,
  );

  await updateDoc(
    doc(db, "invitaciones", invitacion.id),
    {
      estado: "usada",
      clienteId,
      usedAt: new Date().toISOString(),
    },
  );
}