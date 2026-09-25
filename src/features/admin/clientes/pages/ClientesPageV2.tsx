import { useState } from "react";

import { useClientes } from "../hooks/useClientes";
import ClienteCard from "../components/ClienteCard";
import ClienteRequestCard from "../components/ClienteRequestCard";

import Input from "../../../../shared/ui/Input";
import SectionTitle from "../../../../shared/ui/SectionTitle";
import Loading from "../../../../shared/ui/Loading";
import EmptyState from "../../../../shared/ui/EmptyState";
import Button from "../../../../shared/ui/Button";

import { crearInvitacion } from "../../invitaciones/services/invitaciones.service";

function ClientesPageV2() {
  const {
    pendientes,
    activos,
    inactivos,
    loading,
    error,
    aceptar,
    rechazar,
    darDeBaja,
    reactivar,
  } = useClientes();

  const [busqueda, setBusqueda] = useState("");
  const [generandoInvitacion, setGenerandoInvitacion] = useState(false);
  const [tabActiva, setTabActiva] = useState<"activos" | "inactivos" | "pendientes">("activos");

  const filtrarClientes = (clientes: typeof activos) => {
    return clientes.filter((cliente) => {
      const texto = `${cliente.nombre} ${cliente.apellido || ""}`.toLowerCase();
      return texto.includes(busqueda.toLowerCase());
    });
  };

  const clientesActivosFiltrados = filtrarClientes(activos);
  const clientesInactivosFiltrados = filtrarClientes(inactivos);

  async function invitarCliente() {
    try {
      setGenerandoInvitacion(true);
      const invitacion = await crearInvitacion();
      const link = `${window.location.origin}/registro?token=${invitacion.token}`;
      await navigator.clipboard.writeText(link);
      alert("Invitación creada y enlace copiado al portapapeles.");
    } catch (error) {
      console.error(error);
      alert("No se pudo generar la invitación.");
    } finally {
      setGenerandoInvitacion(false);
    }
  }

  if (loading) return <Loading />;
  if (error) return <EmptyState title={error} />;

  return (
    <div className="space-y-8 animate-fadeIn font-sans selection:bg-primary/20 selection:text-primary">
      {/* ENCABEZADO Y BOTÓN DE INVITACIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <SectionTitle
          title="Gestión de Atletas"
          description="Control centralizado de estado, rendimiento y membresías."
        />

        <Button
          variant="accent"
          onClick={invitarCliente}
          disabled={generandoInvitacion}
          className="!h-9 !px-4 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg !bg-primary hover:!bg-primary/90 active:scale-95 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] shrink-0"
        >
          {generandoInvitacion ? "[ Generando... ]" : "+ Invitar Atleta"}
        </Button>
      </div>

      {/* BARRA DE BÚSQUEDA Y NAVEGACIÓN PLANO / MINIMALISTA */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-end justify-between">
        <div className="w-full md:max-w-md">
          <Input
            placeholder="Buscar por nombre o apellido..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* SWITCH PLANO Y ULTRA-MINIMALISTA (SIN CONTENEDORES NI CAJAS) */}
        <nav className="flex items-center gap-6 border-b border-white/5 pb-1 self-start md:self-auto">
          {/* TAB ACTIVOS */}
          <button
            onClick={() => setTabActiva("activos")}
            className={`relative pb-2 text-xs font-mono transition-all active:scale-95 ${
              tabActiva === "activos"
                ? "text-primary font-bold"
                : "text-muted hover:text-text"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>ACTIVOS</span>
              <span className="text-[10px] opacity-70">[{activos.length}]</span>
            </div>
            {tabActiva === "activos" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
            )}
          </button>

          {/* TAB SOLICITUDES (SI EXISTEN) */}
          {pendientes.length > 0 && (
            <button
              onClick={() => setTabActiva("pendientes")}
              className={`relative pb-2 text-xs font-mono transition-all active:scale-95 ${
                tabActiva === "pendientes"
                  ? "text-warning font-bold"
                  : "text-muted hover:text-text"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-warning" />
                </span>
                <span>SOLICITUDES</span>
                <span className="text-[10px] opacity-70">[{pendientes.length}]</span>
              </div>
              {tabActiva === "pendientes" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-warning rounded-full" />
              )}
            </button>
          )}

          {/* TAB BAJAS */}
          <button
            onClick={() => setTabActiva("inactivos")}
            className={`relative pb-2 text-xs font-mono transition-all active:scale-95 ${
              tabActiva === "inactivos"
                ? "text-text font-bold"
                : "text-muted hover:text-text"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>BAJAS</span>
              <span className="text-[10px] opacity-70">[{inactivos.length}]</span>
            </div>
            {tabActiva === "inactivos" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-text rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {/* CONTENIDO DE LISTAS */}
      {tabActiva === "pendientes" && (
        <section className="space-y-3">
          {pendientes.length === 0 ? (
            <EmptyState title="No hay solicitudes pendientes" />
          ) : (
            <div className="space-y-3">
              {pendientes.map((cliente) => (
                <ClienteRequestCard
                  key={cliente.id}
                  cliente={cliente}
                  onAceptar={aceptar}
                  onRechazar={rechazar}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {tabActiva === "activos" && (
        <section className="space-y-3">
          {clientesActivosFiltrados.length === 0 ? (
            <EmptyState
              title={
                activos.length === 0
                  ? "No hay atletas activos registrados"
                  : "No se encontraron atletas con esa búsqueda"
              }
            />
          ) : (
            <div className="space-y-3">
              {clientesActivosFiltrados.map((cliente) => (
                <ClienteCard
                  key={cliente.id}
                  cliente={cliente}
                  onDarDeBaja={darDeBaja}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {tabActiva === "inactivos" && (
        <section className="space-y-3">
          {clientesInactivosFiltrados.length === 0 ? (
            <EmptyState title="No hay atletas en estado de baja" />
          ) : (
            <div className="space-y-3">
              {clientesInactivosFiltrados.map((cliente) => (
                <ClienteCard
                  key={cliente.id}
                  cliente={cliente}
                  onReactivar={reactivar}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default ClientesPageV2;