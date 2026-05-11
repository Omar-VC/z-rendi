import { Outlet } from "react-router-dom";
import { auth } from "../firebase";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  return (
    <div
      className="flex min-h-screen text-white flex-col md:flex-row"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Sidebar */}
      <aside className="w-full md:w-64 md:fixed md:h-screen">
        <Sidebar onLogout={() => auth.signOut()} />
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-[72px] md:pt-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;