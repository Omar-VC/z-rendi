import { useEffect, useMemo, useState } from "react";

import { Card, Badge } from "../../../../shared/ui";

import type { SesionEntrenamiento } from "../types/seguimiento";
import type { Barrera } from "../types/barrera";
import type { BloqueSesion } from "../types/bloqueSesion";
import type { RegistroEjercicio } from "../types/registroEjercicio";

import { obtenerSesionesCliente } from "../services/seguimientoService";
import { obtenerBarreras } from "../services/barrerasService";
import { obtenerUltimosRegistros } from "../services/registrosEjercicio.service";

// Umbrales del semáforo (ajustables)
const RATIO_ROJO = 1.5;
const RATIO_AMARILLO = 1.3;
const RATIO_BAJO = 0.8;

const DIA = 24 * 60 * 60 * 1000;

type Props = {
  clienteId: string;
  bloques: BloqueSesion[];
  abiertaInicial?: boolean;
};

type Semaforo = {
  variant: "success" | "warning" | "danger" | "info" | "neutral";
  texto: string;
};

function inicioDia(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function diasDesde(fecha: Date) {
  return Math.round(
    (inicioDia(new Date()).getTime() - inicioDia(fecha).getTime()) / DIA,
  );
}

function textoHace(dias: number) {
  if (dias <= 0) return "hoy";
  if (dias === 1) return "ayer";
  return `hace ${dias} días`;
}

export default function FichaDecision({
  clienteId,
  bloques,
  abiertaInicial = false,
}: Props) {
  const [abierta, setAbierta] = useState(abiertaInicial);
  const [cargando, setCargando] = useState(true);
  const [sesiones, setSesiones] = useState<SesionEntrenamiento[]>([]);
  const [barreras, setBarreras] = useState<Barrera[]>([]);
  const [ultimos, setUltimos] = useState<Record<string, RegistroEjercicio>>({});

  // Sesiones de los últimos 35 días + barreras
  useEffect(() => {
    let activo = true;

    async function cargar() {
      setCargando(true);

      const hoy = new Date();
      const desde = new Date(hoy.getTime() - 35 * DIA);
      const hasta = new Date(hoy.getTime() + 2 * DIA);

      const [resSesiones, resBarreras] = await Promise.allSettled([
        obtenerSesionesCliente(clienteId, desde, hasta),
        obtenerBarreras(clienteId),
      ]);

      if (!activo) return;

      if (resSesiones.status === "fulfilled") setSesiones(resSesiones.value);
      else console.error("Ficha: error cargando sesiones", resSesiones.reason);

      if (resBarreras.status === "fulfilled") setBarreras(resBarreras.value);
      else console.error("Ficha: error cargando barreras", resBarreras.reason);

      setCargando(false);
    }

    cargar();
    return () => {
      activo = false;
    };
  }, [clienteId]);

  // Últimos pesos de los ejercicios que se van armando en el formulario
  const ejerciciosForm = useMemo(() => {
    const mapa = new Map<string, string>();
    bloques.forEach((b) =>
      b.ejercicios.forEach((e) => mapa.set(e.ejercicioId, e.nombre)),
    );
    return Array.from(mapa, ([id, nombre]) => ({ id, nombre }));
  }, [bloques]);

  const idsKey = ejerciciosForm
    .map((e) => e.id)
    .sort()
    .join("|");

  useEffect(() => {
    let activo = true;
    if (!idsKey) {
      setUltimos({});
      return;
    }

    obtenerUltimosRegistros(clienteId, idsKey.split("|"))
      .then((res) => {
        if (activo) setUltimos(res);
      })
      .catch((e) => console.error("Ficha: error cargando pesos", e));

    return () => {
      activo = false;
    };
  }, [clienteId, idsKey]);

  // Análisis de carga: últimos 7 días vs promedio semanal de los 28 días previos
  const analisis = useMemo(() => {
    let aguda = 0;
    let cronicaTotal = 0;
    let masAntiguo = 0;

    sesiones.forEach((s) => {
      const d = diasDesde(s.fecha);
      if (d < 0) return;
      if (d <= 6) aguda += s.carga || 0;
      else if (d <= 34) cronicaTotal += s.carga || 0;
      masAntiguo = Math.max(masAntiguo, d);
    });

    const cronicaSemanal = cronicaTotal / 4;
    const ratio = cronicaSemanal > 0 ? aguda / cronicaSemanal : null;

    let semaforo: Semaforo;
    if (sesiones.length === 0) {
      semaforo = { variant: "neutral", texto: "Sin historial" };
    } else if (ratio === null) {
      semaforo = { variant: "neutral", texto: "Sin base para comparar" };
    } else if (ratio > RATIO_ROJO) {
      semaforo = { variant: "danger", texto: "Carga muy por encima de su base" };
    } else if (ratio > RATIO_AMARILLO) {
      semaforo = { variant: "warning", texto: "Carga en aumento" };
    } else if (ratio < RATIO_BAJO) {
      semaforo = { variant: "info", texto: "Carga por debajo de su base" };
    } else {
      semaforo = { variant: "success", texto: "Carga estable" };
    }

    return {
      aguda: Math.round(aguda),
      cronicaSemanal: Math.round(cronicaSemanal),
      ratio,
      semaforo,
      baseCorta: masAntiguo < 14,
    };
  }, [sesiones]);

  const ultima = sesiones[0];
  const diasUltima = ultima ? diasDesde(ultima.fecha) : null;
  const barrerasActivas = barreras.filter((b) => b.estado !== "superada");

  return (
    <Card className="!p-0 bg-surfaceSoft/60 border-primary/20 rounded-xl overflow-hidden">
      {/* CABECERA PLEGABLE */}
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left focus:outline-none"
      >
        <div className="min-w-0 space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Estado del atleta
          </span>

          {cargando ? (
            <p className="text-xs text-muted animate-pulse">Analizando...</p>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={analisis.semaforo.variant} className="text-[10px] px-2 py-0.5 font-bold">
                {analisis.semaforo.texto}
              </Badge>
              {ultima && diasUltima !== null && (
                <span className="text-[11px] text-muted">
                  Última sesión {textoHace(diasUltima)} · RPE {ultima.rpe}
                </span>
              )}
              {barrerasActivas.length > 0 && (
                <span className="text-[11px] text-muted">
                  · {barrerasActivas.length} barrera(s) activa(s)
                </span>
              )}
            </div>
          )}
        </div>

        <span
          className={`text-xs text-muted transition-transform duration-200 ${abierta ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {abierta && !cargando && (
        <div className="px-4 pb-4 space-y-4 border-t border-border/30 pt-3">
          {/* ÚLTIMA SESIÓN */}
          <section className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Última sesión
            </h4>
            {!ultima ? (
              <p className="text-xs text-muted italic">
                Sin sesiones completadas en los últimos 35 días.
              </p>
            ) : (
              <div className="text-xs text-text space-y-0.5">
                <p>
                  <strong>{ultima.libroNombre}</strong> ·{" "}
                  {ultima.fecha.toLocaleDateString("es-AR")} (
                  {textoHace(diasUltima ?? 0)})
                </p>
                <p className="text-muted">
                  {ultima.duracion} min · RPE {ultima.rpe} · {ultima.carga} UA
                  {(ultima.gruposMusculares ?? []).length > 0 &&
                    ` · ${(ultima.gruposMusculares ?? []).join(", ")}`}
                </p>
                {ultima.observaciones ? (
                  <p className="text-muted italic">
                    "{ultima.observaciones}"
                  </p>
                ) : null}
              </div>
            )}
          </section>

          {/* CARGA */}
          <section className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Carga
            </h4>
            <div className="text-xs text-text space-y-0.5">
              <p>
                Últimos 7 días: <strong>{analisis.aguda} UA</strong>
              </p>
              <p>
                Promedio semanal de las 4 semanas previas:{" "}
                <strong>{analisis.cronicaSemanal} UA</strong>
              </p>
              {analisis.ratio !== null && (
                <p>
                  Relación: <strong>{analisis.ratio.toFixed(2)}</strong>
                  <span className="text-muted"> (referencia 0,8 a 1,3)</span>
                </p>
              )}
              {analisis.baseCorta && sesiones.length > 0 && (
                <p className="text-warning/90 text-[11px]">
                  Base corta: hay menos de 2 semanas de historial, tomalo como
                  orientativo.
                </p>
              )}
            </div>
          </section>

          {/* BARRERAS */}
          <section className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Barreras activas
            </h4>
            {barrerasActivas.length === 0 ? (
              <p className="text-xs text-muted italic">Sin barreras activas.</p>
            ) : (
              <ul className="text-xs text-text space-y-0.5">
                {barrerasActivas.slice(0, 6).map((b) => (
                  <li key={b.id}>
                    <strong>{b.nombre}</strong>
                    <span className="text-muted">
                      {" "}
                      · objetivo {b.objetivo}
                      {b.unidad ? ` ${b.unidad}` : ""}
                      {b.resultado ? ` · último ${b.resultado}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* PESOS RECIENTES */}
          <section className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Últimos pesos de los ejercicios de esta sesión
            </h4>
            {ejerciciosForm.length === 0 ? (
              <p className="text-xs text-muted italic">
                Agregá ejercicios a los bloques y aparecen acá.
              </p>
            ) : (
              <ul className="text-xs text-text space-y-0.5">
                {ejerciciosForm.map((e) => {
                  const r = ultimos[e.id];
                  return (
                    <li key={e.id}>
                      <strong>{e.nombre}</strong>
                      {r ? (
                        <span className="text-muted">
                          {" "}
                          · {r.series.length} serie(s), mejor {r.mejorPeso} kg
                          {r.e1RM > 0 ? ` (e1RM ${Math.round(r.e1RM)} kg)` : ""}
                          {" · "}
                          {textoHace(diasDesde(r.fecha))}
                        </span>
                      ) : (
                        <span className="text-muted italic"> · sin registro</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      )}
    </Card>
  );
}