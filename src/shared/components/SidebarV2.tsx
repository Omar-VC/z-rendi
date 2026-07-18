import { useNavigate } from "react-router-dom";

type Props = {
  onLogout: () => void;
};

const SidebarV2 = ({ onLogout }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">

      <h2 className="font-bold text-xl">
        Z-Rendi
      </h2>


      <nav className="space-y-2">

        <button
          onClick={() => navigate("/clientes")}
          className="block"
        >
          Clientes
        </button>


        <button
          onClick={() => navigate("/biblioteca")}
          className="block"
        >
          Biblioteca
        </button>


      </nav>


      <button
        onClick={onLogout}
        className="mt-4"
      >
        Salir
      </button>

    </div>
  );
};

export default SidebarV2;