import { CalendarDays, ChartNoAxesCombined, ClipboardList, LibraryBig, LogOut, Shield, UsersRound } from "lucide-react";
import Sidebar from "../../../shared/components/sidebar/Sidebar";
import SidebarItem from "../../../shared/components/sidebar/SidebarItem";
import Logo from "../../../shared/components/sidebar/Logo";

interface Props {
  onLogout: () => void;
  onNavigate?: () => void;
}

export default function AdminSidebar({ onLogout, onNavigate }: Props) {
  return (
    <Sidebar>
      <Logo />
      <nav className="space-y-2 mt-4">
        <SidebarItem
          label="Hoy"
          icon={<CalendarDays className="h-5 w-5" strokeWidth={1.8} />}
          path="/hoy"
          onNavigate={onNavigate}
        />
        <SidebarItem
          label="Clientes"
          icon={<UsersRound className="h-5 w-5" strokeWidth={1.8} />}
          path="/clientes"
          onNavigate={onNavigate}
        />

        {/* ⚽ ITEM DE NAVEGACIÓN A PLANTELES */}
        <SidebarItem
          label="Equipos / Planteles"
          icon={<Shield className="h-5 w-5" strokeWidth={1.8} />}
          path="/equipos"
          onNavigate={onNavigate}
        />

        <SidebarItem
          label="Biblioteca"
          icon={<LibraryBig className="h-5 w-5" strokeWidth={1.8} />}
          path="/biblioteca"
          onNavigate={onNavigate}
        />

        <SidebarItem
          label="Informes"
          icon={<ChartNoAxesCombined className="h-5 w-5" strokeWidth={1.8} />}
          path="/informes"
          onNavigate={onNavigate}
        />

        <SidebarItem
          label="Relevamientos"
          icon={<ClipboardList className="h-5 w-5" strokeWidth={1.8} />}
          path="/relevamientos"
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
