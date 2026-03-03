import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

type Usuario = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
};

export function useCliente(clienteId: string) {
  const [cliente, setCliente] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clienteId) return;

    const ref = doc(db, "usuarios", clienteId); // 👈 ahora apunta a 'usuarios'
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setCliente({ id: snap.id, ...(snap.data() as Usuario) });
      } else {
        setCliente(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clienteId]);

  return { cliente, loading };
}
