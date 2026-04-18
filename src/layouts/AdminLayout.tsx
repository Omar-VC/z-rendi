// src/layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import { auth } from "../firebase";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  return (
    <div
      className="flex min-h-screen text-white"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Sidebar fijo */}
      <aside className="w-64 fixed h-screen">
        <Sidebar onLogout={() => auth.signOut()} />
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;