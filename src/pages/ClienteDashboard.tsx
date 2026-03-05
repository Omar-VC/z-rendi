import { useState, useEffect } from "react";
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

  // --- Banner instalación PWA ---
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsIos(ios);
    setIsStandalone(standalone);

    // Capturar evento en Android
    window.addEventListener("beforeinstallprompt", (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("Usuario aceptó instalar la app");
      } else {
        console.log("Usuario canceló la instalación");
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary text-white">
      {/* Header */}
      <header className="flex flex-wrap justify-between items-center bg-secondary p-4 shadow-md">
        {/* Botón salir */}
        <button
          onClick={() => auth.signOut()}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent hover:bg-accent/80 transition text-sm md:text-base"
        >
          <span className="material-icons">logout</span>
          <span className="hidden sm:inline">Salir</span>
        </button>

        {/* Nombre del cliente con avatar */}
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-highlight flex items-center justify-center text-white font-bold">
            {clienteNombre.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-base sm:text-lg truncate max-w-[150px]">
            {clienteNombre}
          </span>
        </div>
      </header>

      {/* Contenido central */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Banner instalación */}
        {!isStandalone && (
          <div className="bg-accent text-white p-4 rounded-lg shadow-md text-center mb-6 max-w-md">
            {isIos ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="material-icons">ios_share</span>
                  <h3 className="font-bold">Instala la app en tu iPhone</h3>
                </div>
                <p>
                  Abre el menú <span className="font-bold">Compartir</span> en Safari y
                  selecciona <span className="font-bold">“Agregar a pantalla de inicio”</span>.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="material-icons">download</span>
                  <h3 className="font-bold">Instala la app en tu Android</h3>
                </div>
                {deferredPrompt ? (
                  <button
                    onClick={handleInstallClick}
                    className="btn bg-highlight hover:bg-highlight/80 px-6 py-2 rounded-lg mt-3 flex items-center gap-2"
                  >
                    <span className="material-icons">install_mobile</span>
                    Instalar App
                  </button>
                ) : (
                  <p>
                    Usa el menú del navegador y selecciona <span className="font-bold">“Instalar App”</span>.
                  </p>
                )}
              </>
            )}
          </div>
        )}

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
