import { FaHome } from "react-icons/fa"; // 👈 usando react-icons

const NavbarCliente = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-blue-600 p-3 text-white flex justify-center items-center">
      <button
        onClick={() => (window.location.href = "/cliente-dashboard")}
        className="flex flex-col items-center justify-center"
      >
        <FaHome size={24} />
        <span className="text-xs mt-1">Inicio</span>
      </button>
    </nav>
  );
};

export default NavbarCliente;
