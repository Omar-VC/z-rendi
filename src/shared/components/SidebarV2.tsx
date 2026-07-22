import { useNavigate } from "react-router-dom";

type Props = {
  onLogout: () => void;
};

const SidebarV2 = ({ onLogout }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        h-full
        flex
        flex-col
        p-6
        bg-primary
        text-white
      "
    >

      {/* Marca */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold">
          Z-Rendi
        </h2>

        <p className="text-sm text-white/60 mt-1">
          Preparación física
        </p>
      </div>


      {/* Navegación */}
      <nav className="flex-1 space-y-2">

        <button
          onClick={() => navigate("/clientes")}
          className="
            w-full
            text-left
            px-4
            py-3
            rounded-xl
            hover:bg-white/10
            transition
          "
        >
          Clientes
        </button>


        <button
          onClick={() => navigate("/biblioteca")}
          className="
            w-full
            text-left
            px-4
            py-3
            rounded-xl
            hover:bg-white/10
            transition
          "
        >
          Biblioteca
        </button>

      </nav>


      {/* Logout */}
      <button
        onClick={onLogout}
        className="
          w-full
          px-4
          py-3
          rounded-xl
          bg-white/10
          hover:bg-accent
          transition
        "
      >
        Salir
      </button>

    </div>
  );
};

export default SidebarV2;