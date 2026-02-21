import React, { useState } from "react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  role?: string | null;
}

const Navbar: React.FC<NavbarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed bottom-0 left-0 w-full z-50">
      <div className="flex justify-center items-center space-x-8 py-3">
        {/* Botón hamburguesa en mobile */}
        <button
          className="md:hidden text-slate-900 transition-transform duration-300 absolute left-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Links en desktop (centrados y separados) */}
        <div className="hidden md:flex space-x-12">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `font-semibold transition-colors duration-300 ${
                isActive ? "text-blue-600" : "text-gray-700"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              `font-semibold transition-colors duration-300 ${
                isActive ? "text-blue-600" : "text-gray-700"
              }`
            }
          >
            Clientes
          </NavLink>
        </div>
      </div>

      {/* Links en mobile con animación suave */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center space-y-4 pb-4">
          <NavLink
            to="/home"
            className="font-semibold text-gray-700 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/clientes"
            className="font-semibold text-gray-700 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Clientes
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
