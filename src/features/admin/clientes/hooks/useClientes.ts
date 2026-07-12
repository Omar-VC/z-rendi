import { useEffect, useState } from "react";

import type { Cliente } from "../types";
import {
  aprobarCliente,
  getClientes,
  rechazarCliente,
} from "../services/clientes.service";

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los clientes.");
    } finally {
      setLoading(false);
    }
  };

  const aceptar = async (id: string) => {
    await aprobarCliente(id);
    await cargarClientes();
  };

  const rechazar = async (id: string) => {
    await rechazarCliente(id);
    await cargarClientes();
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const pendientes = clientes.filter(
    (cliente) => cliente.estado === "pendiente"
  );

  const aprobados = clientes.filter(
    (cliente) => cliente.estado === "aprobado"
  );

  return {
    clientes,
    pendientes,
    aprobados,
    loading,
    error,
    aceptar,
    rechazar,
    recargar: cargarClientes,
  };
}