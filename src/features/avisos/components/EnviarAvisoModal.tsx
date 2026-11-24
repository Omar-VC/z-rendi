import { useEffect, useState } from "react";

import { useAuth } from "../../../auth/useAuth";
import { Modal, Button, Textarea } from "../../../shared/ui";

import { crearAviso, suscribirseAvisosEnviados } from "../avisos.service";
import { TIPOS_AVISO, type Aviso, type TipoAviso } from "../types";

type Props = {
  clienteId: string;
  nombre: string;
  onClose: () => void;
};

const MAX = 280;

export default function EnviarAvisoModal({ clienteId, nombre, onClose }: Props) {
  const { user } = useAuth();
  const userId = user?.uid;

  const [tipo, setTipo] = useState<TipoAviso>("recordatorio");
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviados, setEnviados] = useState<Aviso[]>([]);

  useEffect(() => {
    if (!userId) return;
    return suscribirseAvisosEnviados(clienteId, userId, setEnviados);
  }, [clienteId, userId]);

  async function enviar() {
    if (!texto.trim()) {
      alert("Escribí el mensaje.");
      return;
    }
    try {
      setEnviando(true);
      await crearAviso(clienteId, tipo, texto);
      setTexto("");
    } catch (e) {
      console.error(e);
      alert("No se pudo enviar el aviso.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal
      title={`Aviso para ${nombre}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={enviando}>
            Cerrar
          </Button>
          <Button variant="accent" onClick={enviar} disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar aviso"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TIPOS_AVISO) as TipoAviso[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all active:scale-95 ${
                tipo === t
                  ? TIPOS_AVISO[t].clases
                  : "bg-surfaceSoft border-border/50 text-text"
              }`}
            >
              {TIPOS_AVISO[t].icono} {TIPOS_AVISO[t].label}
            </button>
          ))}
        </div>

        <div className="space-y-1">
          <Textarea
            label="Mensaje"
            placeholder="Ej: Mañana traé el short de entrenamiento y llegá 10 min antes."
            value={texto}
            maxLength={MAX}
            onChange={(e) => setTexto(e.target.value)}
          />
          <p className="text-[11px] text-muted text-right">
            {texto.length}/{MAX}
          </p>
        </div>

        {enviados.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-border/40">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Enviados
            </p>
            {enviados.slice(0, 5).map((a) => (
              <div
                key={a.id}
                className="rounded-lg border border-border/40 bg-surfaceSoft/40 p-2.5 space-y-1"
              >
                <p className="text-xs text-text">
                  {TIPOS_AVISO[a.tipo].icono} {a.texto}
                </p>
                <p
                  className={`text-[11px] ${
                    a.leido ? "text-success" : "text-warning"
                  }`}
                >
                  {a.leido
                    ? `Leído ${a.leidoEn?.toLocaleString("es-AR") ?? ""}`
                    : "Sin leer"}
                  <span className="text-muted">
                    {" "}
                    · enviado {a.creadoEn.toLocaleString("es-AR")}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
