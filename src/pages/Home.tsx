import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import type { Cuota, Ficha, Sesion } from "../types";
import React from "react";
import Navbar from "../components/Navbar";
import CardMetric from "../components/CardMetric";

const Home: React.FC = () => {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fichasSnap, sesionesSnap, cuotasSnap] = await Promise.all([
          getDocs(collection(db, "fichas")),
          getDocs(collection(db, "sesiones")),
          getDocs(collection(db, "cuotas")),
        ]);

        setFichas(
          fichasSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Ficha, "id">) }))
        );
        setSesiones(
          sesionesSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Sesion, "id">) }))
        );
        setCuotas(
          cuotasSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Cuota, "id">) }))
        );
      } catch (error) {
        console.error("Error cargando datos del home:", error);
        setFichas([]);
        setSesiones([]);
        setCuotas([]);
      }
    };

    void loadData();
  }, []);

  const totalPendientes = useMemo(
    () => cuotas.filter((cuota) => cuota.estado === "pendiente").length,
    [cuotas]
  );

  const ingresosProyectados = useMemo(
    () =>
      new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(cuotas.reduce((acc, cuota) => acc + cuota.monto, 0)),
    [cuotas]
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <section className="p-6 space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">Home</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardMetric title="Fichas Activas" value={fichas.length} color="bg-blue-100" />
          <CardMetric title="Sesiones Programadas" value={sesiones.length} color="bg-purple-100" />
          <CardMetric title="Cuotas Pendientes" value={totalPendientes} color="bg-red-100" />
          <CardMetric title="Ingresos Proyectados" value={ingresosProyectados} color="bg-green-100" />
        </div>
      </section>

      <Navbar />
    </div>
  );
};

export default Home;
