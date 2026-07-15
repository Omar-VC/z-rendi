import { useEffect, useState } from "react";

import { obtenerAsistenciaMensual } from "../services/asistenciaService";

interface RegistroAsistencia {
  id: string;
  clienteId: string;
  fecha: string;
  estado: "presente" | "falta";
}

export function useAsistencia(clienteId?: string, frecuenciaSemanal?: number) {
  const [asistencias, setAsistencias] = useState<RegistroAsistencia[]>([]);

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!clienteId) return;

    const cargar = async () => {
      setCargando(true);

      const ahora = new Date();

      const año = ahora.getFullYear();
      const mes = ahora.getMonth();

      const inicioMes = new Date(año, mes, 1).toISOString().split("T")[0];

      const finMes = new Date(año, mes + 1, 0).toISOString().split("T")[0];

      const registros = await obtenerAsistenciaMensual(
        clienteId,
        inicioMes,
        finMes,
      );

      setAsistencias(registros as RegistroAsistencia[]);

      setCargando(false);
    };

    cargar();
  }, [clienteId]);

  const presentes = asistencias.filter(
    (item) => item.estado === "presente",
  ).length;

  const faltas = asistencias.filter((item) => item.estado === "falta").length;

  const ahora = new Date();

  const diasDelMes = new Date(
    ahora.getFullYear(),
    ahora.getMonth() + 1,
    0,
  ).getDate();

  const semanasDelMes = diasDelMes / 7;

  const diasEsperados = Math.round((frecuenciaSemanal ?? 0) * semanasDelMes);

  const porcentaje =
    diasEsperados === 0 ? 0 : Math.round((presentes / diasEsperados) * 100);

  return {
    asistencias,
    presentes,
    faltas,
    porcentaje,
    cargando,
  };
}
