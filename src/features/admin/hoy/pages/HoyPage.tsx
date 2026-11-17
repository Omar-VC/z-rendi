import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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




export default function HoyPage() {
  const { user } = useAuth();
  const { activos, loading } = useClientes();

  const [fecha] = useState(fechaHoyISO());
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [clienteAsignar, setClienteAsignar] = useState<string | null>(null);

  

  

  useEffect(() => {
    if (!user) return;
    return suscribirseCheckinsDelDia(user.uid, fecha, setCheckins);
  }, [user?.uid, fecha]);

  const grupos = useMemo(() => {
    const porCliente = new Map(checkins.map((c) => [c.clienteId, c]));
    const g = {
      vienen: [] as { id: string; nombre: string; checkin: Checkin }[],
      talVez: [] as { id: string; nombre: string; checkin: Checkin }[],
      noVienen: [] as { id: string; nombre: string; checkin: Checkin }[],
      sinConfirmar: [] as { id: string; nombre: string }[],
    };

    activos.forEach((c) => {
      const nombre = `${c.nombre ?? ""} ${c.apellido ?? ""}`.trim() || c.email;
      const checkin = porCliente.get(c.id);

      if (!checkin) g.sinConfirmar.push({ id: c.id, nombre });
      else if (checkin.asiste === "si")
        g.vienen.push({ id: c.id, nombre, checkin });
      else if (checkin.asiste === "tal_vez")
        g.talVez.push({ id: c.id, nombre, checkin });
      else g.noVienen.push({ id: c.id, nombre, checkin });
    });

    return g;
  }, [activos, checkins]);

  const fechaTexto = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  function FilaAtleta({
    id,
    nombre,
    checkin,
  }: {
    id: string;
    nombre: string;
    checkin: Checkin;
  }) {
    const semaforo = calcularSemaforo(checkin);

    return (
      <Card className="!p-4 bg-surface/70 border-border/50 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-bold text-text truncate">
              {nombre}
            </span>
            <Badge
              variant={semaforo.variant}
              className="text-[10px] px-2 py-0.5 font-bold"
            >
              {semaforo.texto}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/clientes/${id}`}
              className="text-[11px] font-semibold text-muted hover:text-primary"
            >
              Ver ficha
            </Link>
            <Button
              variant="accent"
              className="!min-h-0 h-8 !px-3 text-xs font-bold"
              onClick={() => setClienteAsignar(id)}
            >
              Asignar sesión
            </Button>
          </div>
        </div>

        <div className="text-[11px] text-muted flex flex-wrap gap-x-4 gap-y-0.5">
          {checkin.sueno != null && <span>Sueño {checkin.sueno}/5</span>}
          {checkin.fatiga != null && <span>Cuerpo {checkin.fatiga}/5</span>}
          {checkin.molestia && (
            <span className="text-warning font-semibold">
              Molestia {checkin.molestia.nivel}
              {checkin.molestia.zonas.length > 0 &&
                `: ${checkin.molestia.zonas.join(", ")}`}
            </span>
          )}
        </div>

        {checkin.comentario && (
          <p className="text-[11px] text-muted italic">"{checkin.comentario}"</p>
        )}
      </Card>
    );
  }

  const Titulo = ({ texto, n }: { texto: string; n: number }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
      {texto}
      <span className="text-[10px] bg-surfaceSoft px-2 py-0.5 rounded-full border border-border/40">
        {n}
      </span>
    </h2>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-text tracking-tight">Hoy</h1>
        <p className="text-xs text-muted capitalize">{fechaTexto}</p>
      </div>

      {loading ? (
        <p className="text-xs text-muted animate-pulse">Cargando atletas...</p>
      ) : (
        <>
          <section className="space-y-3">
            <Titulo texto="Vienen" n={grupos.vienen.length} />
            {grupos.vienen.length === 0 ? (
              <p className="text-xs text-muted italic">
                Nadie confirmó todavía.
              </p>
            ) : (
              grupos.vienen.map((a) => <FilaAtleta key={a.id} {...a} />)
            )}
          </section>

          {grupos.talVez.length > 0 && (
            <section className="space-y-3">
              <Titulo texto="No saben todavía" n={grupos.talVez.length} />
              {grupos.talVez.map((a) => (
                <FilaAtleta key={a.id} {...a} />
              ))}
            </section>
          )}

          <section className="space-y-3">
            <Titulo texto="No confirmaron" n={grupos.sinConfirmar.length} />
            {grupos.sinConfirmar.length === 0 ? (
              <p className="text-xs text-muted italic">
                Todos respondieron.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {grupos.sinConfirmar.map((a) => (
                  <Link
                    key={a.id}
                    to={`/clientes/${a.id}`}
                    className="text-xs font-semibold text-text bg-surfaceSoft border border-border/40 rounded-lg px-3 py-1.5 hover:border-primary/50"
                  >
                    {a.nombre}
                  </Link>
                ))}
              </div>
            )}
          </section>

          {grupos.noVienen.length > 0 && (
            <section className="space-y-3">
              <Titulo texto="No vienen" n={grupos.noVienen.length} />
              <div className="space-y-1.5">
                {grupos.noVienen.map((a) => (
                  <p key={a.id} className="text-xs text-text">
                    <strong>{a.nombre}</strong>
                    <span
                      className={
                        a.checkin.motivoNo === "salud"
                          ? "text-warning font-semibold"
                          : "text-muted"
                      }
                    >
                      {" "}
                      · {a.checkin.motivoNo ? MOTIVOS_NO[a.checkin.motivoNo] : "—"}
                    </span>
                  </p>
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
    </div>
  );
}