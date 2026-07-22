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
      onClick={onClick}
    >
      Marcar asistencia
    </Button>
  );
}


export default RegistrarAsistenciaButton;