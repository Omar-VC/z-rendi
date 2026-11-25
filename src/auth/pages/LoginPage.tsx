import { useState } from "react";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { auth } from "../../firebase/firebase";
import { useAuth } from "../useAuth";

function LoginPage() {
  const { user, usuario } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [enviandoRestablecimiento, setEnviandoRestablecimiento] = useState(false);
  const [mensajeRestablecimiento, setMensajeRestablecimiento] = useState("");

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
      setMensajeRestablecimiento("");

      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      setError("Email o contraseña incorrectos.");
    } finally {
      setEnviando(false);
    }
  };

  const handleRestablecerPassword = async () => {
    const correo = email.trim();
    setError("");
    setMensajeRestablecimiento("");

    if (!correo) {
      setError("Ingresá tu email para recibir el enlace de restablecimiento.");
      return;
    }

    try {
      setEnviandoRestablecimiento(true);
      await sendPasswordResetEmail(auth, correo);
      setMensajeRestablecimiento(
        "Si hay una cuenta asociada a ese email, recibirás un enlace para restablecer la contraseña.",
      );
    } catch (error) {
      console.error("Error al solicitar el restablecimiento:", error);
      setError("No se pudo enviar el enlace. Revisá el email e intentá nuevamente.");
    } finally {
      setEnviandoRestablecimiento(false);
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
          autoComplete="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setMensajeRestablecimiento("");
          }}
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


        <div className="relative">
          <input
            type={mostrarPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="
              w-full
              px-4
              pr-12
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
          <button
            type="button"
            onClick={() => setMostrarPassword((visible) => !visible)}
            aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={mostrarPassword}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-muted transition hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            {mostrarPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={handleRestablecerPassword}
            disabled={enviandoRestablecimiento || enviando}
            className="text-xs font-semibold text-primary transition hover:underline disabled:opacity-50"
          >
            {enviandoRestablecimiento
              ? "Enviando enlace..."
              : "¿Olvidaste tu contraseña?"}
          </button>
        </div>

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

      {mensajeRestablecimiento && (
        <p role="status" className="text-sm text-success text-center">
          {mensajeRestablecimiento}
        </p>
      )}



      <button
        type="submit"
        disabled={enviando || enviandoRestablecimiento}
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
