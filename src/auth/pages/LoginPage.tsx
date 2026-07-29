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
  <div className="min-h-screen bg-background flex items-center justify-center p-6">

    <form
      onSubmit={handleLogin}
      className="
        w-full
        max-w-sm
        bg-surface
        rounded-card
        p-8
        shadow-card
        space-y-5
        border
        border-border
      "
    >

      <div className="text-center space-y-2">

        <h1 className="
          text-3xl
          font-bold
          text-text
        ">
          Z-Rendi
        </h1>


        <p className="
          text-sm
          text-muted
        ">
          Plataforma de rendimiento deportivo
        </p>

      </div>


      <div className="space-y-3">

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="
            w-full
            px-4
            py-3
            rounded-button
            bg-background
            border
            border-border
            text-text
            placeholder:text-muted
            focus:outline-none
            focus:border-primary
          "
        />


        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="
            w-full
            px-4
            py-3
            rounded-button
            bg-background
            border
            border-border
            text-text
            placeholder:text-muted
            focus:outline-none
            focus:border-primary
          "
        />

      </div>


      {error && (

        <p className="
          text-sm
          text-danger
          text-center
        ">
          {error}
        </p>

      )}



      <button
        type="submit"
        disabled={enviando}
        className="
          w-full
          py-3
          rounded-button
          bg-primary
          text-white
          font-semibold
          transition
          hover:opacity-90
          disabled:opacity-50
        "
      >

        {enviando
          ? "Ingresando..."
          : "Ingresar"
        }

      </button>


    </form>

  </div>
);
}

export default LoginPage;