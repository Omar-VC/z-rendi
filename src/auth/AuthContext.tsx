import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getUsuarioActual } from "./auth.service";

import { auth } from "../firebase/firebase";

interface AuthContextType {
  user: User | null;
  usuario: any;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  usuario: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [usuario, setUsuario] = useState<any>(null);
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

export function useAuth() {
  return useContext(AuthContext);
}
