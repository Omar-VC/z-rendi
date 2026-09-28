import { useState } from "react";
import type { Cuota } from "../../cuotas/types";
import CuotaResumen from "../../cuotas/components/CuotaResumen";
import CuotaForm from "../../cuotas/components/CuotaForm";
import RegistrarPagoForm from "../../cuotas/components/RegistrarPagoForm";
import EditarCuotaForm from "../../cuotas/components/EditarCuotaForm";
import ReciboPago from "../../cuotas/components/ReciboPago";

type Props = {
  clienteId: string;
  clienteNombre: string;
  cuotas: Cuota[];
  onRecargarCuotas: () => Promise<void>;
};

export default function TabCuotasSection({
  clienteId,
  clienteNombre,
  cuotas,
  onRecargarCuotas,
}: Props) {
  const [creandoCuota, setCreandoCuota] = useState(false);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState<Cuota | null>(null);
  const [cuotaEditando, setCuotaEditando] = useState<Cuota | null>(null);
  const [cuotaRecibo, setCuotaRecibo] = useState<Cuota | null>(null);

  if (creandoCuota) {
    return (
      <CuotaForm
        clienteId={clienteId}
        onGuardado={async () => {
          await onRecargarCuotas();
          setCreandoCuota(false);
        }}
        onCancelar={() => setCreandoCuota(false)}
      />
    );
  }

  if (cuotaSeleccionada) {
    return (
      <RegistrarPagoForm
        cuota={cuotaSeleccionada}
        onGuardado={async () => {
          await onRecargarCuotas();
          setCuotaSeleccionada(null);
        }}
        onCancelar={() => setCuotaSeleccionada(null)}
      />
    );
  }

  if (cuotaEditando) {
    return (
      <EditarCuotaForm
        cuota={cuotaEditando}
        onGuardado={async () => {
          await onRecargarCuotas();
          setCuotaEditando(null);
        }}
        onCancelar={() => setCuotaEditando(null)}
      />
    );
  }

  if (cuotaRecibo) {
    return (
      <ReciboPago
        cuota={cuotaRecibo}
        clienteNombre={clienteNombre}
        onCerrar={() => setCuotaRecibo(null)}
      />
    );
  }

  return (
    <CuotaResumen
      cuotas={cuotas}
      onCrear={() => setCreandoCuota(true)}
      onRegistrarPago={(cuota) => setCuotaSeleccionada(cuota)}
      onEditar={(cuota) => setCuotaEditando(cuota)}
      onVerRecibo={(cuota) => setCuotaRecibo(cuota)}
      onRevertido={async () => await onRecargarCuotas()}
    />
  );
}