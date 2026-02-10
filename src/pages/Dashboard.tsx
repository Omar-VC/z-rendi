import { cuotasIniciales, fichasIniciales, sesionesIniciales } from "../data/mockData";

const Dashboard = () => {
  const totalPendientes = cuotasIniciales.filter((cuota) => cuota.estado === "pendiente").length;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Atletas activos</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{fichasIniciales.length}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Sesiones esta semana</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{sesionesIniciales.length}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Cuotas pendientes</p>
          <p className="mt-2 text-2xl font-bold text-amber-700">{totalPendientes}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Ingresos proyectados</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">
            ${cuotasIniciales.reduce((acc, cuota) => acc + cuota.monto, 0).toLocaleString("es-AR")}
          </p>
        </article>
      </div>
    </section>
  );
};

export default Dashboard;
