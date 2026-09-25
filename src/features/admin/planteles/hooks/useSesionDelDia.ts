import { useState, useEffect } from "react";
import type { SesionEntrenamiento, BloqueSesion } from "../types/plantel";
import { sesionesService } from "../services/sesiones.service";

export function useSesionDelDia(equipoId: string | undefined) {
  const [sesion, setSesion] = useState<SesionEntrenamiento | null>(null);
  const [loading, setLoading] = useState(true);
  const fechaHoy = new Date().toISOString().split("T")[0];

  const cargarSesion = async () => {
    if (!equipoId) return;
    try {
      setLoading(true);
      const data = await sesionesService.obtenerSesionDelDia(equipoId, fechaHoy);
      setSesion(data);
    } catch (err) {
      console.error("Error al cargar la sesión del día:", err);
    } finally {
      setLoading(false);
    }
  };

  const iniciarNuevaSesion = async (objetivo: string, microciclo: string) => {
    if (!equipoId) return;
    const nuevaSesion: Omit<SesionEntrenamiento, "id"> = {
      equipoId,
      fecha: fechaHoy,
      microciclo: microciclo || "Día de Entrenamiento",
      objetivo: objetivo || "Preparación Física General",
      duracionTotalMinutos: 0,
      bloques: [],
      completada: false,
    };

    const id = await sesionesService.crearSesion(nuevaSesion);
    setSesion({ ...nuevaSesion, id });
  };

  const agregarBloque = async (nuevoBloque: Omit<BloqueSesion, "id">) => {
    if (!sesion || !sesion.id) return;
    
    const bloquesActualizados = [...sesion.bloques, { ...nuevoBloque, id: Date.now().toString() }];
    const nuevaDuracion = bloquesActualizados.reduce((acc, b) => acc + b.duracionMinutos, 0);

    await sesionesService.actualizarSesion(sesion.id, {
      bloques: bloquesActualizados,
      duracionTotalMinutos: nuevaDuracion,
    });

    setSesion({
      ...sesion,
      bloques: bloquesActualizados,
      duracionTotalMinutos: nuevaDuracion,
    });
  };

  const eliminarBloque = async (bloqueIndex: number) => {
    if (!sesion || !sesion.id) return;

    const bloquesActualizados = sesion.bloques.filter((_, idx) => idx !== bloqueIndex);
    const nuevaDuracion = bloquesActualizados.reduce((acc, b) => acc + b.duracionMinutos, 0);

    await sesionesService.actualizarSesion(sesion.id, {
      bloques: bloquesActualizados,
      duracionTotalMinutos: nuevaDuracion,
    });

    setSesion({
      ...sesion,
      bloques: bloquesActualizados,
      duracionTotalMinutos: nuevaDuracion,
    });
  };

  // Eliminar la sesión activa permanentemente
  const eliminarSesionActual = async () => {
    if (!sesion?.id) return;
    try {
      await sesionesService.eliminarSesion(sesion.id);
      setSesion(null);
    } catch (error) {
      console.error("Error al eliminar la sesión:", error);
    }
  };

  // Finalizar la sesión (marcar completada: true)
  const finalizarSesionActual = async () => {
    if (!sesion?.id) return;
    try {
      await sesionesService.actualizarSesion(sesion.id, { completada: true });
      setSesion(null);
    } catch (error) {
      console.error("Error al finalizar la sesión:", error);
    }
  };

  useEffect(() => {
    cargarSesion();
  }, [equipoId]);

  return { 
    sesion, 
    loading, 
    iniciarNuevaSesion, 
    agregarBloque, 
    eliminarBloque, 
    eliminarSesionActual, 
    finalizarSesionActual, 
    recargar: cargarSesion 
  };
}