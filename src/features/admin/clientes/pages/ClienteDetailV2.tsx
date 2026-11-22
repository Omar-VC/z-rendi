import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarCheck2, ChartNoAxesCombined, CreditCard, HeartPulse } from "lucide-react";

import type { Cliente } from "../types";
import { getClienteById } from "../services/clientes.service";
import ClienteHeader from "../components/ClienteHeader";
import ClienteTrainingConfig from "../components/ClienteTrainingConfig";

import TabCuotasSection from "../components/TabCuotasSection";
import TabFichaSection from "../components/TabFichaSection";
import TabAsistenciaSection from "../components/TabAsistenciaSection";

import { useFichaCliente } from "../../fichas/hooks/useFichaCliente";
import { useCuotasCliente } from "../../cuotas/hooks/useCuotasCliente";
import { useAsistencia } from "../../asistencia/hooks/useAsistencia";
import SeguimientoPanel from "../../seguimiento/components/SeguimientoPanel";
import Button from "../../../../shared/ui/Button";

type TabOption = "seguimiento" | "asistencia" | "cuotas" | "ficha";

const tabs = [
  { id: "seguimiento", label: "Progreso", Icon: ChartNoAxesCombined },
  { id: "asistencia", label: "Asistencia", Icon: CalendarCheck2 },
  { id: "cuotas", label: "Pagos", Icon: CreditCard },
  { id: "ficha", label: "Ficha médica", Icon: HeartPulse },
] as const;

function ClienteDetailV2() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState<TabOption>("seguimiento");

  const { ficha, recargar: recargarFicha } = useFichaCliente(id);
  const { cuotas, recargar: recargarCuotas } = useCuotasCliente(id);
  const {
    asistencias,
    presentes,
    faltas,
    porcentaje,
    cargando: cargandoAsistencia,
  } = useAsistencia(cliente?.id, cliente?.frecuenciaSemanal);

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
      <div className="space-y-5 p-2 animate-pulse">
        <div className="h-5 w-36 rounded-lg bg-surfaceSoft/40" />
        <div className="h-24 w-full rounded-2xl bg-surfaceSoft/30" />
        <div className="h-12 w-full rounded-xl bg-surfaceSoft/30" />
        <div className="h-64 w-full rounded-2xl bg-surfaceSoft/20" />
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="space-y-4 rounded-2xl bg-surfaceSoft/20 p-8 text-center">
        <p className="text-sm font-semibold text-muted">Atleta no encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/admin/clientes")}>
          Volver al listado
        </Button>
      </div>
    );
  }

  const estadoAprobado = cliente.estado === "aprobado";

  return (
    <div className="space-y-5 pb-12 animate-fadeIn font-sans selection:bg-primary/20 selection:text-primary sm:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg py-1.5 pr-2 text-sm font-semibold text-muted transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          <span>Volver a atletas</span>
        </button>

        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${estadoAprobado ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${estadoAprobado ? "bg-success" : "bg-warning"}`} />
          <span>{estadoAprobado ? "Atleta activo" : `Atleta ${cliente.estado}`}</span>
        </div>
      </div>

      <ClienteHeader cliente={cliente} />

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <ClienteTrainingConfig
          clienteId={cliente.id}
          frecuenciaSemanal={cliente.frecuenciaSemanal}
          onGuardado={(frecuencia) => {
            setCliente({ ...cliente, frecuenciaSemanal: frecuencia });
          }}
        />

        <nav aria-label="Secciones del atleta" className="flex items-center gap-1 overflow-x-auto rounded-xl bg-surfaceSoft/35 p-1 scrollbar-none">
          {tabs.map(({ id: tabId, label, Icon }) => {
            const activa = tabActiva === tabId;
            return (
              <button
                key={tabId}
                onClick={() => setTabActiva(tabId)}
                aria-current={activa ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:px-4 sm:text-sm ${
                  activa ? "bg-surface text-text shadow-sm" : "text-muted hover:bg-white/5 hover:text-text"
                }`}
              >
                <Icon className={`h-4 w-4 ${activa ? "text-primary" : "text-muted"}`} strokeWidth={1.8} aria-hidden="true" />
                {label}
                {tabId === "asistencia" && <span className="text-[10px] text-muted">{porcentaje}%</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-1">
        {tabActiva === "seguimiento" && <SeguimientoPanel clienteId={id!} />}

        {tabActiva === "asistencia" && (
          <div className="rounded-2xl bg-surfaceSoft/15 p-4 sm:p-5">
            <TabAsistenciaSection
              cargando={cargandoAsistencia}
              presentes={presentes}
              faltas={faltas}
              porcentaje={porcentaje}
              frecuenciaSemanal={cliente.frecuenciaSemanal}
              asistencias={asistencias}
            />
          </div>
        )}

        {tabActiva === "cuotas" && (
          <div className="rounded-2xl bg-surfaceSoft/15 p-4 sm:p-5">
            <TabCuotasSection
              clienteId={id!}
              clienteNombre={`${cliente.nombre} ${cliente.apellido || ""}`}
              cuotas={cuotas}
              onRecargarCuotas={recargarCuotas}
            />
          </div>
        )}

        {tabActiva === "ficha" && (
          <div className="rounded-2xl bg-surfaceSoft/15 p-4 sm:p-5">
            <TabFichaSection
              clienteId={id!}
              ficha={ficha}
              onRecargarFicha={recargarFicha}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ClienteDetailV2;
