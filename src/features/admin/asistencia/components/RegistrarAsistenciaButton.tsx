import { Button } from "../../../../shared/ui";

interface RegistrarAsistenciaButtonProps {
  onClick: () => void;
}

function RegistrarAsistenciaButton({
  onClick,
}: RegistrarAsistenciaButtonProps) {
  return (
    <Button
      variant="accent"
      className="!min-h-0 !h-9 !px-2 !py-1 text-sm"
      onClick={onClick}
    >
      Asistencia
    </Button>
  );
}

export default RegistrarAsistenciaButton;
