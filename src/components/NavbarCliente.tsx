import { useState } from "react";

interface NavbarClienteProps {
  onChangeSection: (section: string) => void;
}

const NavbarCliente = ({ onChangeSection }: NavbarClienteProps) => {
  const [open, setOpen] = useState(false);

  const handleSectionChange = (section: string) => {
    onChangeSection(section);
    setOpen(false); // auto-cierra después de seleccionar
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50">
      {/* Botón hamburguesa siempre visible */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute bottom-4 left-4 w-12 h-12 rounded-lg backdrop-blur-md bg-white/20 border border-white/30 shadow-lg flex items-center justify-center text-white"
      >
        <svg
          className={`w-6 h-6 transform transition-transform duration-300 ${
            open ? "rotate-90" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Menú desplegable */}
      <div
        className={`absolute bottom-0 left-0 w-full backdrop-blur-md bg-gradient-to-t from-black/40 via-black/20 to-transparent border-t border-white/20 shadow-inner transform transition-all duration-300 ease-in-out ${
          open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="flex justify-around items-center h-16 pl-20">
          {/* Dejamos espacio (pl-20) para que no se superponga con el botón */}
          <button
            onClick={() => handleSectionChange("inicio")}
            className="flex flex-col items-center text-white hover:text-blue-400 transition"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9v9a2 2 0 01-2 2h-4a2 2 0 01-2-2v-7H9v7a2 2 0 01-2 2H3z" />
            </svg>
            <span className="text-xs">Inicio</span>
          </button>

          <button
            onClick={() => handleSectionChange("ficha")}
            className="flex flex-col items-center text-white hover:text-blue-400 transition"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 002-2V7a2 2 0 00-2-2h-2V3H9v2H7a2 2 0 00-2 2v3a2 2 0 002 2h2v2H7v2h10v-2h-2v-2h2z" />
            </svg>
            <span className="text-xs">Ficha</span>
          </button>

          <button
            onClick={() => handleSectionChange("cuotas")}
            className="flex flex-col items-center text-white hover:text-blue-400 transition"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 .9-4 2s1.79 2 4 2 4-.9 4-2-1.79-2-4-2zm0 10c-2.21 0-4-.9-4-2s1.79-2 4-2 4 .9 4 2-1.79 2-4 2z" />
            </svg>
            <span className="text-xs">Cuotas</span>
          </button>

          <button
            onClick={() => handleSectionChange("sesiones")}
            className="flex flex-col items-center text-white hover:text-blue-400 transition"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">Sesiones</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavbarCliente;

