import { useState } from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* botón mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded"
        style={{ backgroundColor: "var(--surface-2)" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full flex flex-col transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{
          width: "16rem",
          backgroundColor: "var(--surface)",
          borderRight: "1px solid var(--border)",
          color: "var(--text)",
        }}
      >
        {/* logo */}
        <div className="p-4 text-center font-bold border-b"
          style={{ borderColor: "var(--border)" }}
        >
          Z-Rendi 🏋️‍♂️
        </div>

        {/* links */}
        <nav className="flex-1 p-2 space-y-2">
          {[
            ["🏠", "Home", "/home"],
            ["👥", "Clientes", "/clientes"],
            ["📖", "Guías", "/guias"],
            ["📊", "Seguimiento", "/seguimiento"],
          ].map(([icon, label, path]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2 rounded transition"
              style={{
                color: "var(--text)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.06)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <span className="mr-2">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* logout */}
        <div className="p-4 mt-auto border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout?.();
            }}
            className="w-full px-3 py-2 rounded font-semibold transition"
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary)")
            }
          >
            Salir
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;