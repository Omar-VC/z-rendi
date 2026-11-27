import {
  collection,
  getDocs,
  getCountFromServer,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import type { Jugador } from "../types/plantel";

// Los jugadores viven dentro de su equipo: equipos/{equipoId}/jugadores
const coleccion = (equipoId: string) =>
  collection(db, "equipos", equipoId, "jugadores");

export const jugadoresService = {
  async obtener(equipoId: string): Promise<Jugador[]> {
    const snapshot = await getDocs(coleccion(equipoId));
    return snapshot.docs
      .map((d) => ({ ...(d.data() as Jugador), id: d.id }))
      .sort((a, b) =>
        `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`, "es"),
      );
  },

  async contar(equipoId: string): Promise<number> {
    const snapshot = await getCountFromServer(coleccion(equipoId));
    return snapshot.data().count;
  },

  async crear(equipoId: string, jugador: Omit<Jugador, "id">): Promise<void> {
    await addDoc(coleccion(equipoId), { ...jugador, creadoEn: serverTimestamp() });
  },

  async actualizar(equipoId: string, id: string, datos: Omit<Jugador, "id">): Promise<void> {
    await updateDoc(doc(coleccion(equipoId), id), { ...datos });
  },

  async eliminar(equipoId: string, id: string): Promise<void> {
    await deleteDoc(doc(coleccion(equipoId), id));
  },
};
