import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import SesionDetail from "../components/Sesiones/SesionDetail";
import SesionList from "../components/Sesiones/SesionList";
import { sesionesIniciales } from "../data/mockData";
import { db } from "../firebase";
import type { Sesion, SesionTipo } from "../types";

type SesionForm = Omit<Sesion, "id">;

const initialForm: SesionForm = {
  tipo: "fuerza",
  fecha: new Date().toISOString().slice(0, 10),
  atleta: "",
  ejercicios: "",
  cargas: "",
  observaciones: "",
};

const SesionesPage = () => {
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SesionForm>(initialForm);

  const loadSesiones = async () => {
    setLoading(true);

    try {
      const snapshot = await getDocs(collection(db, "sesiones"));
      const data = snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Sesion, "id">) }));
      setSesiones(data);
      setSelectedId((current) => current ?? data[0]?.id ?? null);
      setError(null);
    } catch {
      setSesiones(sesionesIniciales);
      setSelectedId((current) => current ?? sesionesIniciales[0]?.id ?? null);
      setError("No hay permisos en Firestore. Se muestran datos demo locales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSesiones();
  }, []);

  const selectedSesion = useMemo(() => sesiones.find((s) => s.id === selectedId), [sesiones, selectedId]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const startEdit = () => {
    if (!selectedSesion) return;
    const { id, ...values } = selectedSesion;
    setEditingId(id);
    setForm(values);
    setShowForm(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      if (editingId) {
        await updateDoc(doc(db, "sesiones", editingId), form);
      } else {
        await addDoc(collection(db, "sesiones"), form);
      }
      await loadSesiones();
      resetForm();
    } catch {
      setError(editingId ? "No tenés permisos para editar sesiones en Firestore." : "No tenés permisos para crear sesiones en Firestore.");
    }
  };

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-slate-900">Sesiones de entrenamiento</h2>
        <div className="flex gap-2">
          <button className="rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60" type="button" onClick={startEdit} disabled={!selectedSesion}>
            Editar seleccionada
          </button>
          <button className="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white" type="button" onClick={startCreate}>
            + Nueva sesión
          </button>
        </div>
      </header>

      {showForm && (
        <form className="rounded-lg border border-slate-200 bg-white p-4 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <input className="rounded border p-2" placeholder="Atleta" value={form.atleta} onChange={(e) => setForm((p) => ({ ...p, atleta: e.target.value }))} required />
          <select className="rounded border p-2" value={form.tipo} onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as SesionTipo }))}>
            <option value="fuerza">Fuerza</option>
            <option value="resistencia">Resistencia</option>
            <option value="tecnica">Técnica</option>
            <option value="recuperacion">Recuperación</option>
          </select>
          <input className="rounded border p-2" type="date" value={form.fecha} onChange={(e) => setForm((p) => ({ ...p, fecha: e.target.value }))} required />
          <input className="rounded border p-2" placeholder="Cargas" value={form.cargas} onChange={(e) => setForm((p) => ({ ...p, cargas: e.target.value }))} required />
          <textarea className="rounded border p-2" placeholder="Ejercicios" value={form.ejercicios} onChange={(e) => setForm((p) => ({ ...p, ejercicios: e.target.value }))} required />
          <textarea className="rounded border p-2" placeholder="Observaciones" value={form.observaciones} onChange={(e) => setForm((p) => ({ ...p, observaciones: e.target.value }))} required />

          <div className="md:col-span-2 flex gap-2 justify-end">
            <button type="button" className="rounded-md border border-slate-300 px-3 py-2 text-sm" onClick={resetForm}>Cancelar</button>
            <button type="submit" className="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white">{editingId ? "Guardar cambios" : "Crear sesión"}</button>
          </div>
        </form>
      )}

      {loading && <p className="text-sm text-slate-600">Cargando sesiones...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        <SesionList sesiones={sesiones} selectedId={selectedId} onSelect={setSelectedId} />
        <SesionDetail sesion={selectedSesion} />
      </div>
    </section>
  );
};

export default SesionesPage;
