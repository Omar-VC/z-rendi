import { useState } from "react";
import { revertirPago } from "../services/cuotas.service";
import { Button } from "../../../../shared/ui";

interface Props {
  cuotaId: string;
  onRevertido: () => void;
}

export default function RevertirPagoButton({
  cuotaId,
  onRevertido,
}: Props) {
  const [cargando, setCargando] = useState(false);

  const handleClick = async () => {
    const confirmar = window.confirm(
      "¿Seguro que desea revertir este pago?"
    );

    if (!confirmar) return;

    setCargando(true);
    try {
      await revertirPago(cuotaId);
      onRevertido();
    } catch (error) {
      console.error("Error al revertir el pago", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Button
      variant="secondary"
      className="!h-8 !px-3 text-xs"
      onClick={handleClick}
      disabled={cargando}
    >
      {cargando ? "Revirtiendo..." : "Revertir"}
    </Button>
  );
}