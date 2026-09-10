import { useNavigate } from "react-router-dom";
import { useState } from "react";

import type { Cliente } from "../../clientes/types";

import RegistrarAsistenciaModal from "../../asistencia/components/RegistrarAsistenciaModal";
import { Card, Button } from "../../../../shared/ui";

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
  const [expandido, setExpandido] = useState(false);

  const estaActivo = cliente.estadoCuenta === "activo";
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
    <Card 
      hover 
      className={`!p-3 transition-all duration-200 transform-gpu ${
        expandido ? "border-primary/50 shadow-[0_0_15px_rgba(255,85,0,0.15)] bg-surfaceHover/50" : ""
      }`}
    >
      {/* CABECERA MÍNIMA: Avatar, Nombre y Flecha desplegable */}
      <div 
        onClick={() => setExpandido(!expandido)}
        className="flex items-center justify-between gap-4 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-surfaceSoft border border-primary/30 flex items-center justify-center font-black text-primary text-xs shrink-0 shadow-[0_0_10px_rgba(255,85,0,0.1)]">
            {iniciales}
          </div>

          <h3 className="text-sm font-bold text-text truncate">
            {cliente.nombre} {cliente.apellido}
          </h3>
        </div>

        {/* Flecha indicadora con animación fluida optimizada */}
        <div className="flex items-center gap-2 text-muted">
          <span className="text-xs opacity-60 hidden sm:inline">
            {expandido ? "Cerrar" : "Acciones"}
          </span>
          <div className={`p-1 rounded-lg bg-surfaceSoft/60 border border-border/40 transition-transform duration-200 transform-gpu ${
            expandido ? "rotate-180 bg-primary/10 text-primary border-primary/30" : ""
          }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* SECCIÓN DESPLEGABLE OPTIMIZADA PARA MÓVILES */}
      <div 
        className={`grid transition-all duration-200 ease-out transform-gpu overflow-hidden ${
          expandido 
            ? "grid-rows-[1fr] opacity-150 mt-3 pt-3 border-t border-border/40 scale-y-100" 
            : "grid-rows-[0fr] opacity-0 mt-0 pt-0 border-t-0 scale-y-95 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden flex items-center justify-end gap-2">
          {estaActivo ? (
            <>
              <Button
                variant="accent"
                className="!min-h-0 !h-8 !px-3 text-xs font-semibold shadow-[0_0_10px_rgba(255,85,0,0.2)]"
                onClick={() => {
                  setMostrandoAsistencia(true);
                }}
              >
                Asistencia
              </Button>

              <Button
                variant="secondary"
                className="!min-h-0 !h-8 !px-3 text-xs font-semibold"
                onClick={() => {
                  navigate(`/clientes/${cliente.id}`);
                }}
              >
                Perfil
              </Button>

              <Button
                variant="danger"
                className="!min-h-0 !h-8 !px-2.5 text-xs font-semibold opacity-70 hover:opacity-100"
                onClick={() => {
                  manejarBaja();
                }}
              >
                Baja
              </Button>
            </>
          ) : (
            <Button
              variant="success"
              className="!min-h-0 !h-8 !px-4 text-xs font-semibold"
              onClick={() => {
                manejarReactivacion();
              }}
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