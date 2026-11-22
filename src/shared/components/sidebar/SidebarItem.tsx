import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  label: string;
  icon: ReactNode;
  path: string;
  onNavigate?: () => void;
}

export default function SidebarItem({ label, icon, path, onNavigate }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const activo = location.pathname === path;

  function handleClick() {
    navigate(path);
    onNavigate?.();
  }

  return (
    <button
      onClick={handleClick}
      aria-current={activo ? "page" : undefined}
      className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 ${
        activo
          ? "border-white/10 bg-white/15 text-white shadow-lg shadow-black/10"
          : "border-transparent text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors ${
          activo
            ? "bg-emerald-300/15 text-emerald-200"
            : "bg-white/[0.04] text-white/65 group-hover:bg-white/10 group-hover:text-white"
        }`}
      >
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
