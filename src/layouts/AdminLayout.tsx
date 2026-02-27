import { Outlet } from "react-router-dom";
import { auth } from "../firebase";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-primary text-white">
      <Sidebar onLogout={() => auth.signOut()} />
      {/* En desktop, margen fijo para sidebar ancho */}
      <main className="flex-1 p-8 md:ml-64 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
