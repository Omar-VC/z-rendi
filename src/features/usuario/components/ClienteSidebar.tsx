import { ChartNoAxesCombined, Footprints, House, LogOut, UserRound } from "lucide-react";
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

      <nav className="space-y-2 mt-4">
        <SidebarItem
          label="Inicio"
          icon={<House className="h-5 w-5" strokeWidth={1.8} />}
          path="/cliente"
          onNavigate={onNavigate}
        />

        <SidebarItem
          label="Mi ficha"
          icon={<UserRound className="h-5 w-5" strokeWidth={1.8} />}
          path="/cliente/ficha"
          onNavigate={onNavigate}
        />

        <SidebarItem
          label="Mi rendimiento"
          icon={<ChartNoAxesCombined className="h-5 w-5" strokeWidth={1.8} />}
          path="/cliente/rendimiento"
          onNavigate={onNavigate}
        />

        <SidebarItem
          label="Running"
          icon={<Footprints className="h-5 w-5" strokeWidth={1.8} />}
          path="/cliente/running"
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
        <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
        <span>Salir</span>
      </button>
    </Sidebar>
  );
}
