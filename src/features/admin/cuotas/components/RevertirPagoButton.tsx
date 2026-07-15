import { revertirPago } from "../services/cuotas.service";

interface Props {
  cuotaId: string;
  onRevertido: () => void;
}


function RevertirPagoButton({
  cuotaId,
  onRevertido,
}: Props) {


  const handleClick = async () => {

    const confirmar = window.confirm(
      "¿Seguro que desea revertir este pago?"
    );


    if (!confirmar) return;


    await revertirPago(cuotaId);

    onRevertido();

  };


  return (

    <button
      onClick={handleClick}
      className="mt-3 px-3 py-1 rounded-lg"
    >
      Revertir pago
    </button>

  );

}


export default RevertirPagoButton;