import { NavLink } from "react-router-dom";

interface NavItem {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

interface NavbarBaseProps {
  items: NavItem[];
  position?: "top" | "bottom";
  bgClass?: string;
}

const NavbarBase: React.FC<NavbarBaseProps> = ({ items, position="bottom", bgClass="bg-primary" }) => {
  return (
    <nav className={`fixed ${position}-0 left-0 right-0 ${bgClass} p-3 text-white flex justify-center`}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center mx-4 transition-colors duration-300 ${
              isActive ? "text-highlight" : "text-gray-300"
            }`
          }
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default NavbarBase;
