import { useEffect, useState } from "react";

import type { Planilla } from "../types";

import {
  subscribePlanillas,
  createPlanilla,
  removePlanilla,
} from "../services/seguimientoService";

export const useSeguimiento = () => {
  const [planillas, setPlanillas] =
    useState<Planilla[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const unsub = subscribePlanillas(
      setPlanillas
    );

    return () => unsub();
  }, []);

  const crearPlanilla = async (
    nombre: string
  ) => {
    setLoading(true);

    try {
      await createPlanilla(nombre);
    } catch (err) {
      console.error(
        "Error creando planilla:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const eliminarPlanilla = async (
    planillaId: string
  ) => {
    try {
      await removePlanilla(planillaId);
    } catch (err) {
      console.error(
        "Error eliminando planilla:",
        err
      );
    }
  };

  return {
    planillas,
    crearPlanilla,
    eliminarPlanilla,
    loading,
  };
};