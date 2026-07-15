import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Navigate } from "react-router-dom";

import { auth } from "../../firebase/firebase";
import { useAuth } from "../useAuth";

function LoginPage() {
  const { user, usuario } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (user && usuario?.rol === "admin") {
    return <Navigate to="/clientes" replace />;
  }

  if (user && usuario?.rol === "cliente") {
    return <Navigate to="/cliente" replace />;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setEnviando(true);
      setError("");

      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      setError("Email o contraseña incorrectos.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4"
      >
        <h1 className="text-3xl font-bold">
          Login Z-Rendi
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-lg"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-lg"
        />

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full p-3 rounded-lg"
        >
          {enviando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;