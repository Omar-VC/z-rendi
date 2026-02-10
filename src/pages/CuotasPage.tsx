import { useMemo, useState } from "react";
import CuotaDetail from "../components/Cuotas/CuotaDetail";
import CuotaList from "../components/Cuotas/CuotaList";
import { cuotasIniciales } from "../data/mockData";
import type { Cuota } from "../types";

const CuotasPage = () => {
  const [cuotas, setCuotas] = useState<Cuota[]>(cuotasIniciales);
  const [selectedId, setSelectedId] = useState<string | null>(cuotasIniciales[0]?.id ?? null);

  const selectedCuota = useMemo(() => cuotas.find((c) => c.id === selectedId), [cuotas, selectedId]);

  const addDemoCuota = () => {
    const nuevaCuota: Cuota = {
      id: `c${Date.now()}`,
      atleta: "Cliente Demo",
      estado: "pendiente",
      fechaVencimiento: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString().slice(0, 10),
      monto: 35000,
    };
    setCuotas((prev) => [nuevaCuota, ...prev]);
    setSelectedId(nuevaCuota.id);
  };

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Cuotas</h2>
        <button className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white" type="button" onClick={addDemoCuota}>
          + Añadir demo
        </button>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        <CuotaList cuotas={cuotas} selectedId={selectedId} onSelect={setSelectedId} />
        <CuotaDetail cuota={selectedCuota} />
      </div>
    </section>
  );
};

export default CuotasPage;
