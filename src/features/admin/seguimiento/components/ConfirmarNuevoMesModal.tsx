import {
  Modal,
  Button,
} from "../../../../shared/ui";

type Props = {
  mes: string;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export default function ConfirmarNuevoMesModal({
  mes,
  onConfirmar,
  onCancelar,
}: Props) {

  return (

    <Modal
      title="Nuevo mes"
      onClose={onCancelar}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onCancelar}
          >
            Más tarde
          </Button>

          <Button
            variant="danger"
            onClick={onConfirmar}
          >
            Limpiar registro
          </Button>
        </>
      }
    >

      <p>
        Comenzó un nuevo mes.
      </p>

      <p className="mt-3">
        ¿Desea eliminar las sesiones de <strong>{mes}</strong> y comenzar un nuevo registro mensual?
      </p>

    </Modal>

  );

}