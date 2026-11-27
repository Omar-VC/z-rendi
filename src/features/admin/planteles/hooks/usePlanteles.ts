import { useState, useEffect } from "react";
import type { Equipo } from "../types/plantel";
import { plantelesService } from "../services/planteles.service";
import { jugadoresService } from "../services/jugadores.service";

export function usePlanteles() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarEquipos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await plantelesService.obtenerEquipos();
      const conConteo = await Promise.all(
        data.map(async (eq) => ({
          ...eq,
          atletasCount: await jugadoresService.contar(eq.id!),
        })),
      );
      setEquipos(conConteo);
    } catch (err) {
      console.error("Error al cargar planteles:", err);
      setError("No se pudieron obtener los equipos.");
    } finally { // <-- Corregido aquí
      setLoading(false);
    }
  };

  const agregarEquipo = async (nuevoEquipo: Omit<Equipo, "id">) => {
    try {
      const id = await plantelesService.crearEquipo(nuevoEquipo);
      await cargarEquipos();
      return id;
    } catch (err) {
      console.error("Error al crear equipo:", err);
      throw err;
    }
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  return { equipos, loading, error, recargar: cargarEquipos, agregarEquipo };
}
