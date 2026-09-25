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
  const clienteDinamico = cliente as any;

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
      className={`!p-3 transition-all duration-200 transform-gpu border border-border/50 ${
        expandido ? "border-primary/50 shadow-[0_0_15px_rgba(255,85,0,0.12)] bg-surfaceHover/40" : ""
      }`}
    >
      {/* FILA PRINCIPAL COMPACTA */}
      <div className="flex items-center justify-between gap-3">
        
        {/* AVATAR + NOMBRE + METADATOS */}
        <div 
          onClick={() => navigate(`/clientes/${cliente.id}`)}
          className="flex items-center gap-3 min-w-0 cursor-pointer group flex-1"
        >
          {/* Avatar */}
          <div className="relative w-10 h-10 rounded-xl bg-surfaceSoft border border-primary/30 flex items-center justify-center font-black text-primary text-xs shrink-0 shadow-[0_0_10px_rgba(255,85,0,0.1)] overflow-hidden">
            {cliente.fotoUrl ? (
              <img
                src={cliente.fotoUrl}
                alt={`${cliente.nombre} ${cliente.apellido}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{iniciales}</span>
            )}
            
            {/* Indicador de estado rápido (Verde si está activo) */}
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-surface ${
              estaActivo ? "bg-emerald-500" : "bg-muted"
            }`} />
          </div>

          {/* Info Principal */}
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-text truncate group-hover:text-primary transition-colors">
              {cliente.nombre} {cliente.apellido}
            </h3>
            
            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted">
              {clienteDinamico.deporte && (
                <span className="bg-surfaceSoft px-1.5 py-0.5 rounded text-[10px] font-semibold text-text/70 uppercase">
                  {clienteDinamico.deporte}
                </span>
              )}
              {clienteDinamico.telefono && (
                <span className="truncate opacity-75 hidden sm:inline">
                  📞 {clienteDinamico.telefono}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ACCIONES RÁPIDAS */}
        <div className="flex items-center gap-1.5 shrink-0">
          {estaActivo ? (
            <>
              {/* Botón rápido Asistencia */}
              <Button
                variant="accent"
                className="!min-h-0 !h-8 !px-3 text-xs font-semibold shadow-[0_0_10px_rgba(255,85,0,0.2)]"
                onClick={() => setMostrandoAsistencia(true)}
              >
                + Asistencia
              </Button>

              {/* Botón rápido Perfil */}
              <Button
                variant="secondary"
                className="!min-h-0 !h-8 !px-2.5 text-xs font-semibold hidden sm:inline-flex"
                onClick={() => navigate(`/clientes/${cliente.id}`)}
              >
                Perfil
              </Button>
            </>
          ) : (
            <Button
              variant="success"
              className="!min-h-0 !h-8 !px-3 text-xs font-semibold"
              onClick={manejarReactivacion}
            >
              Reactivar
            </Button>
          )}

          {/* Menú de más opciones */}
          <button
            onClick={() => setExpandido(!expandido)}
            className={`p-1.5 rounded-lg bg-surfaceSoft/80 border border-border/50 text-muted hover:text-text transition-all ${
              expandido ? "rotate-180 bg-primary/10 text-primary border-primary/30" : ""
            }`}
            title="Más opciones"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* SECCIÓN DESPLEGABLE */}
      {expandido && (
        <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs animate-fadeIn">
          <span className="text-muted">
            Estado: <strong className={estaActivo ? "text-emerald-400" : "text-amber-400"}>
              {estaActivo ? "Activo" : "Dado de baja"}
            </strong>
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="!min-h-0 !h-7 !px-2.5 text-[11px] sm:hidden"
              onClick={() => navigate(`/clientes/${cliente.id}`)}
            >
              Ver Perfil
            </Button>

            {estaActivo && (
              <Button
                variant="danger"
                className="!min-h-0 !h-7 !px-2.5 text-[11px] opacity-80 hover:opacity-100"
                onClick={manejarBaja}
              >
                Dar de Baja
              </Button>
            )}
          </div>
        </div>
      )}

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