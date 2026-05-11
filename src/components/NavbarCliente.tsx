import { useState } from "react";

interface NavbarClienteProps {
  onChangeSection: (section: string) => void;
}

const NavbarCliente = ({
  onChangeSection,
}: NavbarClienteProps) => {
  const [active, setActive] = useState("inicio");

  const items = [
    {
      id: "inicio",
      label: "Inicio",
      icon: "home",
    },
    {
      id: "ficha",
      label: "Ficha",
      icon: "badge",
    },
    {
      id: "cuotas",
      label: "Cuotas",
      icon: "payments",
    },
    {
      id: "sesiones",
      label: "Sesiones",
      icon: "fitness_center",
    },
    {
      id: "guias",
      label: "Guías",
      icon: "menu_book",
    },
  ];

  const handleClick = (section: string) => {
    setActive(section);
    onChangeSection(section);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 px-3 pb-3">
      <div
        className="
          max-w-3xl mx-auto
          backdrop-blur-2xl
          border
          rounded-3xl
          px-2 py-2
          shadow-2xl
        "
        style={{
          backgroundColor: "rgba(15,15,16,0.75)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center justify-around">
          {items.map((item) => {
            const isActive = active === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className="
                  relative
                  flex flex-col items-center justify-center
                  gap-1
                  py-2 px-3
                  rounded-2xl
                  transition-all duration-300
                  min-w-[64px]
                "
                style={{
                  backgroundColor: isActive
                    ? "rgba(220,38,38,0.15)"
                    : "transparent",
                }}
              >
                {/* Glow */}
                {isActive && (
                  <div
                    className="
                      absolute inset-0
                      rounded-2xl
                      blur-xl
                      opacity-40
                    "
                    style={{
                      backgroundColor: "rgba(220,38,38,0.25)",
                    }}
                  />
                )}

                {/* Icon */}
                <span
                  className={`
                    material-icons relative z-10
                    transition-all duration-300
                    ${
                      isActive
                        ? "text-white scale-110"
                        : "text-gray-500"
                    }
                  `}
                >
                  {item.icon}
                </span>

                {/* Label */}
                <span
                  className={`
                    text-[11px] relative z-10
                    transition-all duration-300
                    ${
                      isActive
                        ? "text-white"
                        : "text-gray-500"
                    }
                  `}
                >
                  {item.label}
                </span>

                {/* Dot */}
                {isActive && (
                  <div
                    className="
                      w-1 h-1 rounded-full
                      mt-1 relative z-10
                    "
                    style={{
                      backgroundColor: "white",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavbarCliente;