import { useState } from "react";
import FichaResumen from "../../fichas/components/FichaResumen";
import FichaForm from "../../fichas/components/FichaForm";
import type { FichaCliente } from "../../fichas/types";

type Props = {
  clienteId: string;
  ficha: FichaCliente | null;
  onRecargarFicha: () => Promise<void>;
};

export default function TabFichaSection({
  clienteId,
  ficha,
  onRecargarFicha,
}: Props) {
  const [editandoFicha, setEditandoFicha] = useState(false);

  if (editandoFicha) {
    return (
      <FichaForm
        clienteId={clienteId}
        ficha={ficha}
        onGuardado={async () => {
          await onRecargarFicha();
          setEditandoFicha(false);
        }}
        onCancelar={() => setEditandoFicha(false)}
      />
    );
  }

  return (
    <FichaResumen
      ficha={ficha}
      onEditar={() => setEditandoFicha(true)}
    />
  );
}
