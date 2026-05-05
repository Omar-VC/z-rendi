import { useEffect, useState } from "react";
import type { Cuota } from "../types";
import {
  subscribeCuotas,
  addCuota as addService,
  updateCuota as updateService,
  deleteCuota as deleteService,
} from "../services/cuotas.service";

export function useCuotas(clienteId: string) {
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeCuotas(clienteId, (data) => {
      setCuotas(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clienteId]);

  const addCuota = (nuevaCuota: Omit<Cuota, "id" | "clienteId">) => {
    return addService(clienteId, nuevaCuota);
  };

  const updateCuota = (cuotaId: string, data: Partial<Cuota>) => {
    return updateService(cuotaId, data);
  };

  const deleteCuota = (cuotaId: string) => {
    return deleteService(cuotaId);
  };

  return { cuotas, loading, addCuota, updateCuota, deleteCuota };
}