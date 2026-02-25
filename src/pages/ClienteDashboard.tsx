import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import type { Ficha, Sesion, Cuota } from "../types";

const ClienteDashboard = () => {
  const user = auth.currentUser;
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Ficha única del cliente (busca por clienteId == uid)
    const loadFicha = async () => {
      const qFicha = query(collection(db, "fichas"), where("clienteId", "==", user.uid));
      const fichaSnap = await getDocs(qFicha);
      if (!fichaSnap.empty) {
        const d = fichaSnap.docs[0];
        setFicha({ id: d.id, ...(d.data() as Omit<Ficha, "id">) });
      }
    };

    // Sesiones en tiempo real
    const qSesiones = query(collection(db, "sesiones"), where("clienteId", "==", user.uid));
    const unsubSesiones = onSnapshot(qSesiones, (snap) => {
      setSesiones(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Sesion, "id">) })));
    });

    // Cuotas en tiempo real
    const qCuotas = query(collection(db, "cuotas"), where("clienteId", "==", user.uid));
    const unsubCuotas = onSnapshot(qCuotas, (snap) => {
      setCuotas(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Cuota, "id">) })));
    });

    loadFicha().finally(() => setLoading(false));

    return () => {
      unsubSesiones();
      unsubCuotas();
    };
  }, [user]);

  if (loading) return <p>Cargando datos...</p>;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Mi Panel</h2>

      {/* Ficha */}
      <div className="rounded-lg border bg-white p-4">
        <h3 className="text-lg font-semibold">Mi ficha</h3>
        {ficha ? (
          <ul className="text-sm text-slate-700">
            <li>Nombre: {ficha.nombre} {ficha.apellido}</li>
            <li>Edad: {ficha.edad}</li>
            <li>Peso: {ficha.peso} kg</li>
            <li>Altura: {ficha.altura} cm</li>
            <li>Posición: {ficha.posicion}</li>
            <li>Lesiones: {ficha.lesiones}</li>
            <li>Evaluación inicial: {ficha.evaluacionInicial}</li>
            <li>Evaluación actual: {ficha.evaluacionActual}</li>
          </ul>
        ) : (
          <p>No hay ficha cargada.</p>
        )}
      </div>

      {/* Sesiones */}
      <div className="rounded-lg border bg-white p-4">
        <h3 className="text-lg font-semibold">Mis sesiones</h3>
        {sesiones.length > 0 ? (
          <ul className="list-disc pl-5 text-sm text-slate-700">
            {sesiones.map((s) => (
              <li key={s.id}>{s.fecha} - {s.tipo} • {s.observaciones}</li>
            ))}
          </ul>
        ) : (
          <p>No hay sesiones registradas.</p>
        )}
      </div>

      {/* Cuotas */}
      <div className="rounded-lg border bg-white p-4">
        <h3 className="text-lg font-semibold">Mis cuotas</h3>
        {cuotas.length > 0 ? (
          <ul className="list-disc pl-5 text-sm text-slate-700">
            {cuotas.map((c) => (
              <li key={c.id}>
                ${c.monto} - {c.estado} (vence: {c.fechaVencimiento})
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay cuotas registradas.</p>
        )}
      </div>
    </section>
  );
};

export default ClienteDashboard;
