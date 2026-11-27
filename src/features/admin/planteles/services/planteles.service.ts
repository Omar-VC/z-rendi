import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  where 
} from "firebase/firestore";
import { db, auth } from "../../../../firebase/firebase";
import type { Equipo } from "../types/plantel";
import { jugadoresService } from "./jugadores.service";
import { sesionesService } from "./sesiones.service";

const COLECCION_EQUIPOS = "equipos";

export const plantelesService = {
  // Obtener equipos del preparador actual
  async obtenerEquipos(): Promise<Equipo[]> {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, COLECCION_EQUIPOS),
      where("preparadorId", "==", user.uid)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Equipo[];
  },

  // Obtener un equipo por ID
  async obtenerEquipoPorId(id: string): Promise<Equipo | null> {
    const docRef = doc(db, COLECCION_EQUIPOS, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Equipo;
  },

  // Crear un nuevo equipo adjuntando el preparadorId
  async crearEquipo(equipo: Omit<Equipo, "id">): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const docRef = await addDoc(collection(db, COLECCION_EQUIPOS), {
      ...equipo,
      preparadorId: user.uid,
      creadoEn: serverTimestamp(),
      atletasCount: equipo.atletasCount || 0,
      proximaSesion: equipo.proximaSesion || "Sin definir",
    });
    return docRef.id;
  },

  // Actualizar datos de un equipo
  async actualizarEquipo(id: string, datos: Partial<Equipo>): Promise<void> {
    const docRef = doc(db, COLECCION_EQUIPOS, id);
    await updateDoc(docRef, datos);
  },

  // Eliminar un equipo junto con sus jugadores y sesiones.
  // El equipo se borra al final: las reglas lo consultan para autorizar lo demás.
  async eliminarEquipo(id: string): Promise<void> {
    const jugadores = await jugadoresService.obtener(id);
    await Promise.all(jugadores.map((j) => jugadoresService.eliminar(id, j.id!)));
    await sesionesService.eliminarHistorialEquipo(id);

    const docRef = doc(db, COLECCION_EQUIPOS, id);
    await deleteDoc(docRef);
  },
};