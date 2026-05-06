import { useEffect, useState } from "react";
import type { Ficha } from "../types";
import {
  getFichasByCliente,
  createFicha,
  editFicha,
  removeFicha,
} from "../services/fichasService";

export function useFichas(clienteId: string) {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const data = await getFichasByCliente(clienteId);
        setFichas(data);
      } catch (err) {
        console.error("Error cargando fichas:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchFichas();
  }, [clienteId]);

  const addFicha = async (nuevaFicha: Omit<Ficha, "id">) => {
    const created = await createFicha({
      ...nuevaFicha,
      clienteId,
    });

    setFichas((prev) => [...prev, created]);
  };

  const updateFicha = async (fichaId: string, data: Partial<Ficha>) => {
    await editFicha(fichaId, data);

    setFichas((prev) =>
      prev.map((f) =>
        f.id === fichaId ? { ...f, ...data } : f
      )
    );
  };

  const deleteFicha = async (fichaId: string) => {
    await removeFicha(fichaId);

    setFichas((prev) =>
      prev.filter((f) => f.id !== fichaId)
    );
  };

  return {
    fichas,
    loading,
    addFicha,
    updateFicha,
    deleteFicha,
  };
}