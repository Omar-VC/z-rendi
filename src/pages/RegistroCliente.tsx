import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const RegistroCliente = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;

      await setDoc(doc(db, "usuarios", uid), {
        nombre,
        apellido,
        email,
        rol: "cliente",
        estado: "pendiente",
        createdAt: new Date().toISOString(),
      });

      await setDoc(doc(db, "fichas", uid), {
        nombre,
        apellido,
        lesiones: "",
        evaluacionInicial: "",
        evaluacionActual: "",
      });

      setSuccess("Cliente registrado correctamente.");

      setEmail("");
      setPassword("");
      setNombre("");
      setApellido("");

      navigate("/login");
    } catch (err: any) {
      setError("Error al registrar cliente: " + err.message);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Registro de Cliente
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input"
            required
          />

          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="input"
            required
          />

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
            Registrar
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-3 text-sm text-green-400">
            {success}
          </p>
        )}

        <p className="mt-6 text-sm text-muted text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="link-accent">
            Inicia sesión
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegistroCliente;