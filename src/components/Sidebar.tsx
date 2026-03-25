import { useState } from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón hamburguesa solo en mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-accent text-white p-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Overlay (solo visible en móvil cuando está abierto) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-secondary/40 backdrop-blur-md border-r border-white/20 shadow-lg text-white flex flex-col transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:w-64`}
        style={{ width: "16rem" }} // ancho fijo en móvil y desktop
      >
        {/* Logo */}
        <div className="p-4 text-center font-bold border-b border-white/20">
          Z-Rendi 🏋️‍♂️
        </div>

        {/* Links */}
        <nav className="flex-1 p-2 space-y-2">
          <Link
            to="/home"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-3 py-2 rounded hover:bg-highlight/40 transition-colors duration-300"
          >
            <span className="mr-2">🏠</span>
            <span className="inline">Home</span>
          </Link>
          <Link
            to="/clientes"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-3 py-2 rounded hover:bg-highlight/40 transition-colors duration-300"
          >
            <span className="mr-2">👥</span>
            <span className="inline">Clientes</span>
          </Link>
          <Link
            to="/guias"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-3 py-2 rounded hover:bg-highlight/40 transition-colors duration-300"
          >
            <span className="mr-2">📖</span>
            <span className="inline">Guías</span>
          </Link>
          <Link
            to="/seguimiento"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-3 py-2 rounded hover:bg-highlight/40 transition-colors duration-300"
          >
            <span className="mr-2">📊</span>
            <span className="inline">Seguimiento</span>
          </Link>
        </nav>

        {/* Botón salir */}
        <div className="p-4 border-t border-white/20 mt-auto">
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout?.();
            }}
            className="w-full bg-accent/70 px-3 py-2 rounded-lg hover:bg-highlight/60 text-white font-semibold transition duration-300 flex items-center justify-center shadow-md"
          >
            Salir
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
