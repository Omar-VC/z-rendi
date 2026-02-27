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

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-secondary/40 backdrop-blur-md border-r border-white/20 shadow-lg text-white flex flex-col transition-all duration-300 z-40
        ${isOpen ? "w-64" : "w-0 md:w-64"} overflow-hidden`}
      >
        {/* Logo */}
        <div className="p-4 text-center font-bold border-b border-white/20">
          Z-Rendi 🏋️‍♂️
        </div>

        {/* Links */}
        <nav className="flex-1 p-2 space-y-2">
          <Link
            to="/home"
            className="flex items-center px-3 py-2 rounded hover:bg-highlight/40 transition-colors duration-300"
          >
            <span className="mr-2">🏠</span>
            <span className="inline">Home</span>
          </Link>
          <Link
            to="/clientes"
            className="flex items-center px-3 py-2 rounded hover:bg-highlight/40 transition-colors duration-300"
          >
            <span className="mr-2">👥</span>
            <span className="inline">Clientes</span>
          </Link>
        </nav>

        {/* Botón salir siempre visible */}
        <div className="p-4 border-t border-white/20 mt-auto">
          <button
            onClick={onLogout}
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
