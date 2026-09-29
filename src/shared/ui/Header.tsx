import Logo from "../components/sidebar/Logo";

interface HeaderProps {
  onOpenSidebar: () => void;
  className?: string;
}

export default function Header({ onOpenSidebar, className = "" }: HeaderProps) {
  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-40
        h-16 md:h-20
        bg-surface/75 backdrop-blur-xl
        border-b border-white/[0.06]
        px-4 md:px-8
        flex items-center justify-between
        transition-all duration-200
        ${className}
      `.trim().replace(/\s+/g, " ")}
    >
      {/* Botón menú móvil (Hambuerguesa) */}
      <button
        onClick={onOpenSidebar}
        type="button"
        className="
          p-2
          rounded-xl
          bg-white/[0.04]
          border border-white/[0.08]
          text-muted hover:text-white
          hover:bg-white/[0.08] hover:border-white/15
          active:scale-95
          transition-all duration-150
          md:hidden
          cursor-pointer
        "
        aria-label="Abrir menú"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Espaciador izquierdo en desktop */}
      <div className="hidden md:block w-10" />

      {/* Logo perfectamente centrado y con resplandor sutil opcional */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center [&_div]:mb-0 scale-90 md:scale-100 transition-transform">
        <Logo />
      </div>

      {/* Espaciador derecho para mantener simetría en móvil */}
      <div className="w-9 md:w-10" />
    </header>
  );
}