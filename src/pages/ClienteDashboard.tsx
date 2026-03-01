import { useState } from "react";
import { auth } from "../firebase";
import { useFichas } from "../hooks/useFichas";
import { useCuotas } from "../hooks/useCuotas";
import { useSesiones } from "../hooks/useSesiones";
import NavbarCliente from "../components/NavbarCliente";
import FichaDetail from "../components/fichas/FichaDetail";
import CuotaDetailCliente from "../components/cuotas/CuotaDetailCliente";
import SesionesCliente from "../components/sesiones/SesionesCliente";

const ClienteDashboard = ({ clienteId, clienteNombre }: { clienteId: string; clienteNombre: string }) => {
  const { fichas } = useFichas(clienteId);
  const { cuotas } = useCuotas(clienteId);
  const { sesiones } = useSesiones(clienteId);

  const ficha = fichas[0];
  const cuota = cuotas[0];
  const sesionActual = sesiones[0];

  const [activeSection, setActiveSection] = useState("inicio");

  return (
    <div className="flex flex-col min-h-screen bg-primary text-white">
      {/* Header */}
      <header className="flex justify-between items-center bg-secondary p-4">
        <button onClick={() => auth.signOut()} className="btn btn-accent">
          Salir
        </button>
        <span className="font-semibold">{clienteNombre}</span>
      </header>

      {/* Contenido central */}
      <main className="flex-1 flex items-center justify-center p-6">
        {activeSection === "inicio" && (
          <div className="text-center">
            {/* Logo Z-Rendi (cuando lo tengas lo reemplazás aquí) */}
            <img src="/logo-zrendi.png" alt="Z-Rendi" className="mx-auto mb-6 w-40" />
            <h1 className="text-2xl font-bold">Bienvenido a Z-Rendi</h1>
          </div>
        )}

        {activeSection === "ficha" && (
          <div className="card w-full max-w-md">
            {ficha ? (
              <FichaDetail ficha={ficha} onClose={() => setActiveSection("inicio")} />
            ) : (
              <p className="text-gray-300">Todavía no tenés ficha asignada.</p>
            )}
          </div>
        )}

        {activeSection === "cuotas" && (
          <div className="card w-full max-w-md">
            {cuota ? (
              <CuotaDetailCliente cuota={cuota} onClose={() => setActiveSection("inicio")} />
            ) : (
              <p className="text-gray-300">Todavía no tenés cuota asignada.</p>
            )}
          </div>
        )}

        {activeSection === "sesiones" && (
          <div className="card w-full max-w-md">
            {sesionActual ? (
              <SesionesCliente clienteId={clienteId} />
            ) : (
              <p className="text-gray-300">Todavía no tenés sesiones asignadas.</p>
            )}
          </div>
        )}
      </main>

      {/* Navbar fijo abajo */}
      <NavbarCliente onChangeSection={setActiveSection} />
    </div>
  );
};

export default ClienteDashboard;
