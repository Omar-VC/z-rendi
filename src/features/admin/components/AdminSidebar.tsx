import Sidebar from "../../../shared/components/sidebar/Sidebar";
import SidebarItem from "../../../shared/components/sidebar/SidebarItem";
import Logo from "../../../shared/components/sidebar/Logo";

interface Props {
  onLogout: () => void;
  onNavigate?: () => void;
}

export default function AdminSidebar({
  onLogout,
  onNavigate,
}: Props) {
  return (
    <Sidebar>
      <Logo />

      <nav className="space-y-2 mt-4">
        <SidebarItem
          label="Clientes"
          icon="👥"
          path="/clientes"
          onNavigate={onNavigate}
        />

        <SidebarItem
          label="Biblioteca"
          icon="📚"
          path="/biblioteca"
          onNavigate={onNavigate}
        />
      </nav>

      <button
        onClick={onLogout}
        className="
          mt-auto
          w-full
          px-4
          py-3
          rounded-card
          bg-surfaceSoft/60
          border
          border-border/60
          text-text/80
          hover:bg-primary/10
          hover:border-primary/40
          hover:text-primary
          transition-all
          duration-200
          font-medium
          text-sm
          flex
          items-center
          justify-center
          gap-2
        "
      >
        <span>🚪</span>
        <span>Salir</span>
      </button>
    </Sidebar>
  );
}