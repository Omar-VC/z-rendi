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
  const [mostrandoAsistencia, setMostrandoAsistencia] = useState(false);
  const { cuotas } = useCuotasCliente(cliente.id);

  const ultimaCuota = cuotas[0];
  const estaActivo = cliente.estadoCuenta === "activo";

  // Iniciales del cliente para el avatar compacto
  const iniciales = `${cliente.nombre?.[0] || ""}${cliente.apellido?.[0] || ""}`.toUpperCase() || "AT";

  async function manejarBaja() {
    const confirmar = window.confirm(
      `¿Dar de baja a ${cliente.nombre} ${cliente.apellido}?`
    );
    if (!confirmar) return;
    onDarDeBaja?.(cliente.id);
  }

  async function manejarReactivacion() {
    const confirmar = window.confirm(
      `¿Reactivar a ${cliente.nombre} ${cliente.apellido}?`
    );
    if (!confirmar) return;
    onReactivar?.(cliente.id);
  }

  return (
    <Card hover className="!p-3 transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* 1. INFORMACIÓN Y PERFIL DEL ATLETA */}
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="w-9 h-9 rounded-xl bg-surfaceSoft border border-primary/30 flex items-center justify-center font-black text-primary text-xs shrink-0 shadow-[0_0_10px_rgba(255,85,0,0.1)]">
            {iniciales}
          </div>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text truncate">
                {cliente.nombre} {cliente.apellido}
              </h3>
              <Badge variant={estaActivo ? "success" : "warning"} className="text-[10px] px-1.5 py-0.5">
                {estaActivo ? "Activo" : "Baja"}
              </Badge>
            </div>
            <p className="text-xs text-muted truncate">
              {cliente.email}
            </p>
          </div>
        </div>

        {/* 2. ESTADO DE LA CUOTA */}
        <div className="flex items-center gap-2 bg-surfaceSoft/50 px-3 py-1.5 rounded-lg border border-border/40 shrink-0">
          <span className="text-xs text-muted font-medium">Cuota:</span>
          <span className="text-xs font-bold text-text capitalize">
            {ultimaCuota ? (
              <span className="flex items-center gap-1">
                {ultimaCuota.mes}
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  ultimaCuota.estado === "pagada" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                }`}>
                  {ultimaCuota.estado}
                </span>
              </span>
            ) : (
              <span className="text-muted/60">Sin cuota</span>
            )}
          </span>
        </div>

        {/* 3. ACCIONES RÁPIDAS EN LÍNEA */}
        <div className="flex items-center gap-2 justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/30">
          {estaActivo ? (
            <>
              <RegistrarAsistenciaButton
                onClick={() => setMostrandoAsistencia(true)}
              />

              <Button
                variant="secondary"
                className="!min-h-0 !h-8 !px-3 text-xs font-semibold"
                onClick={() => navigate(`/clientes/${cliente.id}`)}
              >
                Perfil
              </Button>

              <Button
                variant="danger"
                className="!min-h-0 !h-8 !px-2.5 text-xs font-semibold opacity-70 hover:opacity-100"
                onClick={manejarBaja}
              >
                Baja
              </Button>
            </>
          ) : (
            <Button
              variant="success"
              className="!min-h-0 !h-8 !px-4 text-xs font-semibold"
              onClick={manejarReactivacion}
            >
              Reactivar
            </Button>
          )}
        </div>
      </div>

      {/* MODAL DE ASISTENCIA */}
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