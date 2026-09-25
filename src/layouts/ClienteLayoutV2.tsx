import { useState } from "react";
import { Outlet } from "react-router-dom";

import { auth } from "../firebase/firebase";
import ClienteSidebar from "../features/usuario/components/ClienteSidebar";
import Logo from "../shared/components/sidebar/Logo";

function ClienteLayoutV2() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-text relative selection:bg-primary/20 selection:text-primary">
      {/* Luz ambiental sutil para el fondo general sin saturar */}
      <div className="fixed top-0 left-64 w-96 h-96 bg-primary/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Header fijo translúcido sin bordes ni líneas divisorias */}
      <header className="fixed top-0 left-0 right-0 z-40 h-20 bg-background/80 backdrop-blur-md px-6 flex items-center justify-between md:ml-64">
        {/* Botón menú móvil tactil y limpio */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2.5 rounded-xl bg-surfaceSoft/60 text-text hover:text-primary active:scale-95 transition-all md:hidden"
          aria-label="Abrir menú"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Espaciador invisible para balance en desktop */}
        <div className="hidden md:block w-10" />

        {/* Logo perfectamente centrado */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center [&_div]:mb-0 scale-90">
          <Logo />
        </div>

        {/* Espacio derecho para equilibrar */}
        <div className="w-10 md:w-0" />
      </header>

      {/* Overlay móvil difuminado */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <ClienteSidebar
          onLogout={() => auth.signOut()}
          onNavigate={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Contenido Principal con margen limpio y espaciado */}
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 pt-24 md:pt-24 md:ml-64 overflow-x-hidden relative z-10">
        <div className="mx-auto w-full max-w-7xl space-y-6 pb-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ClienteLayoutV2;