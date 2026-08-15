import { useNavigate } from "react-router-dom";
import { useState } from "react";

import type { Cliente } from "../types";

import RegistrarAsistenciaButton from "../../asistencia/components/RegistrarAsistenciaButton";
import RegistrarAsistenciaModal from "../../asistencia/components/RegistrarAsistenciaModal";

import { useCuotasCliente } from "../../cuotas/hooks/useCuotasCliente";

import { Card, Button, Badge } from "../../../../shared/ui";

interface ClienteCardProps {
  cliente: Cliente;

  onDarDeBaja?: (id: string) => void;
  onReactivar?: (id: string) => void;
}

function ClienteCard({
  cliente,
  onDarDeBaja,
  onReactivar,
}: ClienteCardProps) {
  const navigate = useNavigate();

  const [mostrandoAsistencia, setMostrandoAsistencia] =
    useState(false);

  const { cuotas } = useCuotasCliente(cliente.id);

  const ultimaCuota = cuotas[0];

  const estaActivo =
    cliente.estadoCuenta === "activo";

  async function manejarBaja() {
    const confirmar = window.confirm(
      `¿Dar de baja a ${cliente.nombre} ${cliente.apellido}?`,
    );

    if (!confirmar) return;

    onDarDeBaja?.(cliente.id);
  }

  async function manejarReactivacion() {
    const confirmar = window.confirm(
      `¿Reactivar a ${cliente.nombre} ${cliente.apellido}?`,
    );

    if (!confirmar) return;

    onReactivar?.(cliente.id);
  }

  return (
    <Card>
      <div className="space-y-3">

        {/* Encabezado */}

        <div className="flex items-center justify-between gap-3">

          <h3 className="text-lg font-semibold text-text truncate">
            {cliente.nombre} {cliente.apellido}
          </h3>

          {estaActivo ? (
            <Badge variant="success">
              Activo
            </Badge>
          ) : (
            <Badge variant="warning">
              Dado de baja
            </Badge>
          )}

        </div>


        {/* Cuota */}

        <div className="
          flex
          items-center
          justify-between
          gap-3
          rounded-lg
          bg-surface
          px-3
          py-2
        ">

          <span className="text-sm text-muted">
            Cuota
          </span>

          <span className="text-sm font-semibold text-text capitalize">
            {ultimaCuota
              ? `${ultimaCuota.mes} · ${ultimaCuota.estado}`
              : "Sin cuota"}
          </span>

        </div>


        {/* Acciones */}

        {estaActivo ? (

          <div className="grid grid-cols-3 gap-2">

            <RegistrarAsistenciaButton
              onClick={() =>
                setMostrandoAsistencia(true)
              }
            />

            <Button
              variant="secondary"
              className="
                !min-h-0
                !h-9
                !px-2
                !py-1
                text-sm
              "
              onClick={() =>
                navigate(`/clientes/${cliente.id}`)
              }
            >
              Perfil
            </Button>

            <Button
              variant="danger"
              className="
                !min-h-0
                !h-9
                !px-2
                !py-1
                text-sm
              "
              onClick={manejarBaja}
            >
              Baja
            </Button>

          </div>

        ) : (

          <Button
            variant="success"
            className="
              !min-h-0
              !h-9
              !px-3
              !py-1
              text-sm
            "
            onClick={manejarReactivacion}
          >
            Reactivar
          </Button>

        )}

      </div>


      {/* Modal asistencia */}

      {mostrandoAsistencia && (
        <RegistrarAsistenciaModal
          cliente={cliente}
          onCerrar={() =>
            setMostrandoAsistencia(false)
          }
        />
      )}

    </Card>
  );
}

export default ClienteCard;