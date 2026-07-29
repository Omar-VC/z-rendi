import { useNavigate } from "react-router-dom";
import { useState } from "react";

import type { Cliente } from "../types";

import RegistrarAsistenciaButton from "../../asistencia/components/RegistrarAsistenciaButton";
import RegistrarAsistenciaModal from "../../asistencia/components/RegistrarAsistenciaModal";

import { useCuotasCliente } from "../../cuotas/hooks/useCuotasCliente";
import { useAsistencia } from "../../asistencia/hooks/useAsistencia";

import { Card, Button, Badge } from "../../../../shared/ui";

interface ClienteCardProps {
  cliente: Cliente;
}

function ClienteCard({ cliente }: ClienteCardProps) {
  const navigate = useNavigate();

  const { cuotas } = useCuotasCliente(cliente.id);

  const {
    porcentaje,
    cargando: cargandoAsistencia,
  } = useAsistencia(
    cliente.id,
    cliente.frecuenciaSemanal
  );

  const ultimaCuota = cuotas[0];

  const [
    mostrandoAsistencia,
    setMostrandoAsistencia,
  ] = useState(false);

  return (
    <>
      <Card>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">

          <div>

            <h3 className="text-xl font-bold text-text">
              {cliente.nombre} {cliente.apellido}
            </h3>

            <div className="mt-3">
              <Badge variant="success">
                Activo
              </Badge>
            </div>

          </div>

          <div className="flex gap-2">

            <RegistrarAsistenciaButton
              onClick={() => setMostrandoAsistencia(true)}
            />

            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/clientes/${cliente.id}`)
              }
            >
              Ver perfil
            </Button>

          </div>

        </div>

        {/* Información */}
        <div className="mt-6 border-t border-border pt-5 space-y-4">

          <div className="flex items-center justify-between">

            <span className="text-muted">
              Cuota
            </span>

            <span className="font-semibold text-text">

              {ultimaCuota
                ? `${ultimaCuota.mes} • ${ultimaCuota.estado}`
                : "Sin cuota"}

            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-muted">
              Asistencia
            </span>

            <span className="font-semibold text-text">

              {cargandoAsistencia
                ? "Cargando..."
                : `${porcentaje}%`}

            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-muted">
              Seguimiento
            </span>

            <span className="font-semibold text-muted">
              Sin información
            </span>

          </div>

        </div>

      </Card>

      {mostrandoAsistencia && (
        <RegistrarAsistenciaModal
          cliente={cliente}
          onCerrar={() =>
            setMostrandoAsistencia(false)
          }
        />
      )}
    </>
  );
}

export default ClienteCard;