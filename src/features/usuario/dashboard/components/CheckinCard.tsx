import { useEffect, useState } from "react";

import { useAuth } from "../../../../auth/useAuth";
import { Card, Button } from "../../../../shared/ui";

import type {
  Asiste,
  Checkin,
  MotivoNo,
  NivelMolestia,
} from "../../../checkins/types";
import {
  fechaHoyISO,
  MOTIVOS_NO,
  ZONAS_MOLESTIA,
} from "../../../checkins/utils";
import {
  guardarCheckin,
  obtenerCheckin,
} from "../../../checkins/checkins.service";

const chip = (activo: boolean) =>
  `px-3 py-2 rounded-lg border text-xs font-bold transition-all active:scale-95 ${
    activo
      ? "bg-primary text-black border-primary"
      : "bg-surfaceSoft border-border/50 text-text"
  }`;

function Escala({
  valor,
  onChange,
}: {
  valor: number | null;
  onChange: (n: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`h-11 ${chip(valor === n)}`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default function CheckinCard() {
  const { user } = useAuth();
  const fecha = fechaHoyISO();

  const [cargando, setCargando] = useState(true);
  const [guardado, setGuardado] = useState<Checkin | null>(null);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [asiste, setAsiste] = useState<Asiste | null>(null);
  const [motivo, setMotivo] = useState<MotivoNo | null>(null);
  const [sueno, setSueno] = useState<number | null>(null);
  const [fatiga, setFatiga] = useState<number | null>(null);
  const [molestia, setMolestia] = useState<"no" | NivelMolestia>("no");
  const [zonas, setZonas] = useState<string[]>([]);
  const [comentario, setComentario] = useState("");

  function cargarFormulario(c: Checkin) {
    setAsiste(c.asiste);
    setMotivo(c.motivoNo ?? null);
    setSueno(c.sueno ?? null);
    setFatiga(c.fatiga ?? null);
    setMolestia(c.molestia?.nivel ?? "no");
    setZonas(c.molestia?.zonas ?? []);
    setComentario(c.comentario ?? "");
  }

  useEffect(() => {
    if (!user) return;
    let activo = true;

    obtenerCheckin(user.uid, fecha)
      .then((c) => {
        if (!activo) return;
        setGuardado(c);
        if (c) cargarFormulario(c);
      })
      .catch((e) => console.error("Error cargando check-in:", e))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, [user?.uid, fecha]);

  if (!user || cargando) return null;

  const respondeBienestar = asiste === "si" || asiste === "tal_vez";
  const puedeGuardar =
    asiste === "no"
      ? motivo !== null
      : respondeBienestar && sueno !== null && fatiga !== null;

  async function guardar() {
    if (!user || !asiste) return;

    try {
      setGuardando(true);

      const datos =
        asiste === "no"
          ? { asiste, motivoNo: motivo ?? "otro" }
          : {
              asiste,
              sueno: sueno ?? undefined,
              fatiga: fatiga ?? undefined,
              molestia:
                molestia === "no" ? undefined : { nivel: molestia, zonas },
              comentario: comentario.trim() || undefined,
            };

      await guardarCheckin(user.uid, fecha, datos);
      const actualizado = await obtenerCheckin(user.uid, fecha);
      setGuardado(actualizado);
      setEditando(false);
    } catch (e) {
      console.error(e);
      alert(
        e instanceof Error ? e.message : "No se pudo guardar. Probá de nuevo.",
      );
    } finally {
      setGuardando(false);
    }
  }

  // RESUMEN (ya respondió hoy)
  if (guardado && !editando) {
    const texto =
      guardado.asiste === "si"
        ? "Vas a entrenar hoy"
        : guardado.asiste === "tal_vez"
          ? "Todavía no sabés si entrenás hoy"
          : "Hoy no entrenás";

    return (
      <Card className="!p-4 border-primary/30 bg-surfaceSoft/50 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Check-in de hoy
          </p>
          <p className="text-sm font-bold text-text">{texto}</p>
          {guardado.molestia && (
            <p className="text-[11px] text-warning">
              Molestia {guardado.molestia.nivel}
              {guardado.molestia.zonas.length > 0 &&
                `: ${guardado.molestia.zonas.join(", ")}`}
            </p>
          )}
        </div>
        <Button
          variant="secondary"
          className="!min-h-0 h-8 !px-3 text-xs font-bold shrink-0"
          onClick={() => setEditando(true)}
        >
          Cambiar
        </Button>
      </Card>
    );
  }

  // FORMULARIO
  return (
    <Card className="!p-4 border-primary/40 bg-surfaceSoft/50 space-y-4">
      <div>
        <p className="text-sm font-extrabold text-text">¿Vas a entrenar hoy?</p>
        <p className="text-[11px] text-muted">Te lleva 20 segundos.</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(
          [
            ["si", "Sí"],
            ["tal_vez", "No sé"],
            ["no", "No"],
          ] as [Asiste, string][]
        ).map(([valor, label]) => (
          <button
            key={valor}
            type="button"
            onClick={() => setAsiste(valor)}
            className={`h-11 ${chip(asiste === valor)}`}
          >
            {label}
          </button>
        ))}
      </div>

      {asiste === "no" && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-text">¿Por qué?</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(MOTIVOS_NO) as MotivoNo[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMotivo(m)}
                className={chip(motivo === m)}
              >
                {MOTIVOS_NO[m]}
              </button>
            ))}
          </div>
        </div>
      )}

      {respondeBienestar && (
        <>
          <div className="space-y-2">
            <p className="text-xs font-bold text-text">
              ¿Cómo dormiste?{" "}
              <span className="text-muted font-normal">
                (1 muy mal · 5 muy bien)
              </span>
            </p>
            <Escala valor={sueno} onChange={setSueno} />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-text">
              ¿Cómo sentís el cuerpo?{" "}
              <span className="text-muted font-normal">
                (1 muy cansado · 5 fresco)
              </span>
            </p>
            <Escala valor={fatiga} onChange={setFatiga} />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-text">
              ¿Tenés alguna molestia o dolor?
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["no", "No"],
                  ["leve", "Leve"],
                  ["fuerte", "Fuerte"],
                ] as ["no" | NivelMolestia, string][]
              ).map(([valor, label]) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setMolestia(valor)}
                  className={`h-11 ${chip(molestia === valor)}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {molestia !== "no" && (
              <div className="flex flex-wrap gap-2 pt-1">
                {ZONAS_MOLESTIA.map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() =>
                      setZonas((prev) =>
                        prev.includes(z)
                          ? prev.filter((x) => x !== z)
                          : [...prev, z],
                      )
                    }
                    className={chip(zonas.includes(z))}
                  >
                    {z}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Comentario (opcional)"
            className="w-full text-xs bg-surfaceSoft border border-border/50 rounded-lg px-3 py-2.5 text-text"
          />
        </>
      )}

      <div className="flex justify-end gap-2">
        {editando && (
          <Button
            variant="secondary"
            className="!min-h-0 h-9 !px-4 text-xs font-bold"
            onClick={() => {
              if (guardado) cargarFormulario(guardado);
              setEditando(false);
            }}
            disabled={guardando}
          >
            Cancelar
          </Button>
        )}
        <Button
          variant="primary"
          className="!min-h-0 h-9 !px-5 text-xs font-bold"
          onClick={guardar}
          disabled={!puedeGuardar || guardando}
        >
          {guardando ? "Guardando..." : "Enviar"}
        </Button>
      </div>
    </Card>
  );
}