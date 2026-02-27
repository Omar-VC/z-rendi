import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import type { Sesion } from "../types";

const ClienteSesiones = () => {
  const user = auth.currentUser;
  const [sesiones, setSesiones] = useState<Sesion[]>([]);

  useEffect(() => {
    if (!user) return;
    const qSesiones = query(
      collection(db, "sesiones"),
      where("clienteId", "==", user.uid)
    );
    const unsub = onSnapshot(qSesiones, (snap) => {
      setSesiones(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Sesion, "id">) }))
      );
    });
    return () => unsub();
  }, [user]);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Mis sesiones</h2>
      {sesiones.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {sesiones.map((s) => (
            <div
              key={s.id}
              className="rounded-lg border bg-white p-4 shadow hover:shadow-md transition"
            >
              <p className="text-sm text-slate-700">📅 Fecha: {s.fecha}</p>
              <p className="text-sm text-slate-700">
                ⏱ Duración estimada: {s.duracionEstimada}
              </p>
              <p className="text-sm text-slate-700 whitespace-pre-line">
                📝 Bloques: {s.bloques}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay sesiones registradas.</p>
      )}
    </section>
  );
};

export default ClienteSesiones;

