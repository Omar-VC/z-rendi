import { useEffect, useState } from "react";

import { useAuth } from "../../../../auth/useAuth";
import {
  marcarAvisoLeido,
  suscribirseAvisosAtleta,
} from "../../../avisos/avisos.service";
import { TIPOS_AVISO, type Aviso } from "../../../avisos/types";

export default function AvisosCard() {
  const { user } = useAuth();
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  useEffect(() => {
    if (!user) return;
    return suscribirseAvisosAtleta(user.uid, setAvisos);
  }, [user?.uid]);

  const sinLeer = avisos.filter((a) => !a.leido);
  if (sinLeer.length === 0) return null;

  return (
    <div className="space-y-3">
      {sinLeer.map((a) => {
        const t = TIPOS_AVISO[a.tipo];
        return (
          <div key={a.id} className={`rounded-2xl border p-4 space-y-3 ${t.clases}`}>
            <p className="text-xs font-black uppercase tracking-wider">
              {t.icono} {t.label}
            </p>
            <p className="text-base text-text leading-relaxed whitespace-pre-line">
              {a.texto}
            </p>
            <button
              type="button"
              onClick={() =>
                marcarAvisoLeido(a.id).catch((e) => console.error(e))
              }
              className="h-11 px-5 rounded-xl bg-surface border border-border text-text text-sm font-bold active:scale-95"
            >
              Entendido
            </button>
          </div>
        );
      })}
    </div>
  );
}