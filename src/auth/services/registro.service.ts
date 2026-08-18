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
    throw new Error(
      "Esta invitación ya no está disponible."
    );
  }

  // 1. Crear cuenta en Firebase Authentication

  const credencial =
    await createUserWithEmailAndPassword(
      auth,
      datos.email,
      datos.password,
    );

  const clienteId = credencial.user.uid;


  // 2. Crear usuario

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


  // 3. Crear ficha inicial

  const fichaInicial: FichaCliente = {
    id: clienteId,
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


  await setDoc(
    doc(db, "fichas", clienteId),
    {
      ...fichaInicial,
      clienteId,
      createdAt: new Date().toISOString(),
    },
  );


  // 4. Marcar invitación como usada

  await updateDoc(
    doc(
      db,
      "invitaciones",
      invitacion.id
    ),
    {
      estado: "usada",
      clienteId,
      usedAt: new Date().toISOString(),
    },
  );
}