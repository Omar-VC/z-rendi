import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getUsuarioActual, type UsuarioActual } from "./auth.service";
import { AuthContext } from "./AuthContextValue";

import { auth } from "../firebase/firebase";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [usuario, setUsuario] = useState<UsuarioActual | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuarioFirebase) => {
      setUser(usuarioFirebase);

      if (usuarioFirebase) {
        const datosUsuario = await getUsuarioActual(usuarioFirebase.uid);

        setUsuario(datosUsuario);
      } else {
        setUsuario(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        usuario,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
