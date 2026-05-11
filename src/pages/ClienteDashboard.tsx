import { useState, useEffect } from "react";
import { auth } from "../firebase";

import { useFichas } from "../features/fichas/hooks/useFichas";
import { useCuotas } from "../features/cuotas/hooks/useCuotas";
import { useSesiones } from "../features/sesiones/hooks/useSesiones";

import NavbarCliente from "../components/NavbarCliente";

import FichaDetail from "../features/fichas/components/FichaDetail";
import SesionesClienteView from "../features/sesiones/components/SesionesClienteView";
import CuotasCliente from "../features/cuotas/components/CuotasCliente";

import GuiasPage from "../pages/GuiasPage";

const ClienteDashboard = ({
  clienteId,
  clienteNombre,
}: {
  clienteId: string;
  clienteNombre: string;
}) => {
  const { fichas } = useFichas(clienteId);
  const { cuotas } = useCuotas(clienteId);
  const { sesiones } = useSesiones(clienteId);

  const ficha = fichas[0];
  const cuota = cuotas[0];
  const sesionActual = sesiones[0];

  const [activeSection, setActiveSection] = useState("inicio");

  // ---------------- PWA ----------------
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();

    const ios = /iphone|ipad|ipod/.test(userAgent);

    const standalone = window.matchMedia("(display-mode: standalone)").matches;

    setIsIos(ios);
    setIsStandalone(standalone);

    window.addEventListener("beforeinstallprompt", (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
  };

  // ---------------- HOME CARDS ----------------
  const homeCards = [
    {
      id: "ficha",
      title: "Mi ficha",
      subtitle: ficha
        ? "Ver información física y deportiva"
        : "Sin ficha asignada",
      icon: "badge",
    },
    {
      id: "sesiones",
      title: "Sesiones",
      subtitle: sesionActual
        ? "Ver entrenamientos asignados"
        : "Sin sesiones asignadas",
      icon: "fitness_center",
    },
    {
      id: "cuotas",
      title: "Cuotas",
      subtitle: cuota ? "Consultar estado de pagos" : "Sin cuotas asignadas",
      icon: "payments",
    },
    {
      id: "guias",
      title: "Guías",
      subtitle: "Material y contenido de apoyo",
      icon: "menu_book",
    },
  ];

  return (
    <div
      className="min-h-screen text-white pb-24"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* HEADER */}
      <header
        className="
          sticky top-0 z-40
          backdrop-blur-xl
          border-b
        "
        style={{
          backgroundColor: "rgba(15,15,16,0.85)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* IZQUIERDA */}
          <div className="flex items-center gap-3">
            <div
              className="
                w-11 h-11 rounded-2xl
                flex items-center justify-center
                font-bold text-lg
              "
              style={{
                backgroundColor: "var(--primary)",
              }}
            >
              {clienteNombre.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm text-gray-400">Bienvenido</p>

              <h2 className="font-semibold text-base sm:text-lg">
                {clienteNombre}
              </h2>
            </div>
          </div>

          {/* DERECHA */}
          <button
            onClick={() => auth.signOut()}
            className="
              flex items-center gap-2
              px-4 py-2 rounded-xl
              border border-white/10
              hover:bg-white/5
              transition
            "
          >
            <span className="material-icons text-[20px]">logout</span>

            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* BANNER APP */}
        {!isStandalone && showBanner && (
          <div
            className="
              relative overflow-hidden
              rounded-2xl p-5 mb-6
              border
            "
            style={{
              background:
                "linear-gradient(135deg, rgba(220,38,38,0.25), rgba(255,255,255,0.03))",
              borderColor: "rgba(220,38,38,0.3)",
            }}
          >
            <button
              onClick={() => setShowBanner(false)}
              className="absolute top-3 right-3 text-gray-300 hover:text-white"
            >
              <span className="material-icons text-[18px]">close</span>
            </button>

            <div className="flex items-start gap-4">
              <div
                className="
                  min-w-[52px] h-[52px]
                  rounded-2xl
                  flex items-center justify-center
                "
                style={{
                  backgroundColor: "rgba(220,38,38,0.2)",
                }}
              >
                <span className="material-icons text-3xl">install_mobile</span>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Instala Z-Rendi</h3>

                <p className="text-sm text-gray-300 mb-4">
                  Accede más rápido desde tu pantalla principal.
                </p>

                {isIos ? (
                  <p className="text-sm text-gray-300">
                    En Safari presiona <strong>Compartir</strong> y luego{" "}
                    <strong>“Agregar a pantalla de inicio”</strong>.
                  </p>
                ) : deferredPrompt ? (
                  <button
                    onClick={handleInstallClick}
                    className="btn btn-primary"
                  >
                    Instalar aplicación
                  </button>
                ) : (
                  <p className="text-sm text-gray-300">
                    Usa el menú del navegador y selecciona{" "}
                    <strong>“Instalar app”</strong>.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* INICIO */}
        {activeSection === "inicio" && (
          <div className="space-y-8">
            {/* HERO */}
            <section
              className="
                rounded-3xl p-8
                border overflow-hidden relative
              "
              style={{
                background:
                  "linear-gradient(135deg, rgba(220,38,38,0.18), rgba(255,255,255,0.02))",
                borderColor: "var(--border)",
              }}
            >
              <div className="relative z-10">
                <img
                  src="/logo.jpeg"
                  alt="Logo"
                  className="
                    w-24 sm:w-32
                    mb-6
                    drop-shadow-2xl
                    animate-zoomFadeIn
                  "
                />

                <h1 className="text-3xl sm:text-4xl font-bold mb-3">Z-Rendi</h1>

                <p className="text-gray-300 max-w-xl leading-relaxed">
                  Tu espacio personal para seguimiento, entrenamientos, fichas y
                  rendimiento.
                </p>
              </div>

              <div
                className="
                  absolute -right-20 -top-20
                  w-72 h-72 rounded-full blur-3xl
                "
                style={{
                  backgroundColor: "rgba(220,38,38,0.15)",
                }}
              />
            </section>

            {/* ACCESOS */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {homeCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setActiveSection(card.id)}
                    className="
                      text-left
                      rounded-2xl p-5
                      border
                      hover:scale-[1.01]
                      hover:bg-white/[0.03]
                      transition-all
                    "
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="
                          w-14 h-14 rounded-2xl
                          flex items-center justify-center
                        "
                        style={{
                          backgroundColor: "rgba(220,38,38,0.15)",
                        }}
                      >
                        <span className="material-icons text-3xl">
                          {card.icon}
                        </span>
                      </div>

                      <span className="material-icons text-gray-500">
                        arrow_forward_ios
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold mb-1">{card.title}</h3>

                    <p className="text-sm text-gray-400">{card.subtitle}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* FICHA */}
        {activeSection === "ficha" && (
          <div className="space-y-4">
            <button
              onClick={() => setActiveSection("inicio")}
              className="text-sm text-gray-400 hover:text-white"
            >
              ← Volver
            </button>

            <div className="card">
              {ficha ? (
                <FichaDetail
                  ficha={ficha}
                  onClose={() => setActiveSection("inicio")}
                />
              ) : (
                <p className="text-gray-400">
                  Todavía no tenés ficha asignada.
                </p>
              )}
            </div>
          </div>
        )}

        {/* CUOTAS */}
        {activeSection === "cuotas" && (
          <div className="w-full max-w-3xl">
            <CuotasCliente clienteId={clienteId} adminMode={false} />
          </div>
        )}


        {/* SESIONES */}
        {activeSection === "sesiones" && (
          <div className="space-y-4">
            <button
              onClick={() => setActiveSection("inicio")}
              className="text-sm text-gray-400 hover:text-white"
            >
              ← Volver
            </button>

            <div className="card">
              {sesionActual ? (
                <SesionesClienteView clienteId={clienteId} />
              ) : (
                <p className="text-gray-400">
                  Todavía no tenés sesiones asignadas.
                </p>
              )}
            </div>
          </div>
        )}

        {/* GUIAS */}
        {activeSection === "guias" && (
          <div className="space-y-4">
            <button
              onClick={() => setActiveSection("inicio")}
              className="text-sm text-gray-400 hover:text-white"
            >
              ← Volver
            </button>

            <div className="card">
              <GuiasPage />
            </div>
          </div>
        )}
      </main>

      {/* NAVBAR */}
      <NavbarCliente onChangeSection={setActiveSection} />
    </div>
  );
};

export default ClienteDashboard;
