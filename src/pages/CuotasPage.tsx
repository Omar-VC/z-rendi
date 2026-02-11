import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import CuotaDetail from "../components/Cuotas/CuotaDetail";
import CuotaList from "../components/Cuotas/CuotaList";
import { cuotasIniciales } from "../data/mockData";
import { db } from "../firebase";
import type { Cuota, CuotaEstado } from "../types";

type CuotaForm = Omit<Cuota, "id">;

const initialForm: CuotaForm = {
  atleta: "",
  estado: "pendiente",
  fechaVencimiento: new Date().toISOString().slice(0, 10),
  monto: 35000,
  ultimoPago: "",
};

const CuotasPage = () => {
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CuotaForm>(initialForm);

  const loadCuotas = async () => {
    setLoading(true);

    try {
      const snapshot = await getDocs(collection(db, "cuotas"));
      const data = snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Cuota, "id">) }));
      setCuotas(data);
      setSelectedId((current) => current ?? data[0]?.id ?? null);
      setError(null);
    } catch {
      setCuotas(cuotasIniciales);
      setSelectedId((current) => current ?? cuotasIniciales[0]?.id ?? null);
      setError("No hay permisos en Firestore. Se muestran datos demo locales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCuotas();
  }, []);

  const selectedCuota = useMemo(() => cuotas.find((c) => c.id === selectedId), [cuotas, selectedId]);

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
    if (!selectedCuota) return;
    const { id, ...values } = selectedCuota;
    setEditingId(id);
    setForm({ ...values, ultimoPago: values.ultimoPago ?? "" });
    setShowForm(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const payload: CuotaForm = {
      ...form,
      ultimoPago: form.ultimoPago?.trim() ? form.ultimoPago : undefined,
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "cuotas", editingId), payload);
      } else {
        await addDoc(collection(db, "cuotas"), payload);
      }
      await loadCuotas();
      resetForm();
    } catch {
      setError(editingId ? "No tenés permisos para editar cuotas en Firestore." : "No tenés permisos para crear cuotas en Firestore.");
    }
  };

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-slate-900">Cuotas</h2>
        <div className="flex gap-2">
          <button className="rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60" type="button" onClick={startEdit} disabled={!selectedCuota}>
            Editar seleccionada
          </button>
          <button className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white" type="button" onClick={startCreate}>
            + Nueva cuota
          </button>
        </div>
      </header>

      {showForm && (
        <form className="rounded-lg border border-slate-200 bg-white p-4 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <input className="rounded border p-2" placeholder="Cliente / Atleta" value={form.atleta} onChange={(e) => setForm((p) => ({ ...p, atleta: e.target.value }))} required />
          <select className="rounded border p-2" value={form.estado} onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value as CuotaEstado }))}>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
          </select>
          <input className="rounded border p-2" type="date" value={form.fechaVencimiento} onChange={(e) => setForm((p) => ({ ...p, fechaVencimiento: e.target.value }))} required />
          <input className="rounded border p-2" type="number" min={0} value={form.monto} onChange={(e) => setForm((p) => ({ ...p, monto: Number(e.target.value) }))} required />
          <input className="rounded border p-2 md:col-span-2" type="date" value={form.ultimoPago ?? ""} onChange={(e) => setForm((p) => ({ ...p, ultimoPago: e.target.value }))} />

          <div className="md:col-span-2 flex gap-2 justify-end">
            <button type="button" className="rounded-md border border-slate-300 px-3 py-2 text-sm" onClick={resetForm}>Cancelar</button>
            <button type="submit" className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white">{editingId ? "Guardar cambios" : "Crear cuota"}</button>
          </div>
        </form>
      )}

      {loading && <p className="text-sm text-slate-600">Cargando cuotas...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        <CuotaList cuotas={cuotas} selectedId={selectedId} onSelect={setSelectedId} />
        <CuotaDetail cuota={selectedCuota} />
      </div>
    </section>
  );
};

export default CuotasPage;
