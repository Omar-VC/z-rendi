import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../shared/ui";
import { usePlanteles } from "../hooks/usePlanteles";
import ModalCrearEquipo from "../components/ModalCrearEquipo";

export default function PlantelesSelectorPage() {
  const navigate = useNavigate();
  const { equipos, loading, error, agregarEquipo } = usePlanteles();
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex items-end justify-between pb-2">
        <div>
          <span className="text-xs font-mono tracking-widest uppercase text-primary font-semibold">
            Módulo Táctico // Preparación Física
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-text mt-1">
            Planteles & Equipos
          </h1>
        </div>
        <Button
          variant="accent"
          onClick={() => setModalAbierto(true)}
          className="!h-10 !px-4 text-xs font-semibold rounded-xl !bg-primary hover:!bg-primary/90 transition-all shadow-lg shadow-primary/25"
        >
          + Crear Equipo
        </Button>
      </div>

      {/* ESTADOS DE CARGA Y ERROR */}
      {loading && (
        <div className="p-12 text-center text-muted font-mono text-xs">
          Cargando planteles desde Firebase...
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 text-red-400 font-mono text-xs">
          {error}
        </div>
      )}

      {!loading && equipos.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-surfaceSoft shadow-md space-y-3">
          <p className="text-sm font-semibold text-text">
            Aún no hay equipos registrados
          </p>
          <p className="text-xs text-muted">
            Crea el primer plantel para comenzar a estructurar las sesiones.
          </p>
        </div>
      )}

      {/* TARJETAS CON DATOS REALES DE FIREBASE */}
      {!loading && equipos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {equipos.map((eq) => (
            <div
              key={eq.id}
              onClick={() => navigate(`/equipos/${eq.id}`)}
              className="group cursor-pointer p-6 rounded-2xl bg-surfaceSoft shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-6"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-primary/20 text-primary">
                      {eq.deporte}
                    </span>
                    {eq.categoria && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-background/60 text-muted">
                        {eq.categoria}
                      </span>
                    )}
                    <span className="text-xs text-text/70 font-medium">
                      👥 {eq.atletasCount || 0} Atletas
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-text group-hover:text-primary transition-colors">
                    {eq.nombre}
                  </h2>
                </div>
                <span className="w-9 h-9 rounded-xl bg-background flex items-center justify-center text-muted group-hover:text-primary group-hover:bg-primary/20 transition-all text-sm font-bold shadow-inner">
                  →
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-background/80 flex items-center justify-between text-xs text-muted shadow-inner">
                <span>Próxima sesión:</span>
                <span className="text-text font-semibold">
                  {eq.proximaSesion || "Sin programar"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE CREACIÓN */}
      <ModalCrearEquipo
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={async (equipo) => {
          await agregarEquipo(equipo);
        }}
      />
    </div>
  );
}
