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
    <div className="space-y-6 animate-fadeIn">
      {/* ENCABEZADO Y BOTÓN DE INVITACIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionTitle
          title="Gestión de Atletas"
          description="Control centralizado de estado, rendimiento y membresías."
        />

        <Button
          variant="accent"
          onClick={invitarCliente}
          disabled={generandoInvitacion}
          className="shadow-[0_0_15px_rgba(255,85,0,0.25)] shrink-0"
        >
          {generandoInvitacion ? "Generando..." : "+ Invitar Atleta"}
        </Button>
      </div>

      {/* BARRA DE BÚSQUEDA Y NAVEGACIÓN POR TABS */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="w-full md:max-w-md">
          <Input
            placeholder="Buscar por nombre o apellido..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Pestañas rápidas para filtrar sin scroll excesivo */}
        <div className="flex items-center gap-1.5 p-1 bg-surfaceSoft/60 border border-border/60 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setTabActiva("activos")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tabActiva === "activos"
                ? "bg-primary text-white shadow-[0_0_10px_rgba(255,85,0,0.3)]"
                : "text-muted hover:text-text"
            }`}
          >
            Activos ({activos.length})
          </button>

          {pendientes.length > 0 && (
            <button
              onClick={() => setTabActiva("pendientes")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                tabActiva === "pendientes"
                  ? "bg-primary text-white shadow-[0_0_10px_rgba(255,85,0,0.3)]"
                  : "text-warning hover:text-warning/80"
              }`}
            >
              <span>Solicitudes</span>
              <span className="w-2 h-2 rounded-full bg-warning animate-ping" />
              ({pendientes.length})
            </button>
          )}

          <button
            onClick={() => setTabActiva("inactivos")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tabActiva === "inactivos"
                ? "bg-primary text-white shadow-[0_0_10px_rgba(255,85,0,0.3)]"
                : "text-muted hover:text-text"
            }`}
          >
            Bajas ({inactivos.length})
          </button>
        </div>
      </div>

      {/* LISTA: SOLICITUDES PENDIENTES */}
      {tabActiva === "pendientes" && (
        <section className="space-y-3">
          {pendientes.length === 0 ? (
            <EmptyState title="No hay solicitudes pendientes" />
          ) : (
            <div className="space-y-2.5">
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

      {/* LISTA: CLIENTES ACTIVOS (LAYOUT COMPACTO) */}
      {tabActiva === "activos" && (
        <section className="space-y-3">
          {clientesActivosFiltrados.length === 0 ? (
            <EmptyState
              title={
                activos.length === 0
                  ? "No hay clientes activos registrasdos"
                  : "No se encontraron atletas con esa búsqueda"
              }
            />
          ) : (
            <div className="space-y-2.5">
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

      {/* LISTA: CLIENTES INACTIVOS / DADOS DE BAJA */}
      {tabActiva === "inactivos" && (
        <section className="space-y-3">
          {clientesInactivosFiltrados.length === 0 ? (
            <EmptyState title="No hay atletas en estado de baja" />
          ) : (
            <div className="space-y-2.5">
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