import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import type { Cuota, Ficha, Sesion } from "../types";
import React from "react";
import CardMetric from "../components/CardMetric";

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
}

const Home: React.FC = () => {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          fichasSnap,
          sesionesSnap,
          cuotasSnap,
          clientesSnap,
        ] = await Promise.all([
          getDocs(collection(db, "fichas")),
          getDocs(collection(db, "sesiones")),
          getDocs(collection(db, "cuotas")),
          getDocs(collection(db, "usuarios")),
        ]);

        setFichas(
          fichasSnap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Ficha, "id">),
          }))
        );

        setSesiones(
          sesionesSnap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Sesion, "id">),
          }))
        );

        setCuotas(
          cuotasSnap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Cuota, "id">),
          }))
        );

        setClientes(
          clientesSnap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Cliente, "id">),
          }))
        );
      } catch (error) {
        console.error("Error cargando datos del home:", error);
      }
    };

    void loadData();
  }, []);

  // 📅 Mes actual
  const fechaActual = new Date();
  const mesActual = fechaActual.toLocaleString("es-AR", { month: "long" });
  const mesActualCapitalizado =
    mesActual.charAt(0).toUpperCase() + mesActual.slice(1);

  // 📊 Cuotas del mes actual
  const cuotasMes = useMemo(
    () => cuotas.filter((c) => c.mes === mesActualCapitalizado),
    [cuotas, mesActualCapitalizado]
  );

  // 📊 Clientes con cuota este mes
  const clientesConCuota = useMemo(
    () => new Set(cuotasMes.map((c) => c.clienteId)),
    [cuotasMes]
  );

  // 📊 Métricas
  const clientesTotales = clientes.length;

  const clientesAlDia = cuotasMes.filter((c) => c.estado === "pagada").length;

  const clientesAtrasados = cuotasMes.filter(
    (c) => c.estado !== "pagada"
  ).length;

  const clientesSinCuota = clientesTotales - clientesConCuota.size;

  const ingresoMensualEsperado = useMemo(() => {
    if (cuotas.length === 0) return 0;
    const montoBase = cuotas[0].monto || 0;
    return clientesTotales * montoBase;
  }, [clientesTotales, cuotas]);

  const ingresoMesActual = useMemo(
    () =>
      cuotasMes
        .filter((c) => c.estado === "pagada")
        .reduce((acc, c) => acc + c.monto, 0),
    [cuotasMes]
  );

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <section className="p-6 space-y-6 flex-1">
        <h2
          className="text-3xl font-bold border-b pb-2"
          style={{ color: "var(--text)", borderColor: "var(--border)" }}
        >
          Dashboard
        </h2>

        {/* 🔹 TARJETA RESUMEN */}
        <div
          className="rounded-xl p-6 border shadow-lg space-y-4"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="text-lg font-semibold">Resumen del negocio</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>Clientes: {clientesTotales}</div>
            <div>
              Ingreso total esperado: {formatMoney(ingresoMensualEsperado)}
            </div>

            <div className="text-green-400">
              ✔ Al día: {clientesAlDia}
            </div>

            <div className="text-red-400">
              ⚠ Atrasados: {clientesAtrasados}
            </div>

            <div className="text-yellow-400">
              ⛔ Sin cuota del mes: {clientesSinCuota}
            </div>

            <div className="font-bold text-blue-400">
              💰 Ingreso del mes: {formatMoney(ingresoMesActual)}
            </div>
          </div>
        </div>

        {/* 🔹 MÉTRICAS SECUNDARIAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardMetric title="Fichas Activas" value={fichas.length} />
          <CardMetric title="Sesiones Programadas" value={sesiones.length} />
          <CardMetric
            title="Cuotas Pendientes"
            value={clientesAtrasados + clientesSinCuota}
            variant="danger"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;