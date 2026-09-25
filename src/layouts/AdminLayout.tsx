import { useState } from "react";
import { Outlet } from "react-router-dom";

import { auth } from "../firebase/firebase";
import AdminSidebar from "../features/admin/components/AdminSidebar";
import Logo from "../shared/components/sidebar/Logo";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-text relative selection:bg-primary/20 selection:text-primary">
      {/* Luz ambiental sutil para el fondo general del admin */}
      <div className="fixed top-0 left-64 w-96 h-96 bg-primary/5 rounded-full blur-[140px] pointer-events-none z-0 hidden lg:block" />

      {/* Header fijo translúcido sin bordes ni divisiones */}
      <header className="fixed top-0 left-0 right-0 z-40 h-20 bg-background/80 backdrop-blur-md px-6 flex items-center justify-between lg:ml-64">
        {/* Botón menú móvil y tablets */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2.5 rounded-xl bg-surfaceSoft/60 text-text hover:text-primary active:scale-95 transition-all lg:hidden"
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

        {/* Espaciador invisible para balancear en desktop */}
        <div className="hidden lg:block w-10" />

        {/* Logo perfectamente centrado neutralizando su mb-10 interno */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center [&_div]:mb-0 scale-90">
          <Logo />
        </div>

        {/* Espacio derecho para equilibrar */}
        <div className="w-10 lg:w-0" />
      </header>

      {/* Overlay móvil y tablets difuminado */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar contenedor */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <AdminSidebar
          onLogout={() => auth.signOut()}
          onNavigate={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Contenido Principal con margen superior compensado y máxima amplitud */}
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 pt-24 lg:pt-24 lg:ml-64 overflow-x-hidden relative z-10">
        <div className="mx-auto w-full max-w-7xl space-y-6 pb-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;