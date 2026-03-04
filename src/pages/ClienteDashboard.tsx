import { useState } from "react";
import { auth } from "../firebase";
import { useFichas } from "../hooks/useFichas";
import { useCuotas } from "../hooks/useCuotas";
import { useSesiones } from "../hooks/useSesiones";
import NavbarCliente from "../components/NavbarCliente";
import FichaDetail from "../components/fichas/FichaDetail";
import CuotaDetailCliente from "../components/Cuotas/CuotaDetailCliente";
import SesionesClienteView from "../components/Sesiones/SesionesClienteView";

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
      <header className="flex justify-between items-center bg-secondary p-4 shadow-md"> {/* Botón salir con ícono */} <button onClick={() => auth.signOut()} className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent hover:bg-accent/80 transition" > <span className="material-icons">logout</span> <span>Salir</span> </button> {/* Nombre del cliente con avatar */} <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-full bg-highlight flex items-center justify-center text-white font-bold"> {clienteNombre.charAt(0).toUpperCase()} </div> <span className="font-semibold text-lg">{clienteNombre}</span> </div> </header>

      {/* Contenido central */}
      <main className="flex-1 flex items-center justify-center p-6">
        {activeSection === "inicio" && (
  <div className="text-center">
    <img
      src="/logo.jpeg"
      alt="Logo"
      className="mx-auto mb-6 w-40 drop-shadow-lg animate-zoomFadeIn"
    />
    <h1 className="text-2xl font-bold opacity-0 animate-fadeInDelay">
      Bienvenido a Z-Rendi
    </h1>
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
              <SesionesClienteView clienteId={clienteId} />
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
