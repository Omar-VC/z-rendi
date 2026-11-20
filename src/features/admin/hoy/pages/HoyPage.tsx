import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CircleCheck,
  CircleHelp,
  CircleX,
  Clock3,
  Dumbbell,
  HeartPulse,
  Moon,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "../../../../auth/useAuth";
import { Card, Badge, Button } from "../../../../shared/ui";
import { useClientes } from "../../clientes/hooks/useClientes";
import NuevaSesionPendienteModal from "../../seguimiento/components/NuevaSesionPendienteModal";

import type { Checkin } from "../../../checkins/types";
import {
  calcularSemaforo,
  fechaHoyISO,
  MOTIVOS_NO,
} from "../../../checkins/utils";
import { suscribirseCheckinsDelDia } from "../../../checkins/checkins.service";
import EnviarAvisoModal from "../../../avisos/components/EnviarAvisoModal";

type AtletaConCheckin = { id: string; nombre: string; checkin: Checkin };
type AtletaPendiente = { id: string; nombre: string };

function iniciales(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0] ?? "")
    .join("")
    .toUpperCase() || "AT";
}

function FilaAtleta({
  id,
  nombre,
  checkin,
  onAviso,
  onAsignar,
}: AtletaConCheckin & {
  onAviso: (id: string, nombre: string) => void;
  onAsignar: (id: string) => void;
}) {
  const semaforo = calcularSemaforo(checkin);

  return (
    <Card className="group !p-0 overflow-hidden bg-surface/75 border border-white/[0.07] hover:border-white/[0.14] hover:bg-surface/90 transition-all duration-200">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-sm font-black text-primary shadow-[0_0_20px_rgba(255,85,0,0.08)]">
              {iniciales(nombre)}
            </div>
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-bold text-text">{nombre}</h3>
                <Badge
                  variant={semaforo.variant}
                  className="text-[9px] px-2 py-0.5 font-bold uppercase tracking-wide"
                >
                  {semaforo.texto}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                {checkin.sueno != null && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.025] px-2 py-1">
                    <Moon className="h-3.5 w-3.5 text-indigo-300" />
                    Sueño <strong className="text-text/80">{checkin.sueno}/5</strong>
                  </span>
                )}
                {checkin.fatiga != null && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.025] px-2 py-1">
                    <Activity className="h-3.5 w-3.5 text-primary/80" />
                    Cuerpo <strong className="text-text/80">{checkin.fatiga}/5</strong>
                  </span>
                )}
                {checkin.molestia && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300/15 bg-amber-300/[0.06] px-2 py-1 font-semibold text-amber-200">
                    <HeartPulse className="h-3.5 w-3.5" />
                    Molestia {checkin.molestia.nivel}
                    {checkin.molestia.zonas.length > 0 && ` · ${checkin.molestia.zonas.join(", ")}`}
                  </span>
                )}
                {checkin.sueno == null && checkin.fatiga == null && !checkin.molestia && (
                  <span>Sin indicadores de bienestar registrados</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            <Link
              to={`/clientes/${id}`}
              className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-[11px] font-semibold text-muted hover:bg-white/[0.04] hover:text-text transition-colors"
            >
              Ficha <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Button
              variant="secondary"
              className="!min-h-0 h-8 !px-3 text-[11px] font-bold"
              onClick={() => onAviso(id, nombre)}
            >
              <Bell className="mr-1.5 h-3.5 w-3.5" /> Aviso
            </Button>
            <Button
              variant="accent"
              className="!min-h-0 h-8 !px-3 text-[11px] font-bold"
              onClick={() => onAsignar(id)}
            >
              <Dumbbell className="mr-1.5 h-3.5 w-3.5" /> Asignar sesión
            </Button>
          </div>
        </div>

        {checkin.comentario && (
          <div className="mt-4 border-t border-white/[0.06] pt-3">
            <p className="border-l-2 border-primary/40 pl-3 text-xs leading-relaxed text-text/70">
              “{checkin.comentario}”
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

function EncabezadoSeccion({
  titulo,
  detalle,
  cantidad,
  icono: Icono,
  tono,
}: {
  titulo: string;
  detalle: string;
  cantidad: number;
  icono: LucideIcon;
  tono: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${tono}`}>
          <Icono className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-text">{titulo}</h2>
          <p className="truncate text-[11px] text-muted">{detalle}</p>
        </div>
      </div>
      <span className="flex h-7 min-w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] px-2 text-xs font-bold text-text/80">
        {cantidad}
      </span>
    </div>
  );
}

export default function HoyPage() {
  const { user } = useAuth();
  const userId = user?.uid;
  const { activos, loading } = useClientes();

  const [fecha] = useState(fechaHoyISO());
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [clienteAsignar, setClienteAsignar] = useState<string | null>(null);
  const [avisoPara, setAvisoPara] = useState<{
    id: string;
    nombre: string;
  } | null>(null);

  useEffect(() => {
    if (!userId) return;
    return suscribirseCheckinsDelDia(userId, fecha, setCheckins);
  }, [userId, fecha]);

  const grupos = useMemo(() => {
    const porCliente = new Map(checkins.map((checkin) => [checkin.clienteId, checkin]));
    const resultado = {
      vienen: [] as AtletaConCheckin[],
      talVez: [] as AtletaConCheckin[],
      noVienen: [] as AtletaConCheckin[],
      sinConfirmar: [] as AtletaPendiente[],
    };

    activos.forEach((cliente) => {
      const nombre = `${cliente.nombre ?? ""} ${cliente.apellido ?? ""}`.trim() || cliente.email;
      const checkin = porCliente.get(cliente.id);

      if (!checkin) resultado.sinConfirmar.push({ id: cliente.id, nombre });
      else if (checkin.asiste === "si") resultado.vienen.push({ id: cliente.id, nombre, checkin });
      else if (checkin.asiste === "tal_vez") resultado.talVez.push({ id: cliente.id, nombre, checkin });
      else resultado.noVienen.push({ id: cliente.id, nombre, checkin });
    });

    return resultado;
  }, [activos, checkins]);

  const fechaTexto = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const resumen: {
    titulo: string;
    cantidad: number;
    icono: LucideIcon;
    tono: string;
    descripcion: string;
  }[] = [
    {
      titulo: "Vienen",
      cantidad: grupos.vienen.length,
      icono: CircleCheck,
      tono: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      descripcion: "Asistencia confirmada",
    },
    {
      titulo: "Tal vez",
      cantidad: grupos.talVez.length,
      icono: Clock3,
      tono: "text-amber-300 bg-amber-300/10 border-amber-300/20",
      descripcion: "Aún por definir",
    },
    {
      titulo: "No vienen",
      cantidad: grupos.noVienen.length,
      icono: CircleX,
      tono: "text-rose-400 bg-rose-400/10 border-rose-400/20",
      descripcion: "Avisaron que faltan",
    },
    {
      titulo: "Sin respuesta",
      cantidad: grupos.sinConfirmar.length,
      icono: CircleHelp,
      tono: "text-sky-300 bg-sky-300/10 border-sky-300/20",
      descripcion: "Todavía no confirmaron",
    },
  ];

  return (
    <div className="space-y-7 animate-fadeIn pb-8">
      <header className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-surface via-surface to-primary/[0.08] p-5 shadow-xl sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-primary/[0.09] blur-[80px]" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              <CalendarDays className="h-3.5 w-3.5" /> Panel operativo
            </div>
            <h1 className="text-3xl font-black tracking-tight text-text sm:text-4xl">Hoy</h1>
            <p className="mt-1 text-sm capitalize text-muted">{fechaTexto}</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-black/10 px-4 py-3">
            <UsersRound className="h-5 w-5 text-primary" />
            <div>
              <p className="text-lg font-black leading-none text-text">{activos.length}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">Atletas activos</p>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-2xl border border-white/[0.06] bg-surface/60" />
          ))}
        </div>
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {resumen.map(({ titulo, cantidad, icono: Icono, tono, descripcion }) => (
              <Card key={titulo} className="!p-4 border border-white/[0.07] bg-surface/70 hover:bg-surface/90 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{titulo}</p>
                    <p className="mt-1 text-2xl font-black leading-none text-text">{cantidad}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${tono}`}>
                    <Icono className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-[10px] text-muted">{descripcion}</p>
              </Card>
            ))}
          </section>

          <section>
            <EncabezadoSeccion
              titulo="Vienen hoy"
              detalle="Asistencia confirmada y estado previo al entrenamiento"
              cantidad={grupos.vienen.length}
              icono={CircleCheck}
              tono="text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
            />
            {grupos.vienen.length === 0 ? (
              <Card className="!p-6 border border-dashed border-white/[0.1] bg-surface/30 text-center">
                <p className="text-sm font-semibold text-text/75">Todavía no hay asistencias confirmadas</p>
                <p className="mt-1 text-xs text-muted">Las respuestas de los atletas aparecerán aquí.</p>
              </Card>
            ) : (
              <div className="grid gap-3 xl:grid-cols-2">
                {grupos.vienen.map((atleta) => (
                  <FilaAtleta
                    key={atleta.id}
                    {...atleta}
                    onAviso={(id, nombre) => setAvisoPara({ id, nombre })}
                    onAsignar={setClienteAsignar}
                  />
                ))}
              </div>
            )}
          </section>

          {grupos.talVez.length > 0 && (
            <section>
              <EncabezadoSeccion
                titulo="Por confirmar"
                detalle="Atletas que todavía no saben si podrán venir"
                cantidad={grupos.talVez.length}
                icono={Clock3}
                tono="text-amber-300 bg-amber-300/10 border-amber-300/20"
              />
              <div className="grid gap-3 xl:grid-cols-2">
                {grupos.talVez.map((atleta) => (
                  <FilaAtleta
                    key={atleta.id}
                    {...atleta}
                    onAviso={(id, nombre) => setAvisoPara({ id, nombre })}
                    onAsignar={setClienteAsignar}
                  />
                ))}
              </div>
            </section>
          )}

          <section>
            <EncabezadoSeccion
              titulo="Sin respuesta"
              detalle="Podés abrir su ficha para revisar o contactar"
              cantidad={grupos.sinConfirmar.length}
              icono={CircleHelp}
              tono="text-sky-300 bg-sky-300/10 border-sky-300/20"
            />
            {grupos.sinConfirmar.length === 0 ? (
              <Card className="!p-4 border border-white/[0.07] bg-surface/50 text-sm text-muted">
                Todos los atletas respondieron el check-in de hoy.
              </Card>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {grupos.sinConfirmar.map((atleta) => (
                  <Link
                    key={atleta.id}
                    to={`/clientes/${atleta.id}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-surface/60 px-4 py-3 transition-all hover:border-primary/30 hover:bg-surface"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-xs font-bold text-muted">
                        {iniciales(atleta.nombre)}
                      </span>
                      <span className="truncate text-xs font-semibold text-text">{atleta.nombre}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {grupos.noVienen.length > 0 && (
            <section>
              <EncabezadoSeccion
                titulo="No vienen"
                detalle="Ausencias informadas para la jornada"
                cantidad={grupos.noVienen.length}
                icono={CircleX}
                tono="text-rose-400 bg-rose-400/10 border-rose-400/20"
              />
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {grupos.noVienen.map((atleta) => (
                  <Card key={atleta.id} className="!p-4 border border-white/[0.07] bg-surface/60">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-400/10 text-xs font-bold text-rose-300">
                          {iniciales(atleta.nombre)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-text">{atleta.nombre}</p>
                          <p className="mt-1 text-[10px] text-muted">
                            {atleta.checkin.motivoNo
                              ? MOTIVOS_NO[atleta.checkin.motivoNo]
                              : "Motivo no informado"}
                          </p>
                        </div>
                      </div>
                      {atleta.checkin.motivoNo === "salud" && (
                        <Badge variant="warning" className="text-[9px] uppercase">Salud</Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {clienteAsignar && (
        <NuevaSesionPendienteModal
          clienteId={clienteAsignar}
          onClose={() => setClienteAsignar(null)}
          onGuardado={() => setClienteAsignar(null)}
        />
      )}

      {avisoPara && (
        <EnviarAvisoModal
          clienteId={avisoPara.id}
          nombre={avisoPara.nombre}
          onClose={() => setAvisoPara(null)}
        />
      )}
    </div>
  );
}
