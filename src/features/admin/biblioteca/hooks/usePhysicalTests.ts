import { useEffect, useState } from "react";

import type { PhysicalTest } from "../types/physicalTest";

import { obtenerPruebas } from "../services/physicalTestsService";

type Props = {
  preparadorId: string;
};

export function usePhysicalTests({
  preparadorId,
}: Props) {
  const [pruebas, setPruebas] = useState<PhysicalTest[]>([]);
  const [loading, setLoading] = useState(true);

  async function cargarPruebas() {
    try {
      setLoading(true);

      const data = await obtenerPruebas(preparadorId);

      setPruebas(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (preparadorId) {
      cargarPruebas();
    }
  }, [preparadorId]);

  return {
    pruebas,
    loading,
    recargar: cargarPruebas,
  };
}