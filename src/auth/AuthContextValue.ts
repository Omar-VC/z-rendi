import { createContext } from "react";
import type { User } from "firebase/auth";

import type { UsuarioActual } from "./auth.service";

export interface AuthContextType {
  user: User | null;
  usuario: UsuarioActual | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  usuario: null,
  loading: true,
});
