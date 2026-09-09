import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import type { Cliente } from "../types";
import { getClienteById } from "../services/clientes.service";
import ClienteHeader from "../components/ClienteHeader";
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
import SeguimientoPanel from "../../seguimiento/components/SeguimientoPanel";
import Button from "../../../../shared/ui/Button";

type TabOption = "seguimiento" | "asistencia" | "cuotas" | "ficha";

function ClienteDetailV2() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { ficha, recargar: recargarFicha } = useFichaCliente(id);
  const { cuotas, recargar: recargarCuotas } = useCuotasCliente(id);

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const {
    asistencias,
    presentes,
    faltas,
    porcentaje,
    cargando: cargandoAsistencia,
  } = useAsistencia(cliente?.id, cliente?.frecuenciaSemanal);

  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState<TabOption>("seguimiento");

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
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 w-32 bg-surfaceSoft rounded-lg" />
        <div className="h-24 w-full bg-surfaceSoft rounded-xl" />
        <div className="h-64 w-full bg-surfaceSoft rounded-xl" />
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="p-8 text-center space-y-4 bg-surface border border-border/60 rounded-xl">
        <p className="text-muted text-sm font-semibold">
          Cliente no encontrado.
        </p>
        <Button variant="outline" onClick={() => navigate("/admin/clientes")}>
          Volver al listado
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* BOTÓN VOLVER & CABECERA DE PERFIL */}
      {/* NAVEGACIÓN SUPERIOR LIMPICITA */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-muted hover:text-primary transition-colors py-1 px-2 rounded-lg hover:bg-surfaceSoft/50"
        >
          <span>←</span> Volver a Atletas
        </button>

        {/* Indicador sutil de atleta activo en lugar del ID técnico */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Atleta Registrado
          </span>
        </div>
      </div>

      <ClienteHeader cliente={cliente} />

      {/* CONFIGURACIÓN DE ENTRENAMIENTO */}
      <div className="bg-surface/60 border border-border/50 rounded-xl p-4 backdrop-blur-sm">
        <ClienteTrainingConfig
          clienteId={cliente.id}
          frecuenciaSemanal={cliente.frecuenciaSemanal}
          onGuardado={(frecuencia) => {
            setCliente({ ...cliente, frecuenciaSemanal: frecuencia });
          }}
        />
      </div>

      {/* BARRA DE NAVEGACIÓN POR PESTAÑAS (SLIDE TÁCTIL SIN SCROLLBAR) */}
      <div className="flex items-center gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] pb-2 border-b border-border/60">
        <style>{`
    .scrollbar-none::-webkit-scrollbar {
      display: none;
    }
  `}</style>

        <button
          onClick={() => setTabActiva("seguimiento")}
          className={`snap-start px-4 py-2 text-xs font-extrabold rounded-lg transition-all shrink-0 select-none ${
            tabActiva === "seguimiento"
              ? "bg-primary text-white shadow-[0_0_12px_rgba(255,85,0,0.3)]"
              : "text-muted hover:text-text bg-surfaceSoft/40"
          }`}
        >
          📊 Seguimiento & Cargas
        </button>

        <button
          onClick={() => setTabActiva("asistencia")}
          className={`snap-start px-4 py-2 text-xs font-extrabold rounded-lg transition-all shrink-0 select-none ${
            tabActiva === "asistencia"
              ? "bg-primary text-white shadow-[0_0_12px_rgba(255,85,0,0.3)]"
              : "text-muted hover:text-text bg-surfaceSoft/40"
          }`}
        >
          📅 Asistencia ({porcentaje}%)
        </button>

        <button
          onClick={() => setTabActiva("cuotas")}
          className={`snap-start px-4 py-2 text-xs font-extrabold rounded-lg transition-all shrink-0 select-none ${
            tabActiva === "cuotas"
              ? "bg-primary text-white shadow-[0_0_12px_rgba(255,85,0,0.3)]"
              : "text-muted hover:text-text bg-surfaceSoft/40"
          }`}
        >
          💳 Cuotas & Pagos
        </button>

        <button
          onClick={() => setTabActiva("ficha")}
          className={`snap-start px-4 py-2 text-xs font-extrabold rounded-lg transition-all shrink-0 select-none ${
            tabActiva === "ficha"
              ? "bg-primary text-white shadow-[0_0_12px_rgba(255,85,0,0.3)]"
              : "text-muted hover:text-text bg-surfaceSoft/40"
          }`}
        >
          📋 Ficha Médica
        </button>
      </div>

      {/* CONTENIDO SEGÚN LA PESTAÑA SELECCIONADA */}
      <div className="pt-2">
        {/* PESTAÑA 1: SEGUIMIENTO */}
        {tabActiva === "seguimiento" && (
          <section className="bg-surface/40 border border-border/60 rounded-xl p-5 space-y-4 backdrop-blur-sm">
            <h2 className="text-base font-black text-text tracking-tight uppercase">
              Control de Carga & Evolución
            </h2>
            <SeguimientoPanel clienteId={id!} />
          </section>
        )}

        {/* PESTAÑA 2: ASISTENCIA */}
        {tabActiva === "asistencia" && (
          <section className="bg-surface/40 border border-border/60 rounded-xl p-5 space-y-5 backdrop-blur-sm">
            <h2 className="text-base font-black text-text tracking-tight uppercase">
              Registro de Asistencia
            </h2>

            {cargandoAsistencia ? (
              <p className="text-xs text-muted font-medium animate-pulse">
                Cargando métricas de asistencia...
              </p>
            ) : (
              <div className="space-y-6">
                <ResumenAsistencia
                  presentes={presentes}
                  faltas={faltas}
                  porcentaje={porcentaje}
                  frecuenciaSemanal={cliente.frecuenciaSemanal}
                />
                <HistorialAsistencia asistencias={asistencias} />
              </div>
            )}
          </section>
        )}

        {/* PESTAÑA 3: CUOTAS */}
        {tabActiva === "cuotas" && (
          <section className="bg-surface/40 border border-border/60 rounded-xl p-5 backdrop-blur-sm">
            {creandoCuota && id ? (
              <CuotaForm
                clienteId={id}
                onGuardado={async () => {
                  await recargarCuotas();
                  setCreandoCuota(false);
                }}
                onCancelar={() => setCreandoCuota(false)}
              />
            ) : cuotaSeleccionada ? (
              <RegistrarPagoForm
                cuota={cuotaSeleccionada}
                onGuardado={async () => {
                  await recargarCuotas();
                  setCuotaSeleccionada(null);
                }}
                onCancelar={() => setCuotaSeleccionada(null)}
              />
            ) : cuotaEditando ? (
              <EditarCuotaForm
                cuota={cuotaEditando}
                onGuardado={async () => {
                  await recargarCuotas();
                  setCuotaEditando(null);
                }}
                onCancelar={() => setCuotaEditando(null)}
              />
            ) : cuotaRecibo ? (
              <ReciboPago
                cuota={cuotaRecibo}
                clienteNombre={`${cliente.nombre} ${cliente.apellido}`}
                onCerrar={() => setCuotaRecibo(null)}
              />
            ) : (
              <CuotaResumen
                cuotas={cuotas}
                onCrear={() => setCreandoCuota(true)}
                onRegistrarPago={(cuota) => setCuotaSeleccionada(cuota)}
                onEditar={(cuota) => setCuotaEditando(cuota)}
                onVerRecibo={(cuota) => setCuotaRecibo(cuota)}
                onRevertido={async () => await recargarCuotas()}
              />
            )}
          </section>
        )}

        {/* PESTAÑA 4: FICHA */}
        {tabActiva === "ficha" && (
          <section className="bg-surface/40 border border-border/60 rounded-xl p-5 backdrop-blur-sm">
            {editandoFicha && id ? (
              <FichaForm
                clienteId={id}
                ficha={ficha}
                onGuardado={async () => {
                  await recargarFicha();
                  setEditandoFicha(false);
                }}
                onCancelar={() => setEditandoFicha(false)}
              />
            ) : (
              <FichaResumen
                ficha={ficha}
                onEditar={() => setEditandoFicha(true)}
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default ClienteDetailV2;
