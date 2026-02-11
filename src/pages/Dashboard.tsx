import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { cuotasIniciales, fichasIniciales, sesionesIniciales } from "../data/mockData";
import { db } from "../firebase";
import type { Cuota, Ficha, Sesion } from "../types";

const Dashboard = () => {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [fichasSnap, sesionesSnap, cuotasSnap] = await Promise.all([
          getDocs(collection(db, "fichas")),
          getDocs(collection(db, "sesiones")),
          getDocs(collection(db, "cuotas")),
        ]);

        setFichas(fichasSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Ficha, "id">) })));
        setSesiones(sesionesSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Sesion, "id">) })));
        setCuotas(cuotasSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Cuota, "id">) })));
      } catch {
        setFichas(fichasIniciales);
        setSesiones(sesionesIniciales);
        setCuotas(cuotasIniciales);
      }
    };

    void loadDashboard();
  }, []);

  const totalPendientes = useMemo(() => cuotas.filter((cuota) => cuota.estado === "pendiente").length, [cuotas]);
  const ingresosProyectados = useMemo(() => cuotas.reduce((acc, cuota) => acc + cuota.monto, 0), [cuotas]);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Atletas activos</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{fichas.length}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Sesiones registradas</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{sesiones.length}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Cuotas pendientes</p>
          <p className="mt-2 text-2xl font-bold text-amber-700">{totalPendientes}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Ingresos proyectados</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">${ingresosProyectados.toLocaleString("es-AR")}</p>
        </article>
      </div>
    </section>
  );
};

export default Dashboard;
