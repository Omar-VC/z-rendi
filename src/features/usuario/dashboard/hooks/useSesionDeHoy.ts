import { useEffect, useState } from "react";

import type { SesionPendiente } from "../../../admin/seguimiento/types/sesionPendiente";

import {
  obtenerSesionPendiente,
} from "../../../admin/seguimiento/services/sesionesPendientes.service";

export function useSesionDeHoy(sesionId: string) {
  const [sesion, setSesion] =
    useState<SesionPendiente | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargarSesion() {
      try {
        setLoading(true);
        setError(null);

        const resultado =
          await obtenerSesionPendiente(sesionId);

        if (!activo) return;

        if (!resultado) {
          setError("No se encontró la sesión.");
          setSesion(null);
          return;
        }

        setSesion(resultado);
      } catch (error) {
        console.error(error);

        if (!activo) return;

        setError(
          "No se pudo cargar la sesión."
        );
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    }

    cargarSesion();

    return () => {
      activo = false;
    };
  }, [sesionId]);

  return {
    sesion,
    loading,
    error,
  };
}