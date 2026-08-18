import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  obtenerInvitacionPorToken,
} from "../../features/admin/invitaciones/services/invitaciones.service";

import type { Invitacion } from "../../features/admin/invitaciones/types";

import {
  registrarCliente,
} from "../services/registro.service";

function RegistroPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [invitacion, setInvitacion] = useState<Invitacion | null>(null);

  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [deporte, setDeporte] = useState("");


  /*
   * Buscar invitación
   */

  useEffect(() => {
    async function cargarInvitacion() {
      if (!token) {
        setError("El enlace de invitación no es válido.");
        setCargando(false);
        return;
      }

      try {
        const resultado =
          await obtenerInvitacionPorToken(token);

        if (!resultado) {
          setError("La invitación no existe.");
          setCargando(false);
          return;
        }

        if (resultado.estado !== "pendiente") {
          setError("Esta invitación ya no está disponible.");
          setCargando(false);
          return;
        }

        setInvitacion(resultado);
      } catch (error) {
        console.error(error);
        setError("No se pudo verificar la invitación.");
      } finally {
        setCargando(false);
      }
    }

    cargarInvitacion();
  }, [token]);


  /*
   * Registro
   */

  const handleRegistro = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError("");

    if (!invitacion) {
      setError("La invitación no es válida.");
      return;
    }

    if (password.length < 6) {
      setError(
        "La contraseña debe tener al menos 6 caracteres.",
      );
      return;
    }

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!edad || Number(edad) <= 0) {
      setError("Ingresá una edad válida.");
      return;
    }

    try {
      setEnviando(true);

      await registrarCliente(
        invitacion,
        {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          email: email.trim(),
          password,
          edad: Number(edad),
          telefono: telefono.trim(),
          deporte: deporte.trim(),
        },
      );

      navigate("/login", {
        replace: true,
      });

    } catch (error) {
      console.error(error);

      setError(
        "No se pudo completar el registro. Verificá los datos e intentá nuevamente.",
      );
    } finally {
      setEnviando(false);
    }
  };


  /*
   * Cargando invitación
   */

  if (cargando) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <p className="text-muted">
          Verificando invitación...
        </p>
      </div>
    );
  }


  /*
   * Invitación inválida
   */

  if (!invitacion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">

        <div className="w-full max-w-sm bg-surface rounded-card p-8 shadow-card border border-border text-center space-y-4">

          <h1 className="text-2xl font-bold text-text">
            Registro
          </h1>

          <p className="text-sm text-danger">
            {error}
          </p>

        </div>

      </div>
    );
  }


  /*
   * Formulario
   */

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">

      <form
        onSubmit={handleRegistro}
        className="
          w-full
          max-w-md
          bg-surface
          rounded-card
          p-8
          shadow-card
          border
          border-border
          space-y-5
        "
      >

        <div className="text-center space-y-2">

          <h1 className="text-3xl font-bold text-text">
            Crear cuenta
          </h1>

          <p className="text-sm text-muted">
            Completá tus datos para ingresar a Z-Rendi.
          </p>

        </div>


        <div className="space-y-3">

          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
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
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
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
            minLength={6}
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
            placeholder="Confirmar contraseña"
            value={confirmarPassword}
            onChange={(e) =>
              setConfirmarPassword(e.target.value)
            }
            required
            minLength={6}
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
            type="number"
            placeholder="Edad"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            required
            min={1}
            max={120}
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
            type="tel"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
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
            type="text"
            placeholder="Deporte"
            value={deporte}
            onChange={(e) => setDeporte(e.target.value)}
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
          <p className="text-sm text-danger text-center">
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
            ? "Creando cuenta..."
            : "Crear cuenta"}
        </button>

      </form>

    </div>
  );
}

export default RegistroPage;