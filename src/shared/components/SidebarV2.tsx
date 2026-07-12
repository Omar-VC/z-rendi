type Props = {
  onLogout: () => void;
};

const SidebarV2 = ({ onLogout }: Props) => {
  return (
    <div className="p-4">
      <h2 className="font-bold text-xl">
        Z-Rendi
      </h2>

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