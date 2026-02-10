import { useMemo, useState } from "react";
import FichaDetail from "../components/fichas/FichaDetail";
import FichaList from "../components/fichas/FichaList";
import { fichasIniciales } from "../data/mockData";
import type { Ficha } from "../types";

const FichasPage = () => {
  const [fichas, setFichas] = useState<Ficha[]>(fichasIniciales);
  const [selectedId, setSelectedId] = useState<string | null>(fichasIniciales[0]?.id ?? null);

  const selectedFicha = useMemo(() => fichas.find((f) => f.id === selectedId), [fichas, selectedId]);

  const addDemoAthlete = () => {
    const nuevaFicha: Ficha = {
      id: `f${Date.now()}`,
      nombre: "Nuevo",
      apellido: "Atleta",
      edad: 19,
      peso: 70,
      altura: 175,
      posicion: "Arquero",
      lesiones: "Sin historial",
      evaluacionInicial: "Test inicial pendiente",
      evaluacionActual: "Sin actualización",
    };
    setFichas((prev) => [nuevaFicha, ...prev]);
    setSelectedId(nuevaFicha.id);
  };

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Fichas de atletas</h2>
        <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white" type="button" onClick={addDemoAthlete}>
          + Añadir demo
        </button>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        <FichaList fichas={fichas} selectedId={selectedId} onSelect={setSelectedId} />
        <FichaDetail ficha={selectedFicha} />
      </div>
    </section>
  );
};

export default FichasPage;
