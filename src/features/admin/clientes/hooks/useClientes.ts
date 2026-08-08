import { useEffect, useState } from "react";

import type { Cliente } from "../types";

import {
  aprobarCliente,
  getClientes,
  rechazarCliente,
  darDeBajaCliente,
  reactivarCliente,
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


  const darDeBaja = async (id: string) => {

    await darDeBajaCliente(id);

    await cargarClientes();

  };


  const reactivar = async (id: string) => {

    await reactivarCliente(id);

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


  const activos = aprobados.filter(
    (cliente) => cliente.estadoCuenta === "activo"
  );


  const inactivos = aprobados.filter(
    (cliente) => cliente.estadoCuenta === "inactivo"
  );


  return {

    clientes,

    pendientes,

    aprobados,

    activos,

    inactivos,

    loading,

    error,

    aceptar,

    rechazar,

    darDeBaja,

    reactivar,

    recargar: cargarClientes,

  };

}