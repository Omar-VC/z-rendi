import Logo from "../components/sidebar/Logo";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export default function Header({ onOpenSidebar }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-20 bg-surface/80 backdrop-blur-md border-b border-border/60 px-6 flex items-center justify-between">
      {/* Botón menú móvil */}
      <button
        onClick={onOpenSidebar}
        className="p-2.5 rounded-card bg-surfaceSoft/40 border border-border/60 text-text hover:border-primary/40 hover:text-primary transition-all duration-200 md:hidden"
        aria-label="Abrir menú"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            className="text-text"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Espaciador invisible para balancear en desktop */}
      <div className="hidden md:block w-10" />

      {/* Logo perfectamente centrado neutralizando su mb-10 interno */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center [&_div]:mb-0 scale-90">
        <Logo />
      </div>

      {/* Espacio derecho para equilibrar */}
      <div className="w-10 md:w-0" />
    </header>
  );
}