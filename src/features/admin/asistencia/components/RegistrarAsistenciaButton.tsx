interface RegistrarAsistenciaButtonProps {
  onClick: () => void;
}

function RegistrarAsistenciaButton({
  onClick,
}: RegistrarAsistenciaButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-lg"
    >
      Marcar asistencia
    </button>
  );
}

export default RegistrarAsistenciaButton;