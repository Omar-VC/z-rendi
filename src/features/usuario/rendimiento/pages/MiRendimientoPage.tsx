import { useAuth } from "../../../../auth/useAuth";
import { useBarreras } from "../../../admin/seguimiento/hooks/useBarreras";
import { Link } from "react-router-dom";

function IconoRendimiento() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
      <path d="M4 19V5m0 14h16M8 15l3-4 3 2 5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 6h3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoObjetivos() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path d="M12 3.5 14.6 9l5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8L12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function IconoHitos() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function tiempoActualizacion(valor: unknown): number {
  if (valor instanceof Date) return valor.getTime();
  if (valor && typeof valor === "object" && "toDate" in valor && typeof valor.toDate === "function") {
    return valor.toDate().getTime();
  }
  return 0;
}

export default function MiRendimientoPage() {
  const { user } = useAuth();
  const { barreras, loading } = useBarreras(user?.uid ?? "");

  const pendientes = barreras.filter((barrera) => barrera.estado === "pendiente");
  const superadas = barreras.filter((barrera) => barrera.estado === "superada");
  const recientes = [...pendientes]
    .sort((a, b) => {
      return tiempoActualizacion(b.updatedAt) - tiempoActualizacion(a.updatedAt);
    })
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8 animate-fadeIn sm:space-y-7">
      <header className="group relative isolate flex min-h-[24rem] items-end overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-[0_24px_70px_-30px_rgba(16,185,129,0.3)] sm:min-h-[21rem] sm:rounded-[2rem]">
        <img
          src="/images/performance.webp"
          alt="Barra con discos en un gimnasio"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[64%_center] transition-transform duration-700 group-hover:scale-[1.02] sm:object-center"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_12%,rgba(16,185,129,0.2),transparent_42%),linear-gradient(0deg,rgba(7,12,17,0.98)_0%,rgba(7,12,17,0.78)_42%,rgba(7,12,17,0.18)_100%)] sm:bg-[radial-gradient(ellipse_at_78%_12%,rgba(16,185,129,0.18),transparent_42%),linear-gradient(90deg,rgba(7,12,17,0.97)_0%,rgba(7,12,17,0.82)_39%,rgba(7,12,17,0.12)_100%)]" />
        <div className="absolute inset-0 -z-10 rounded-[inherit] ring-1 ring-inset ring-white/10" />
        <div className="w-full p-5 pb-6 sm:p-9 sm:pb-9">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/25 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100 shadow-lg backdrop-blur-md sm:mb-4 sm:text-xs">
              <IconoRendimiento /> Tu evolución
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white [text-shadow:0_3px_24px_rgba(0,0,0,0.65)] sm:text-5xl">Mi rendimiento</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)] sm:text-base">
              Tus objetivos, pruebas y avances, reunidos en un solo lugar. Cada hito cuenta en tu progreso.
            </p>
          </div>
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/30 px-3.5 py-2.5 text-xs text-white/80 shadow-lg backdrop-blur-md sm:absolute sm:right-7 sm:top-7 sm:mt-0 sm:px-4 sm:py-3 sm:text-sm">
            <span className={`h-2 w-2 rounded-full ${loading ? "animate-pulse bg-amber-300" : "bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]"}`} />
            <span>{loading ? "Actualizando tus datos…" : "Seguimiento de tus barreras"}</span>
          </div>
        </div>
      </header>

      <section aria-label="Resumen de barreras" className="grid gap-4 sm:grid-cols-2">
        <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-surface via-surface to-primary/[0.08] p-5 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-xl sm:p-6">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />
          <div className="relative flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Objetivos activos</p>
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary"><IconoObjetivos /></span>
          </div>
          <div className="relative mt-3 flex items-end justify-between gap-3">
            <strong className="text-4xl font-black tabular-nums text-text">{loading ? "—" : pendientes.length}</strong>
            <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Por alcanzar</span>
          </div>
          <p className="relative mt-2 text-sm text-muted">Metas que están en curso ahora.</p>
        </article>

        <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-surface via-surface to-emerald-400/[0.07] p-5 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/20 hover:shadow-xl sm:p-6">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl transition group-hover:bg-emerald-400/20" />
          <div className="relative flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Hitos superados</p>
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-300/15 bg-emerald-300/10 text-emerald-300"><IconoHitos /></span>
          </div>
          <div className="relative mt-3 flex items-end justify-between gap-3">
            <strong className="text-4xl font-black tabular-nums text-text">{loading ? "—" : superadas.length}</strong>
            <span className="rounded-full border border-emerald-300/15 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">Registrados</span>
          </div>
          <p className="relative mt-2 text-sm text-muted">Barreras que ya alcanzaste.</p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-surface to-surface/80 p-5 shadow-xl sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.7)]" /> En seguimiento</p>
            <h2 className="mt-1 text-xl font-extrabold text-text">Tus próximos objetivos</h2>
          </div>
          {!loading && <span className="text-xs font-medium text-muted">{pendientes.length} activos</span>}
        </div>

        {loading ? (
          <div className="mt-5 space-y-3" aria-label="Cargando objetivos">
            {[0, 1, 2].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-surfaceSoft/50" />)}
          </div>
        ) : recientes.length > 0 ? (
          <ul className="mt-5 divide-y divide-white/[0.07]">
            {recientes.map((barrera) => (
              <li key={barrera.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-background/40 text-primary"><IconoRendimiento /></span>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-text">{barrera.ejercicioNombre || barrera.nombre}</p>
                    <p className="mt-1 truncate text-xs text-muted">{barrera.categoria || "Prueba"}{barrera.subcategoria ? ` · ${barrera.subcategoria}` : ""}</p>
                  </div>
                </div>
                <span className="w-fit rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-bold text-primary shadow-[0_4px_20px_-10px_rgba(16,185,129,0.7)] sm:ml-4">Objetivo · {barrera.objetivo}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-white/15 bg-background/20 px-5 py-8 text-center">
            <p className="font-semibold text-text">Todavía no tenés objetivos activos</p>
            <p className="mt-1 text-sm text-muted">Cuando tu preparador agregue una barrera, la vas a encontrar acá.</p>
          </div>
        )}
      </section>

      <Link to="/cliente/running" className="group flex flex-col gap-3 rounded-2xl border border-emerald-300/15 bg-gradient-to-r from-emerald-400/[0.09] via-surface to-surface p-5 shadow-lg transition hover:border-emerald-300/30 hover:shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-emerald-300/15 bg-emerald-300/10 text-2xl" aria-hidden="true">🏃</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">También a tu ritmo</p>
            <p className="mt-1 font-bold text-text">¿Salís a correr? Registrá tus distancias</p>
            <p className="mt-1 text-sm text-muted">Tu espacio personal de running está acá.</p>
          </div>
        </div>
        <span className="pl-16 text-sm font-bold text-emerald-300 transition group-hover:translate-x-1 sm:pl-0">Ir a Running <span aria-hidden="true">→</span></span>
      </Link>

      <p className="text-center text-xs leading-5 text-muted/80">
        Los niveles y gráficos de fuerza, velocidad y resistencia se incorporarán en próximas etapas, usando tus registros de entrenamiento.
      </p>
    </div>
  );
}
