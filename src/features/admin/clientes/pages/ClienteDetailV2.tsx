import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Cliente } from "../types";
import { getClienteById } from "../services/clientes.service";
import ClienteHeader from "../components/ClienteHeader";
import ClienteQuickStatus from "../components/ClienteQuickStatus";

import FichaResumen from "../../fichas/components/FichaResumen";
import FichaForm from "../../fichas/components/FichaForm";
import { useFichaCliente } from "../../fichas/hooks/useFichaCliente";
import CuotaResumen from "../../cuotas/components/CuotaResumen";
import { useCuotasCliente } from "../../cuotas/hooks/useCuotasCliente";
import CuotaForm from "../../cuotas/components/CuotaForm";
import type { Cuota } from "../../cuotas/types";
import RegistrarPagoForm from "../../cuotas/components/RegistrarPagoForm";
import EditarCuotaForm from "../../cuotas/components/EditarCuotaForm";
import ReciboPago from "../../cuotas/components/ReciboPago";
import ClienteTrainingConfig from "../components/ClienteTrainingConfig";
import { useAsistencia } from "../../asistencia/hooks/useAsistencia";
import ResumenAsistencia from "../../asistencia/components/ResumenAsistencia";
import HistorialAsistencia from "../../asistencia/components/HistorialAsistencia";

function ClienteDetailV2() {
  const { id } = useParams();
  const { ficha, recargar: recargarFicha } = useFichaCliente(id);
  const { cuotas, recargar: recargarCuotas } = useCuotasCliente(id);
  const ultimaCuota = cuotas[0];
  const fecha = new Date();

  const mesActual = fecha.toLocaleString("es-AR", {
    month: "long",
  });

  const anioActual = fecha.getFullYear();

  const cuotaActual = cuotas.find(
    (cuota) =>
      cuota.mes.toLowerCase() === mesActual.toLowerCase() &&
      cuota.anio === anioActual,
  );
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const {
    asistencias,
    presentes,
    faltas,
    porcentaje,
    cargando: cargandoAsistencia,
  } = useAsistencia(cliente?.id, cliente?.frecuenciaSemanal);

  const [loading, setLoading] = useState(true);
  const [editandoFicha, setEditandoFicha] = useState(false);
  const [creandoCuota, setCreandoCuota] = useState(false);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState<Cuota | null>(
    null,
  );
  const [cuotaEditando, setCuotaEditando] = useState<Cuota | null>(null);
  const [cuotaRecibo, setCuotaRecibo] = useState<Cuota | null>(null);

  useEffect(() => {
    const cargarCliente = async () => {
      if (!id) return;

      const data = await getClienteById(id);

      setCliente(data);
      setLoading(false);
    };

    cargarCliente();
  }, [id]);

  if (loading) {
    return <div className="p-6">Cargando cliente...</div>;
  }

  if (!cliente) {
    return <div className="p-6">Cliente no encontrado.</div>;
  }

  return (
    <div className="p-6">
      <ClienteHeader cliente={cliente} />

      <ClienteQuickStatus
        cuota={
          ultimaCuota ? `${ultimaCuota.mes} ${ultimaCuota.estado}` : "Sin cuota"
        }
        asistencia={`${porcentaje}%`}
        seguimiento="Sin registros"
      />

      <ClienteTrainingConfig
        clienteId={cliente.id}
        frecuenciaSemanal={cliente.frecuenciaSemanal}
      />

      <div className="mt-6 space-y-6">
        {creandoCuota && id ? (
          <CuotaForm
            clienteId={id}
            onGuardado={async () => {
              await recargarCuotas();
              setCreandoCuota(false);
            }}
            onCancelar={() => {
              setCreandoCuota(false);
            }}
          />
        ) : cuotaSeleccionada ? (
          <RegistrarPagoForm
            cuota={cuotaSeleccionada}
            onGuardado={async () => {
              await recargarCuotas();
              setCuotaSeleccionada(null);
            }}
            onCancelar={() => {
              setCuotaSeleccionada(null);
            }}
          />
        ) : cuotaEditando ? (
          <EditarCuotaForm
            cuota={cuotaEditando}
            onGuardado={async () => {
              await recargarCuotas();
              setCuotaEditando(null);
            }}
            onCancelar={() => {
              setCuotaEditando(null);
            }}
          />
        ) : cuotaRecibo ? (
          <ReciboPago
            cuota={cuotaRecibo}
            clienteNombre={`${cliente.nombre} ${cliente.apellido}`}
            onCerrar={() => {
              setCuotaRecibo(null);
            }}
          />
        ) : (
          <CuotaResumen
            cuotas={cuotas}
            onCrear={() => {
              setCreandoCuota(true);
            }}
            onRegistrarPago={(cuota) => {
              setCuotaSeleccionada(cuota);
            }}
            onEditar={(cuota) => {
              setCuotaEditando(cuota);
            }}
            onVerRecibo={(cuota) => {
              setCuotaRecibo(cuota);
            }}
            onRevertido={async () => {
              await recargarCuotas();
            }}
          />
        )}

        <section className="p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold">Asistencia</h2>

          {cargandoAsistencia ? (
            <p className="mt-2 opacity-70">Cargando asistencia...</p>
          ) : (
            <>
              <ResumenAsistencia
                presentes={presentes}
                faltas={faltas}
                porcentaje={porcentaje}
                frecuenciaSemanal={cliente.frecuenciaSemanal}
              />
              <HistorialAsistencia asistencias={asistencias} />
            </>
          )}
        </section>

        <section className="p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold">Seguimiento</h2>

          <p className="mt-2 opacity-70">Próximamente evolución del cliente.</p>
        </section>

        {editandoFicha && id ? (
          <FichaForm
            clienteId={id}
            ficha={ficha}
            onGuardado={async () => {
              await recargarFicha();
              setEditandoFicha(false);
            }}
            onCancelar={() => {
              setEditandoFicha(false);
            }}
          />
        ) : (
          <FichaResumen
            ficha={ficha}
            onEditar={() => {
              setEditandoFicha(true);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ClienteDetailV2;
