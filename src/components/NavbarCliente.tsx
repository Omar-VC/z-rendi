import { FaHome } from "react-icons/fa";
import NavbarBase from "./NavbarBase";

const NavbarCliente = () => {
  const items = [
    { to: "/cliente-dashboard", label: "Inicio", icon: <FaHome size={24} /> },
  ];

  return <NavbarBase items={items} bgClass="bg-highlight" />;
};

export default NavbarCliente;
