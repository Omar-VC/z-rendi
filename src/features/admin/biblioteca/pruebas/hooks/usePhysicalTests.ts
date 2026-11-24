import { useCallback, useEffect, useState } from "react";

import type { PhysicalTest } from "../types/physicalTest";

import { obtenerPruebas } from "../../../../../features/admin/biblioteca/pruebas/services/physicalTestsService";

type Props = {
  preparadorId: string;
};

export function usePhysicalTests({
  preparadorId,
}: Props) {
  const [pruebas, setPruebas] = useState<PhysicalTest[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarPruebas = useCallback(async () => {
    try {
      setLoading(true);

      const data = await obtenerPruebas(preparadorId);

      setPruebas(data);
    } finally {
      setLoading(false);
    }
  }, [preparadorId]);

  useEffect(() => {
    if (preparadorId) {
      cargarPruebas();
    }
  }, [preparadorId, cargarPruebas]);

  return {
    pruebas,
    loading,
    recargar: cargarPruebas,
  };
}
