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
      navigate("/"); // redirige al flujo normal según rol
    } catch (err: any) {
      setError("Error al iniciar sesión: " + err.message);
    }
  };

  return (
    <section className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-medium"
        >
          Entrar
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <div className="mt-4 text-center">
        <p className="text-sm text-slate-600">
          ¿No tienes cuenta?{" "}
          <Link to="/registro-cliente" className="text-blue-600 font-medium">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
