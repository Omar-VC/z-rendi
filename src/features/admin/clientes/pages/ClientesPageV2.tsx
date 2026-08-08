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


  const filtrarClientes = (clientes: typeof activos) => {

    return clientes.filter((cliente) => {

      const texto =
        `${cliente.nombre} ${cliente.apellido}`.toLowerCase();

      return texto.includes(
        busqueda.toLowerCase()
      );

    });

  };


  const clientesActivosFiltrados =
    filtrarClientes(activos);


  const clientesInactivosFiltrados =
    filtrarClientes(inactivos);


  if (loading) {
    return <Loading />;
  }


  if (error) {
    return (
      <EmptyState
        title={error}
      />
    );
  }


  return (

    <div className="space-y-8">


      <SectionTitle
        title="Clientes"
        description="Gestiona solicitudes, clientes activos y cuentas dadas de baja."
      />



      <Input
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={(e) =>
          setBusqueda(e.target.value)
        }
      />



      {/* SOLICITUDES PENDIENTES */}

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



      {/* CLIENTES ACTIVOS */}

      <section className="space-y-4">

        <h2 className="text-xl font-bold text-text">
          Clientes activos ({activos.length})
        </h2>


        {clientesActivosFiltrados.length === 0 ? (

          <EmptyState
            title={
              activos.length === 0
                ? "No hay clientes activos"
                : "No se encontraron clientes"
            }
          />

        ) : (

          <div className="space-y-4">

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



      {/* CLIENTES DADOS DE BAJA */}

      {inactivos.length > 0 && (

        <section className="space-y-4">

          <h2 className="text-xl font-bold text-text">
            Dados de baja ({inactivos.length})
          </h2>


          {clientesInactivosFiltrados.length === 0 ? (

            <EmptyState
              title="No se encontraron clientes"
            />

          ) : (

            <div className="space-y-4">

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
