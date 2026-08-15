import { useState } from "react";
import { Outlet } from "react-router-dom";

import { auth } from "../firebase/firebase";
import AdminSidebar from "../features/admin/components/AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="
        min-h-screen
        bg-background
        text-text
      "
    >
      {/* Botón hamburguesa móvil */}

      <button
        onClick={() => setSidebarOpen(true)}
        className="
          fixed

          top-4
          left-4

          z-30

          md:hidden

          w-11
          h-11

          rounded-xl

          bg-primary
          text-white

          flex
          items-center
          justify-center

          text-xl

          shadow-card
        "
      >
        ☰
      </button>

      {/* Overlay móvil */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="
            fixed
            inset-0

            bg-black/40

            z-40

            md:hidden
          "
        />
      )}

      {/* Sidebar */}

      <aside
        className={`

          fixed

          top-0
          left-0

          z-50

          h-screen

          w-64


          transition-transform
          duration-300
          ease-in-out


          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}


          md:translate-x-0

        `}
      >
        <AdminSidebar
          onLogout={() => auth.signOut()}
          onNavigate={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Contenido */}

      <main
        className="
    min-h-screen

    px-3
    sm:px-4
    lg:px-8

    pt-20
    md:pt-8

    md:ml-64

    overflow-x-hidden
  "
      >
        <div
          className="
            mx-auto

            w-full

            max-w-7xl

            space-y-6
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
