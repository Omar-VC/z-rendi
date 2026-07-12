import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Cliente } from "../types";
import { getClienteById } from "../services/clientes.service";
import ClienteHeader from "../components/ClienteHeader";
import ClienteQuickStatus from "../components/ClienteQuickStatus";

function ClienteDetailV2() {
  const { id } = useParams();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

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
        cuota="Julio pendiente"
        asistencia="85%"
        seguimiento="Sin registros"
      />
      <div className="mt-6 space-y-6">
        <section className="p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold">Cuotas</h2>

          <p className="mt-2 opacity-70">
            Próximamente gestión de cuotas del cliente.
          </p>
        </section>

        <section className="p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold">Asistencia</h2>

          <p className="mt-2 opacity-70">Próximamente control de asistencia.</p>
        </section>

        <section className="p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold">Seguimiento</h2>

          <p className="mt-2 opacity-70">Próximamente evolución del cliente.</p>
        </section>

        <section className="p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold">Ficha</h2>

          <p className="mt-2 opacity-70">
            Próximamente datos físicos y evaluación.
          </p>
        </section>
      </div>
    </div>
  );
}

export default ClienteDetailV2;
