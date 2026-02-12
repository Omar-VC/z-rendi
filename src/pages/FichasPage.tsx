import { doc, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import { type FormEvent, useEffect, useState } from "react";
import FichaDetail from "../components/fichas/FichaDetail";
import { fichasIniciales } from "../data/mockData";
import { auth, db } from "../firebase";
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
  const [ficha, setFicha] = useState<Ficha | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FichaForm>(initialForm);

  const borrarFicha = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await deleteDoc(doc(db, "fichas", user.uid));
      setFicha(undefined);
    } catch {
      setError("No tenés permisos para borrar fichas en Firestore.");
    }
  };

  const loadFicha = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("No hay usuario logueado.");
        return;
      }

      const docRef = doc(db, "fichas", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...(docSnap.data() as Omit<Ficha, "id">) };
        setFicha(data);
        setError(null);
      } else {
        setError("No existe ficha para este usuario.");
      }
    } catch {
      setFicha(fichasIniciales[0] ?? undefined);
      setError("No hay permisos en Firestore. Se muestran datos demo locales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFicha();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setShowForm(false);
  };

  const startCreateOrEdit = () => {
    if (ficha) {
      const { id, ...values } = ficha;
      setForm(values);
    } else {
      setForm(initialForm);
    }
    setShowForm(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      // usamos setDoc para crear o actualizar directamente en el doc con el UID
      await setDoc(doc(db, "fichas", user.uid), form);
      await loadFicha();
      resetForm();
    } catch {
      setError("No tenés permisos para crear/editar fichas en Firestore.");
    }
  };

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-slate-900">Mi ficha</h2>
        <div className="flex gap-2">
          <button
            className="rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-white"
            type="button"
            onClick={startCreateOrEdit}
          >
            {ficha ? "Editar ficha" : "Crear ficha"}
          </button>
          {ficha && (
            <button
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white"
              type="button"
              onClick={borrarFicha}
            >
              Borrar ficha
            </button>
          )}
        </div>
      </header>

      {showForm && (
        <form
          className="rounded-lg border border-slate-200 bg-white p-4 grid gap-3 md:grid-cols-2"
          onSubmit={handleSubmit}
        >
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
            <button type="submit" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">{ficha ? "Guardar cambios" : "Crear ficha"}</button>
          </div>
        </form>
      )}

      {loading && <p className="text-sm text-slate-600">Cargando ficha...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <FichaDetail ficha={ficha} />
    </section>
  );
};

export default FichasPage;
