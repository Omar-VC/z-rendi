import { Outlet } from "react-router-dom";
import { auth } from "../firebase/firebase";
import SidebarV2 from "../shared/components/SidebarV2";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-background text-primary flex-col md:flex-row">

      <aside className="w-full md:w-64 md:fixed md:h-screen shadow-lg">
        <SidebarV2 onLogout={() => auth.signOut()} />
      </aside>

      <main
        className="
          flex-1
          min-w-0
          md:ml-64
          p-6
          lg:p-8
          pt-[72px]
          md:pt-8
          overflow-x-hidden
        "
      >
        <div className="mx-auto w-full max-w-7xl space-y-6">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;