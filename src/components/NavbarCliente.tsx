import { FaHome, FaUser, FaMoneyBill, FaCalendarAlt } from "react-icons/fa";

interface NavbarClienteProps {
  onChangeSection: (section: string) => void;
}

const NavbarCliente: React.FC<NavbarClienteProps> = ({ onChangeSection }) => {
  const items = [
    { section: "inicio", label: "Inicio", icon: <FaHome size={22} /> },
    { section: "ficha", label: "Ficha", icon: <FaUser size={22} /> },
    { section: "cuotas", label: "Cuotas", icon: <FaMoneyBill size={22} /> },
    { section: "sesiones", label: "Sesiones", icon: <FaCalendarAlt size={22} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-secondary p-3 text-white flex justify-around z-50">
      {items.map((item) => (
        <button
          key={item.section}
          onClick={() => onChangeSection(item.section)}
          className="flex flex-col items-center transition-colors duration-300 text-gray-300 hover:text-highlight"
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default NavbarCliente;

