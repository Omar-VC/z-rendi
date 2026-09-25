import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../../../firebase/firebase";
import type { SesionEntrenamiento } from "../types/plantel";

const COLECCION_SESIONES = "sesionesPlantel";

export const sesionesService = {
  // Obtener las sesiones de un plantel específico (para el historial)
  async obtenerSesionesPorEquipo(equipoId: string): Promise<SesionEntrenamiento[]> {
    try {
      const q = query(
        collection(db, COLECCION_SESIONES),
        where("equipoId", "==", equipoId)
      );
      
      const snapshot = await getDocs(q);
      const sesiones = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as SesionEntrenamiento[];

      // Ordenar localmente por fecha descendente para evitar errores de índices en Firestore
      return sesiones.sort((a, b) => (b.fecha > a.fecha ? 1 : -1));
    } catch (error) {
      console.error("Error al obtener sesiones por equipo:", error);
      return [];
    }
  },

  // Obtener la sesión ACTIVA del día de un equipo (ignora las completadas)
  async obtenerSesionDelDia(equipoId: string, fechaHoy: string): Promise<SesionEntrenamiento | null> {
    try {
      const q = query(
        collection(db, COLECCION_SESIONES),
        where("equipoId", "==", equipoId),
        where("fecha", "==", fechaHoy),
        where("completada", "==", false)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const docSnap = snapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as SesionEntrenamiento;
    } catch (error) {
      console.error("Error al obtener sesión del día:", error);
      return null;
    }
  },

  // Crear una nueva sesión con sus bloques
  async crearSesion(sesion: Omit<SesionEntrenamiento, "id">): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const docRef = await addDoc(collection(db, COLECCION_SESIONES), {
      ...sesion,
      preparadorId: user.uid,
      completada: false,
      creadoEn: serverTimestamp(),
    });
    return docRef.id;
  },

  // Actualizar una sesión (bloques, estado completada, etc.)
  async actualizarSesion(id: string, datos: Partial<SesionEntrenamiento>): Promise<void> {
    const docRef = doc(db, COLECCION_SESIONES, id);
    await updateDoc(docRef, datos);
  },

  // Eliminar sesión físicamente de Firestore
  async eliminarSesion(id: string): Promise<void> {
    const docRef = doc(db, COLECCION_SESIONES, id);
    await deleteDoc(docRef);
  },

  // Eliminar TODO el historial de un equipo en Firestore
  async eliminarHistorialEquipo(equipoId: string): Promise<void> {
    const q = query(
      collection(db, COLECCION_SESIONES),
      where("equipoId", "==", equipoId)
    );
    const snapshot = await getDocs(q);
    const borrados = snapshot.docs.map((docSnap) => deleteDoc(doc(db, COLECCION_SESIONES, docSnap.id)));
    await Promise.all(borrados);
  }
};