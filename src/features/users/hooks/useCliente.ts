import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { doc, onSnapshot } from "firebase/firestore";

type Usuario = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  estado?: string;
};

export function useCliente(clienteId: string) {
  const [cliente, setCliente] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clienteId) {
      // 👇 cuando no hay clienteId, reseteás estados y marcás loading en false
      setCliente(null);
      setLoading(false);
      return;
    }

    // 👇 cada vez que cambia clienteId válido, volvés a marcar loading en true
    setLoading(true);

    const ref = doc(db, "usuarios", clienteId);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setCliente({ ...(snap.data() as Usuario), id: snap.id });
      } else {
        setCliente(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clienteId]);

  return { cliente, loading };
}
