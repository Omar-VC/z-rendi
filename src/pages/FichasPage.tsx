import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import FichaDetail from "../components/fichas/FichaDetail";
import FichaList from "../components/fichas/FichaList";
import { fichasIniciales } from "../data/mockData";
import { db } from "../firebase";
import type { Ficha } from "../types";

type FichaForm = Omit<Ficha, "id">;

const initialForm: FichaForm = {
  nombre: "",
  apellido: "",
  edad: 18,
  peso: 70,
  altura: 170,
  posicion: "",
  lesiones: "",
  evaluacionInicial: "",
  evaluacionActual: "",
};

const FichasPage = () => {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FichaForm>(initialForm);

  const loadFichas = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "fichas"));
      const data = snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Ficha, "id">) }));
      setFichas(data);
      setSelectedId((current) => current ?? data[0]?.id ?? null);
      setError(null);
    } catch {
      setFichas(fichasIniciales);
      setSelectedId((current) => current ?? fichasIniciales[0]?.id ?? null);
      setError("No hay permisos en Firestore. Se muestran datos demo locales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFichas();
  }, []);

  const selectedFicha = useMemo(() => fichas.find((f) => f.id === selectedId), [fichas, selectedId]);

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
    if (!selectedFicha) return;
    const { id, ...values } = selectedFicha;
    setEditingId(id);
    setForm(values);
    setShowForm(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      if (editingId) {
        await updateDoc(doc(db, "fichas", editingId), form);
      } else {
        await addDoc(collection(db, "fichas"), form);
      }
      await loadFichas();
      resetForm();
    } catch {
      setError(editingId ? "No tenés permisos para editar fichas en Firestore." : "No tenés permisos para crear fichas en Firestore.");
    }
  };

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-slate-900">Fichas de atletas</h2>
        <div className="flex gap-2">
          <button className="rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60" type="button" onClick={startEdit} disabled={!selectedFicha}>
            Editar seleccionada
          </button>
          <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white" type="button" onClick={startCreate}>
            + Nueva ficha
          </button>
        </div>
      </header>

      {showForm && (
        <form className="rounded-lg border border-slate-200 bg-white p-4 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <input className="rounded border p-2" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))} required />
          <input className="rounded border p-2" placeholder="Apellido" value={form.apellido} onChange={(e) => setForm((p) => ({ ...p, apellido: e.target.value }))} required />
          <input className="rounded border p-2" type="number" min={1} placeholder="Edad" value={form.edad} onChange={(e) => setForm((p) => ({ ...p, edad: Number(e.target.value) }))} required />
          <input className="rounded border p-2" type="number" min={1} placeholder="Peso" value={form.peso} onChange={(e) => setForm((p) => ({ ...p, peso: Number(e.target.value) }))} required />
          <input className="rounded border p-2" type="number" min={1} placeholder="Altura" value={form.altura} onChange={(e) => setForm((p) => ({ ...p, altura: Number(e.target.value) }))} required />
          <input className="rounded border p-2" placeholder="Posición" value={form.posicion} onChange={(e) => setForm((p) => ({ ...p, posicion: e.target.value }))} required />
          <input className="rounded border p-2 md:col-span-2" placeholder="Lesiones" value={form.lesiones} onChange={(e) => setForm((p) => ({ ...p, lesiones: e.target.value }))} required />
          <textarea className="rounded border p-2" placeholder="Evaluación inicial" value={form.evaluacionInicial} onChange={(e) => setForm((p) => ({ ...p, evaluacionInicial: e.target.value }))} required />
          <textarea className="rounded border p-2" placeholder="Evaluación actual" value={form.evaluacionActual} onChange={(e) => setForm((p) => ({ ...p, evaluacionActual: e.target.value }))} required />

          <div className="md:col-span-2 flex gap-2 justify-end">
            <button type="button" className="rounded-md border border-slate-300 px-3 py-2 text-sm" onClick={resetForm}>Cancelar</button>
            <button type="submit" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">{editingId ? "Guardar cambios" : "Crear ficha"}</button>
          </div>
        </form>
      )}

      {loading && <p className="text-sm text-slate-600">Cargando fichas...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        <FichaList fichas={fichas} selectedId={selectedId} onSelect={setSelectedId} />
        <FichaDetail ficha={selectedFicha} />
      </div>
    </section>
  );
};

export default FichasPage;
