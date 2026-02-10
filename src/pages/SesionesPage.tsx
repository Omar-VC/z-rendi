import { useMemo, useState } from "react";
import SesionDetail from "../components/Sesiones/SesionDetail";
import SesionList from "../components/Sesiones/SesionList";
import { sesionesIniciales } from "../data/mockData";
import type { Sesion } from "../types";

const SesionesPage = () => {
  const [sesiones, setSesiones] = useState<Sesion[]>(sesionesIniciales);
  const [selectedId, setSelectedId] = useState<string | null>(sesionesIniciales[0]?.id ?? null);

  const selectedSesion = useMemo(() => sesiones.find((s) => s.id === selectedId), [sesiones, selectedId]);

  const addDemoSesion = () => {
    const nuevaSesion: Sesion = {
      id: `s${Date.now()}`,
      tipo: "tecnica",
      fecha: new Date().toISOString().slice(0, 10),
      atleta: "Nuevo Atleta",
      ejercicios: "Rondo + pases de precisión",
      cargas: "6 bloques de 5 minutos",
      observaciones: "Sesión cargada como ejemplo",
    };
    setSesiones((prev) => [nuevaSesion, ...prev]);
    setSelectedId(nuevaSesion.id);
  };

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Sesiones de entrenamiento</h2>
        <button className="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white" type="button" onClick={addDemoSesion}>
          + Añadir demo
        </button>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        <SesionList sesiones={sesiones} selectedId={selectedId} onSelect={setSelectedId} />
        <SesionDetail sesion={selectedSesion} />
      </div>
    </section>
  );
};

export default SesionesPage;
