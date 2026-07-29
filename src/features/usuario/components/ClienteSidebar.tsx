import Sidebar from "../../../shared/components/sidebar/Sidebar";
import SidebarItem from "../../../shared/components/sidebar/SidebarItem";
import Logo from "../../../shared/components/sidebar/Logo";

interface Props {
  onLogout: () => void;
  onNavigate?: () => void;
}

export default function ClienteSidebar({ onLogout, onNavigate }: Props) {
  return (
    <Sidebar>
      <Logo />

      <nav className="space-y-2">
        <SidebarItem
          label="Inicio"
          icon="🏠"
          path="/cliente"
          onNavigate={onNavigate}
        />

        <SidebarItem
          label="Mi ficha"
          icon="👤"
          path="/cliente/ficha"
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

    rounded-xl

    bg-white/10

    border
    border-white/10

    text-white/80

    hover:bg-accent
    hover:text-white

    transition-all
  "
      >
        Salir
      </button>
    </Sidebar>
  );
}
