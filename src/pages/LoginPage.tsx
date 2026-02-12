import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // redirige al dashboard
    } catch {
      setError("Credenciales incorrectas o sin permisos.");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="space-y-4 p-6 border rounded bg-white shadow-md w-80"
      >
        <h2 className="text-xl font-bold text-slate-900">Iniciar sesión</h2>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-violet-600 text-white px-4 py-2 rounded w-full"
        >
          Entrar
        </button>
      </form>
    </section>
  );
};

export default LoginPage;

