import NavbarBase from "./NavbarBase";

const Navbar = () => {
  const items = [
    { to: "/home", label: "Home" },
    { to: "/clientes", label: "Clientes" },
  ];

  return <NavbarBase items={items} bgClass="bg-secondary" />;
};

export default Navbar;
