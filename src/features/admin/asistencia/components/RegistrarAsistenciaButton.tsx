import { Button } from "../../../../shared/ui";

interface RegistrarAsistenciaButtonProps {
  onClick: () => void;
}

export default function RegistrarAsistenciaButton({
  onClick,
}: RegistrarAsistenciaButtonProps) {
  return (
    <Button
      variant="accent"
      className="!min-h-0 !h-8 !px-3 text-xs font-semibold shadow-[0_0_10px_rgba(255,85,0,0.2)]"
      onClick={onClick}
    >
      Asistencia
    </Button>
  );
}
