import { useState } from "react";

import { useClientes } from "../hooks/useClientes";
import ClienteCard from "../components/ClienteCard";
import ClienteRequestCard from "../components/ClienteRequestCard";

import Input from "../../../../shared/ui/Input";
import SectionTitle from "../../../../shared/ui/SectionTitle";
import Loading from "../../../../shared/ui/Loading";
import EmptyState from "../../../../shared/ui/EmptyState";

function ClientesPageV2() {
  const {
    pendientes,
    aprobados,
    loading,
    error,
    aceptar,
    rechazar,
  } = useClientes();

  const [busqueda, setBusqueda] = useState("");

  const clientesFiltrados = aprobados.filter((cliente) => {
    const texto =
      `${cliente.nombre} ${cliente.apellido}`.toLowerCase();

    return texto.includes(
      busqueda.toLowerCase()
    );
  });

  if (loading) {
    return (
      <Loading text="Cargando clientes..." />
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Ocurrió un error"
        description={error}
      />
    );
  }

  return (
    <div className="space-y-10">

      <SectionTitle
        title="Clientes"
        description="Gestiona solicitudes y clientes activos."
      />

      <Input
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />



      <section className="space-y-4">

        <h2 className="text-xl font-bold text-text">
          Solicitudes pendientes ({pendientes.length})
        </h2>

        {pendientes.length === 0 ? (

          <EmptyState
            title="No hay solicitudes pendientes"
          />

        ) : (

          <div className="space-y-4">

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



      <section className="space-y-4">

        <h2 className="text-xl font-bold text-text">
          Clientes ({aprobados.length})
        </h2>

        {aprobados.length === 0 ? (

          <EmptyState
            title="No hay clientes registrados"
          />

        ) : (

          <div className="space-y-4">

            {clientesFiltrados.map((cliente) => (

              <ClienteCard
                key={cliente.id}
                cliente={cliente}
              />

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default ClientesPageV2;
