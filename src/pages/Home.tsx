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
        const [fichasSnap, sesionesSnap, cuotasSnap, clientesSnap] =
          await Promise.all([
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

  const fechaActual = new Date();
  const mesActual = fechaActual.toLocaleString("es-AR", { month: "long" });
  const mesActualCapitalizado =
    mesActual.charAt(0).toUpperCase() + mesActual.slice(1);

  const cuotasMes = useMemo(
    () => cuotas.filter((c) => c.mes === mesActualCapitalizado),
    [cuotas, mesActualCapitalizado]
  );

  const clientesConCuota = useMemo(
    () => new Set(cuotasMes.map((c) => c.clienteId)),
    [cuotasMes]
  );

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
      <section className="p-4 md:p-6 space-y-4 md:space-y-6 flex-1">
        <h2
          className="text-2xl md:text-3xl font-bold border-b pb-2"
          style={{ color: "var(--text)", borderColor: "var(--border)" }}
        >
          Dashboard
        </h2>

        {/* resumen */}
        <div
          className="rounded-xl p-4 md:p-6 border shadow-lg space-y-3 md:space-y-4"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="text-base md:text-lg font-semibold">
            Resumen del negocio
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-sm">
            <div>Clientes: {clientesTotales}</div>
            <div>
              Ingreso esperado: {formatMoney(ingresoMensualEsperado)}
            </div>

            <div className="text-green-400">
              ✔ Al día: {clientesAlDia}
            </div>

            <div className="text-red-400">
              ⚠ Atrasados: {clientesAtrasados}
            </div>

            <div className="text-yellow-400">
              ⛔ Sin cuota: {clientesSinCuota}
            </div>

            <div className="font-bold text-blue-400">
              💰 Ingreso mes: {formatMoney(ingresoMesActual)}
            </div>
          </div>
        </div>

        {/* métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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