// src/pages/LoginPage.tsx
import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError("Error al iniciar sesión: " + err.message);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-primary">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Iniciar sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            Entrar
          </button>
        </form>

        {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            ¿No tienes cuenta?{" "}
            <Link to="/registro-cliente" className="text-highlight font-medium">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
