import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 w-32 bg-surfaceSoft/50 rounded-lg" />
        <div className="h-28 w-full bg-surfaceSoft/30 rounded-2xl" />
        <div className="h-64 w-full bg-surfaceSoft/30 rounded-2xl" />
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="p-8 text-center space-y-4 bg-surfaceSoft/20 rounded-2xl">
        <p className="text-muted text-sm font-semibold">
          Atleta no encontrado.
        </p>
        <Button variant="outline" onClick={() => navigate("/admin/clientes")}>
          Volver al listado
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn font-sans selection:bg-primary/20 selection:text-primary">
      {/* NAVEGACIÓN SUPERIOR & INDICADOR DE ESTADO */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-muted hover:text-primary transition-all active:scale-95 py-1 px-2 rounded-lg hover:bg-surfaceSoft/30"
        >
          <span>←</span> VOLVER A ATLETAS
        </button>

        <div className="flex items-center gap-2 bg-surfaceSoft/30 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted">
            ATLETA REGISTRADO
          </span>
        </div>
      </div>

      {/* CABECERA DE ATLETA (BLOQUE CON GRADIENTE SUTIL SIN BORDES) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surfaceSoft/80 to-surfaceSoft/30 p-1 shadow-lg">
        <ClienteHeader cliente={cliente} />
      </div>

      {/* CONFIGURACIÓN DE FRECUENCIA DE ENTRENAMIENTO */}
      <div className="rounded-2xl bg-surfaceSoft/30 p-4 backdrop-blur-md">
        <ClienteTrainingConfig
          clienteId={cliente.id}
          frecuenciaSemanal={cliente.frecuenciaSemanal}
          onGuardado={(frecuencia) => {
            setCliente({ ...cliente, frecuenciaSemanal: frecuencia });
          }}
        />
      </div>

      {/* NAVEGACIÓN ENTRE SECCIONES (SWITCH ULTRA-MINIMALISTA PLANO) */}
      <nav className="flex items-center gap-6 border-b border-white/5 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setTabActiva("seguimiento")}
          className={`relative pb-2 text-xs font-mono transition-all active:scale-95 shrink-0 ${
            tabActiva === "seguimiento"
              ? "text-primary font-bold"
              : "text-muted hover:text-text"
          }`}
        >
          <span>SEGUIMIENTO & CARGAS</span>
          {tabActiva === "seguimiento" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
          )}
        </button>

        <button
          onClick={() => setTabActiva("asistencia")}
          className={`relative pb-2 text-xs font-mono transition-all active:scale-95 shrink-0 ${
            tabActiva === "asistencia"
              ? "text-primary font-bold"
              : "text-muted hover:text-text"
          }`}
        >
          <span>ASISTENCIA [{porcentaje}%]</span>
          {tabActiva === "asistencia" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
          )}
        </button>

        <button
          onClick={() => setTabActiva("cuotas")}
          className={`relative pb-2 text-xs font-mono transition-all active:scale-95 shrink-0 ${
            tabActiva === "cuotas"
              ? "text-primary font-bold"
              : "text-muted hover:text-text"
          }`}
        >
          <span>CUOTAS & PAGOS</span>
          {tabActiva === "cuotas" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
          )}
        </button>

        <button
          onClick={() => setTabActiva("ficha")}
          className={`relative pb-2 text-xs font-mono transition-all active:scale-95 shrink-0 ${
            tabActiva === "ficha"
              ? "text-primary font-bold"
              : "text-muted hover:text-text"
          }`}
        >
          <span>FICHA MÉDICA</span>
          {tabActiva === "ficha" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
          )}
        </button>
      </nav>

      {/* CONTENIDO INTEGRADO (SIN CUADROS EXTERNOS) */}
      <div className="pt-2">
        {tabActiva === "seguimiento" && (
          <div className="animate-fadeIn">
            <SeguimientoPanel clienteId={id!} />
          </div>
        )}

        {tabActiva === "asistencia" && (
          <div className="animate-fadeIn rounded-2xl bg-surfaceSoft/20 p-5 backdrop-blur-md">
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
          <div className="animate-fadeIn rounded-2xl bg-surfaceSoft/20 p-5 backdrop-blur-md">
            <TabCuotasSection
              clienteId={id!}
              clienteNombre={`${cliente.nombre} ${cliente.apellido || ""}`}
              cuotas={cuotas}
              onRecargarCuotas={recargarCuotas}
            />
          </div>
        )}

        {tabActiva === "ficha" && (
          <div className="animate-fadeIn rounded-2xl bg-surfaceSoft/20 p-5 backdrop-blur-md">
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