import { useEffect, useMemo, useState, type FormEvent } from "react";

import { useAuth } from "../../../../auth/useAuth";
import { guardarMarcaRunning, obtenerMarcasRunning } from "../services/marcasRunning.service";
import type { MarcaRunning } from "../types/marcaRunning";

function hoyISO() {
  const ahora = new Date();
  const local = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function formatoRitmo(marca: MarcaRunning) {
  const segundosPorKm = Math.round((marca.duracionMinutos * 60) / marca.distanciaKm);
  const minutos = Math.floor(segundosPorKm / 60);
  const segundos = segundosPorKm % 60;
  return `${minutos}:${String(segundos).padStart(2, "0")}`;
}

function formatoFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeZone: "UTC" })
    .format(new Date(`${fecha}T12:00:00Z`));
}

export default function RunningTracker() {
  const { user } = useAuth();
  const [marcas, setMarcas] = useState<MarcaRunning[]>([]);
  const [fecha, setFecha] = useState(hoyISO);
  const [distanciaKm, setDistanciaKm] = useState("");
  const [duracionMinutos, setDuracionMinutos] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let activa = true;
    if (!user?.uid) {
      setCargando(false);
      return () => { activa = false; };
    }

    obtenerMarcasRunning(user.uid)
      .then((datos) => { if (activa) setMarcas(datos); })
      .catch(() => { if (activa) setError("No se pudieron cargar tus registros."); })
      .finally(() => { if (activa) setCargando(false); });

    return () => { activa = false; };
  }, [user?.uid]);

  const ordenadas = useMemo(
    () => [...marcas].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.creadaEn.localeCompare(a.creadaEn)),
    [marcas],
  );

  async function registrar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user?.uid) return;

    const distancia = Number(distanciaKm);
    const duracion = Number(duracionMinutos);
    if (!Number.isFinite(distancia) || distancia <= 0 || distancia > 500 ||
        !Number.isFinite(duracion) || duracion <= 0 || duracion > 1440 || !fecha) {
      setError("Ingresá una distancia y duración válidas.");
      return;
    }

    const marca: MarcaRunning = {
      id: crypto.randomUUID(),
      distanciaKm: Math.round(distancia * 100) / 100,
      duracionMinutos: Math.round(duracion * 100) / 100,
      fecha,
      creadaEn: new Date().toISOString(),
    };

    setGuardando(true);
    setError("");
    try {
      await guardarMarcaRunning(user.uid, marca);
      setMarcas((actuales) => [...actuales, marca]);
      setDistanciaKm("");
      setDuracionMinutos("");
      setFecha(hoyISO());
    } catch {
      setError("No se pudo guardar la marca. Probá nuevamente.");
    } finally {
      setGuardando(false);
    }
  }

  const distanciaMasLarga = marcas.reduce((max, marca) => Math.max(max, marca.distanciaKm), 0);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-surface/85 shadow-xl">
      <div className="border-b border-white/[0.07] bg-gradient-to-r from-emerald-500/[0.08] to-transparent p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-300">Tu espacio personal</p>
            <h2 className="mt-1 text-xl font-extrabold text-text">Running</h2>
            <p className="mt-1 text-sm text-muted">¿Salís a correr? Registrá tus marcas y seguí tu propio progreso.</p>
          </div>
          <div className="rounded-xl border border-emerald-300/15 bg-emerald-300/[0.07] px-4 py-3 text-right">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">Distancia más larga</span>
            <strong className="mt-1 block text-xl font-black tabular-nums text-emerald-300">{distanciaMasLarga ? `${distanciaMasLarga} km` : "—"}</strong>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={registrar} className="space-y-4">
          <div>
            <h3 className="font-bold text-text">Registrar una salida</h3>
            <p className="mt-1 text-xs text-muted">La duración nos permite calcular tu ritmo promedio.</p>
          </div>
          <label className="block space-y-1.5 text-xs font-semibold text-muted">
            Fecha
            <input type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} className="[color-scheme:dark] w-full rounded-xl border border-white/10 bg-background/60 px-3 py-2.5 text-sm text-text outline-none accent-emerald-300 focus:border-emerald-300/50" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1.5 text-xs font-semibold text-muted">
              Distancia
              <div className="flex items-center rounded-xl border border-white/10 bg-background/60 focus-within:border-emerald-300/50">
                <input type="number" min="0.01" max="500" step="0.01" required inputMode="decimal" placeholder="5" value={distanciaKm} onChange={(e) => setDistanciaKm(e.target.value)} className="min-w-0 w-full bg-transparent px-3 py-2.5 text-sm text-text outline-none placeholder:text-muted/50" />
                <span className="pr-3 text-xs text-muted">km</span>
              </div>
            </label>
            <label className="block space-y-1.5 text-xs font-semibold text-muted">
              Duración
              <div className="flex items-center rounded-xl border border-white/10 bg-background/60 focus-within:border-emerald-300/50">
                <input type="number" min="0.1" max="1440" step="0.1" required inputMode="decimal" placeholder="30" value={duracionMinutos} onChange={(e) => setDuracionMinutos(e.target.value)} className="min-w-0 w-full bg-transparent px-3 py-2.5 text-sm text-text outline-none placeholder:text-muted/50" />
                <span className="pr-3 text-xs text-muted">min</span>
              </div>
            </label>
          </div>
          {error && <p role="alert" className="text-xs font-medium text-red-300">{error}</p>}
          <button type="submit" disabled={guardando || !user?.uid} className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60">
            {guardando ? "Guardando…" : "Guardar marca"}
          </button>
        </form>

        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-text">Tus salidas</h3>
              <p className="mt-1 text-xs text-muted">Distancia, ritmo y duración registrados.</p>
            </div>
            <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-muted">{marcas.length} {marcas.length === 1 ? "salida" : "salidas"}</span>
          </div>
          {cargando ? (
            <div className="mt-4 h-28 animate-pulse rounded-xl bg-surfaceSoft/40" />
          ) : ordenadas.length ? (
            <ul className="mt-3 divide-y divide-white/[0.07]">
              {ordenadas.slice(0, 5).map((marca) => (
                <li key={marca.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-bold text-text">{marca.distanciaKm} km <span className="font-normal text-muted">· {formatoRitmo(marca)} /km</span></p>
                    <p className="mt-0.5 text-xs text-muted">{formatoFecha(marca.fecha)} · {marca.duracionMinutos} min</p>
                  </div>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-300" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-white/15 px-4 py-7 text-center">
              <p className="text-sm font-semibold text-text">Todavía no registraste salidas</p>
              <p className="mt-1 text-xs text-muted">Tu primera marca va a aparecer acá.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
