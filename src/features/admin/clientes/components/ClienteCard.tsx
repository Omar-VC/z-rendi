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

  onDarDeBaja?: (id: string) => void;
  onReactivar?: (id: string) => void;
}

function ClienteCard({ cliente, onDarDeBaja, onReactivar }: ClienteCardProps) {
  const navigate = useNavigate();

  const [mostrandoAsistencia, setMostrandoAsistencia] = useState(false);

  const { cuotas } = useCuotasCliente(cliente.id);

  const { porcentaje, cargando: cargandoAsistencia } = useAsistencia(
    cliente.id,
    cliente.frecuenciaSemanal,
  );

  const ultimaCuota = cuotas[0];

  const estaActivo = cliente.estadoCuenta === "activo";

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
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-text">
            {cliente.nombre} {cliente.apellido}
          </h3>

          <div className="mt-3">
            {estaActivo ? (
              <Badge variant="success">Activo</Badge>
            ) : (
              <Badge variant="warning">Dado de baja</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {estaActivo && (
            <>
              <RegistrarAsistenciaButton
                onClick={() => setMostrandoAsistencia(true)}
              />

              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => navigate(`/clientes/${cliente.id}`)}
              >
                Ver perfil
              </Button>

              <Button
                variant="danger"
                className="w-full sm:w-auto"
                onClick={manejarBaja}
              >
                Dar de baja
              </Button>
            </>
          )}

          {!estaActivo && (
            <Button
              variant="success"
              className="w-full sm:w-auto"
              onClick={manejarReactivacion}
            >
              Reactivar
            </Button>
          )}
        </div>
      </div>

      {/* Información */}

      <div className="mt-6 border-t border-border pt-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted">Cuota</span>

          <span className="font-semibold text-text">
            {ultimaCuota
              ? `${ultimaCuota.mes} • ${ultimaCuota.estado}`
              : "Sin cuota"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted">Asistencia</span>

          <span className="font-semibold text-text">
            {cargandoAsistencia ? "Cargando..." : `${porcentaje}%`}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted">Seguimiento</span>

          <span className="font-semibold text-muted">Sin información</span>
        </div>
      </div>

      {/* Modal asistencia */}

      {mostrandoAsistencia && (
        <RegistrarAsistenciaModal
          cliente={cliente}
          onCerrar={() => setMostrandoAsistencia(false)}
        />
      )}
    </Card>
  );
}

export default ClienteCard;
