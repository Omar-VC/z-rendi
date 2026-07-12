import { useState } from "react";
import { useClientes } from "../hooks/useClientes";
import ClienteCard from "../components/ClienteCard";
import ClienteRequestCard from "../components/ClienteRequestCard";

function ClientesPageV2() {
  const { pendientes, aprobados, loading, error, aceptar, rechazar } =
    useClientes();

  const [busqueda, setBusqueda] = useState("");
  const clientesFiltrados = aprobados.filter((cliente) => {
    const texto = `${cliente.nombre} ${cliente.apellido}`.toLowerCase();

    return texto.includes(busqueda.toLowerCase());
  });

  if (loading) {
    return <p>Cargando clientes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Clientes</h1>

      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full p-3 rounded-lg mb-8"
      />

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">
          Solicitudes pendientes ({pendientes.length})
        </h2>

        {pendientes.length === 0 ? (
          <p>No hay solicitudes pendientes.</p>
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

      <section>
        <h2 className="text-xl font-bold mb-4">
          Clientes ({aprobados.length})
        </h2>

        {aprobados.length === 0 ? (
          <p>No hay clientes aprobados.</p>
        ) : (
          <div className="space-y-4">
            {clientesFiltrados.map((cliente) => (
              <ClienteCard key={cliente.id} cliente={cliente} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ClientesPageV2;
