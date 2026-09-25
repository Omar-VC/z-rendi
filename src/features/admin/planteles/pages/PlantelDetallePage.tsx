import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CronometroWidget from "../components/CronometroWidget";
import ModalAgregarBloque from "../components/ModalAgregarBloque";
import ModalVerSesion from "../components/ModalVerSesion";
import { useSesionDelDia } from "../hooks/useSesionDelDia";
import { sesionesService } from "../services/sesiones.service";
import type { SesionEntrenamiento } from "../types/plantel";

type TabTipo = "dia" | "planificacion";

export default function PlantelDetallePage() {
  const { equipoId } = useParams();
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState<TabTipo>("dia");
  const [modalBloqueAbierto, setModalBloqueAbierto] = useState(false);
  const [sesionVerModal, setSesionVerModal] = useState<SesionEntrenamiento | null>(null);

  // Estado para el filtro por fecha en el historial
  const [fechaFiltroHistorial, setFechaFiltroHistorial] = useState("");

  const { 
    sesion, 
    loading, 
    iniciarNuevaSesion, 
    agregarBloque, 
    eliminarBloque, 
    eliminarSesionActual,
    finalizarSesionActual
  } = useSesionDelDia(equipoId);

  const [objetivoInput, setObjetivoInput] = useState("");
  const [microcicloInput, setMicrocicloInput] = useState("MD-3");

  // Estado para la planificación general
  const [mesociclo, setMesociclo] = useState("Pretemporada - Bloque 1");
  const [objetivoMeso, setObjetivoMeso] = useState("Desarrollo de fuerza base e hipertrofia funcional");
  const [microciclo, setMicrociclo] = useState("Semana 2 (MD-3)");
  const [objetivoMicro, setObjetivoMicro] = useState("Carga de volumen moderado + aceleraciones cortas");

  // Estado del historial de sesiones pasadas
  const [historialSesiones, setHistorialSesiones] = useState<SesionEntrenamiento[]>([]);

  // Cargar historial de sesiones completadas desde Firestore
  const cargarHistorial = async () => {
    if (!equipoId) return;
    try {
      const data = await sesionesService.obtenerSesionesPorEquipo(equipoId);
      // Filtramos solo las que están marcadas como completadas
      setHistorialSesiones(data.filter((s) => s.completada === true));
    } catch (err) {
      console.error("Error al cargar el historial:", err);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, [equipoId]);

  // Filtrado dinámico del historial por fecha
  const historialFiltrado = useMemo(() => {
    if (!fechaFiltroHistorial) return historialSesiones;
    return historialSesiones.filter((s) => s.fecha === fechaFiltroHistorial);
  }, [historialSesiones, fechaFiltroHistorial]);

  const colorCategoria = (cat: string) => {
    switch (cat) {
      case "entrada_en_calor": return "border-l-emerald-500 text-emerald-400";
      case "activacion": return "border-l-cyan-500 text-cyan-400";
      case "fuerza": return "border-l-red-500 text-red-400";
      case "resistencia": return "border-l-blue-500 text-blue-400";
      case "tactico": return "border-l-amber-500 text-amber-400";
      case "zona_media": return "border-l-purple-500 text-purple-400";
      case "vuelta_a_la_calma": return "border-l-teal-500 text-teal-400";
      default: return "border-l-gray-500 text-gray-400";
    }
  };

  const handleEliminarSesion = async () => {
    if (confirm("¿Seguro que querés eliminar la sesión de hoy? Se borrarán los bloques cargados.")) {
      if (eliminarSesionActual) {
        await eliminarSesionActual();
      }
    }
  };

  const handleFinalizarSesion = async () => {
    if (!sesion) return;
    if (confirm("¿Deseas dar por FINALIZADA la sesión? Pasará a formar parte del historial.")) {
      const sesionCompletada: SesionEntrenamiento = {
        ...sesion,
        completada: true,
      };

      // 1. Guardar en Firestore
      await finalizarSesionActual();

      // 2. Insertar inmediatamente en el historial local
      setHistorialSesiones((prev) => [sesionCompletada, ...prev]);

      // 3. Recargar desde la base de datos para sincronizar
      await cargarHistorial();
    }
  };

  // FUNCIÓN PARA LIMPIAR TODO EL HISTORIAL EN FIRESTORE
  const handleLimpiarHistorial = async () => {
    if (historialSesiones.length === 0 || !equipoId) return;

    if (
      confirm(
        "⚠️ ¿Estás seguro de que querés borrar TODO el historial de sesiones? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await sesionesService.eliminarHistorialEquipo(equipoId);
        setHistorialSesiones([]);
        setFechaFiltroHistorial("");
      } catch (error) {
        console.error("Error al limpiar el historial:", error);
      }
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-4 sm:space-y-6 font-sans">
      {/* HEADER */}
      <div className="space-y-1 sm:space-y-2">
        <button
          onClick={() => navigate("/equipos")}
          className="text-xs font-semibold text-muted hover:text-primary transition-colors flex items-center gap-1 py-1"
        >
          ← Volver a Planteles
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
              Gestión de Plantel
            </h1>
            <p className="text-[11px] text-muted font-mono">
              Fecha: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1.5 p-1 rounded-xl bg-background/80 shadow-inner w-full sm:w-fit">
        <button
          onClick={() => setTabActiva("dia")}
          className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-bold transition-all text-center ${
            tabActiva === "dia"
              ? "bg-primary text-black shadow-md shadow-primary/25"
              : "text-muted hover:text-text"
          }`}
        >
          ⏱️ Sesión de Hoy
        </button>
        <button
          onClick={() => setTabActiva("planificacion")}
          className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-bold transition-all text-center ${
            tabActiva === "planificacion"
              ? "bg-primary text-black shadow-md shadow-primary/25"
              : "text-muted hover:text-text"
          }`}
        >
          📅 Planificación
        </button>
      </div>

      {/* TAB 1: SESIÓN DEL DÍA */}
      {tabActiva === "dia" && (
        <div className="space-y-6">
          <CronometroWidget />

          {loading ? (
            <div className="p-8 text-center text-xs text-muted font-mono">Cargando sesión...</div>
          ) : !sesion ? (
            /* SIN SESIÓN PROGRAMADA */
            <div className="p-5 sm:p-8 rounded-2xl bg-surfaceSoft shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-4 max-w-lg mx-auto text-center">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-text">Sin sesión programada</h3>
                <p className="text-xs text-muted mt-0.5">Configura el objetivo para comenzar a cargar bloques.</p>
              </div>
              
              <div className="space-y-3 text-left pt-1">
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted font-semibold">Microciclo / Etapa</label>
                  <input 
                    type="text" 
                    placeholder="Ej: MD-3 / Fuerza Máxima"
                    value={microcicloInput}
                    onChange={(e) => setMicrocicloInput(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-background text-text text-xs mt-1 shadow-inner focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted font-semibold">Objetivo Principal</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Estimulación neuromuscular y potencia"
                    value={objetivoInput}
                    onChange={(e) => setObjetivoInput(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-background text-text text-xs mt-1 shadow-inner focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => iniciarNuevaSesion(objetivoInput, microcicloInput)}
                className="w-full active:scale-[0.98] h-12 text-xs font-bold rounded-xl bg-primary text-black hover:bg-primary/90 transition-all shadow-md shadow-primary/25 mt-2 flex items-center justify-center gap-1"
              >
                + Armar Sesión del Día
              </button>
            </div>
          ) : (
            /* SESIÓN ACTIVA */
            <div className="p-4 sm:p-6 rounded-2xl bg-surfaceSoft shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-background/50">
                <div>
                  <span className="text-[10px] font-mono uppercase font-semibold text-primary">
                    {sesion.microciclo}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-text">{sesion.objetivo}</h3>
                </div>
                
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-1 sm:pt-0">
                  <span className="text-xs font-mono font-semibold text-muted bg-background px-3 py-2 rounded-xl shadow-inner">
                    ⏱️ {sesion.duracionTotalMinutos} min
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setModalBloqueAbierto(true)}
                      className="h-10 px-3.5 text-xs font-bold rounded-xl bg-primary text-black hover:bg-primary/90 transition-all shadow-md shadow-primary/25 active:scale-95"
                    >
                      + Bloque
                    </button>

                    <button
                      onClick={handleFinalizarSesion}
                      className="h-10 px-3.5 text-xs font-bold rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all border border-emerald-500/30 active:scale-95 flex items-center gap-1"
                      title="Finalizar y mover al historial"
                    >
                      🏁 Finalizar
                    </button>

                    <button
                      onClick={handleEliminarSesion}
                      className="h-10 px-3 text-xs font-bold rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20 active:scale-95"
                      title="Eliminar sesión"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>

              {/* LISTADO DE BLOQUES */}
              {sesion.bloques.length === 0 ? (
                <div className="p-6 sm:p-8 text-center text-xs text-muted border-2 border-dashed border-background/60 rounded-xl">
                  Aún no agregaste bloques a la práctica. Toca en "+ Bloque" para estructurar la rutina.
                </div>
              ) : (
                <div className="space-y-3">
                  {sesion.bloques.map((bloque, idx) => (
                    <div 
                      key={bloque.id || idx}
                      className={`p-3.5 sm:p-4 rounded-xl bg-background/90 border-l-4 ${colorCategoria(bloque.categoria)} flex items-start justify-between gap-3 shadow-sm`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted">
                            Bloque {idx + 1} • {bloque.categoria.replace("_", " ")}
                          </span>
                          <span className="text-[10px] font-mono bg-surfaceSoft px-2 py-0.5 rounded text-text/80">
                            {bloque.duracionMinutos} min
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-text">{bloque.titulo}</h4>
                        {bloque.descripcion && (
                          <p className="text-xs text-muted whitespace-pre-line pt-0.5">{bloque.descripcion}</p>
                        )}
                      </div>

                      <button
                        onClick={() => eliminarBloque(idx)}
                        className="text-muted hover:text-red-400 text-xs p-1.5 transition-colors active:scale-90"
                        title="Eliminar bloque"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HISTORIAL RÁPIDO DE SESIONES CON FILTRO Y LIMPIEZA */}
          <div className="p-4 sm:p-6 rounded-2xl bg-surfaceSoft shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-background/50 pb-3">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-text">📜 Historial de Sesiones</h4>
                <span className="text-[10px] font-mono bg-background px-2 py-0.5 rounded-full text-muted">
                  {historialFiltrado.length}
                </span>
              </div>

              {/* CONTROLES: FILTRO DE FECHA Y BOTÓN DE LIMPIAR HISTORIAL */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-background/60 px-2 py-1 rounded-xl">
                  <span className="text-[10px] text-muted font-mono">Fecha:</span>
                  <input
                    type="date"
                    value={fechaFiltroHistorial}
                    onChange={(e) => setFechaFiltroHistorial(e.target.value)}
                    className="h-7 px-1 rounded-lg bg-background text-text text-[11px] focus:outline-none"
                  />
                  {fechaFiltroHistorial && (
                    <button
                      onClick={() => setFechaFiltroHistorial("")}
                      className="text-xs text-muted hover:text-text px-1"
                      title="Limpiar filtro"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* BOTÓN LIMPIAR HISTORIAL */}
                {historialSesiones.length > 0 && (
                  <button
                    onClick={handleLimpiarHistorial}
                    className="h-8 px-2.5 text-[11px] font-bold rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20 active:scale-95 flex items-center gap-1"
                    title="Vaciar todo el historial"
                  >
                    🗑️ Limpiar
                  </button>
                )}
              </div>
            </div>

            {historialFiltrado.length === 0 ? (
              <p className="text-xs text-muted text-center py-4">
                {fechaFiltroHistorial 
                  ? "No se encontraron sesiones para la fecha seleccionada." 
                  : "No hay historial de sesiones registradas para este plantel."}
              </p>
            ) : (
              <div className="space-y-2">
                {historialFiltrado.map((s) => (
                  <div 
                    key={s.id || s.fecha}
                    className="p-3 rounded-xl bg-background/80 flex items-center justify-between gap-3 hover:bg-background transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-primary uppercase">{s.microciclo || "Sesión"}</span>
                        <span className="text-[10px] font-mono text-muted">{s.fecha}</span>
                      </div>
                      <p className="text-xs font-bold text-text line-clamp-1">{s.objetivo}</p>
                    </div>

                    <button
                      onClick={() => setSesionVerModal(s)}
                      className="h-8 px-3 text-[11px] font-bold rounded-lg bg-surfaceSoft text-text hover:bg-primary hover:text-black transition-all active:scale-95 shrink-0"
                    >
                      Ver sesión
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PLANIFICACIÓN GENERAL (MESO Y MICRO) */}
      {tabActiva === "planificacion" && (
        <div className="space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-surfaceSoft shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-text border-b border-background/50 pb-2 sm:pb-3">
              Planificación General del Plantel
            </h3>

            {/* SECCIÓN MESOCICLO */}
            <div className="space-y-2 p-3 sm:p-4 rounded-xl bg-background/60">
              <span className="text-[10px] font-mono font-bold uppercase text-primary">
                Mesociclo (Objetivo Mensual / Etapa)
              </span>
              <div className="space-y-2">
                <input 
                  type="text"
                  value={mesociclo}
                  onChange={(e) => setMesociclo(e.target.value)}
                  placeholder="Ej: Mesociclo 1 - Hipertrofia & Resistencia Aeróbica"
                  className="w-full h-11 px-3 rounded-xl bg-background text-text text-xs shadow-inner focus:outline-none"
                />
                <textarea 
                  rows={2}
                  value={objetivoMeso}
                  onChange={(e) => setObjetivoMeso(e.target.value)}
                  placeholder="Detalla los objetivos principales del mes..."
                  className="w-full p-3 rounded-xl bg-background text-text text-xs shadow-inner focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* SECCIÓN MICROCICLO */}
            <div className="space-y-2 p-3 sm:p-4 rounded-xl bg-background/60">
              <span className="text-[10px] font-mono font-bold uppercase text-primary">
                Microciclo (Objetivo Semanal)
              </span>
              <div className="space-y-2">
                <input 
                  type="text"
                  value={microciclo}
                  onChange={(e) => setMicrociclo(e.target.value)}
                  placeholder="Ej: Semana 3 (MD-3) - Aceleración Corta"
                  className="w-full h-11 px-3 rounded-xl bg-background text-text text-xs shadow-inner focus:outline-none"
                />
                <textarea 
                  rows={2}
                  value={objetivoMicro}
                  onChange={(e) => setObjetivoMicro(e.target.value)}
                  placeholder="Detalla las prioridades de esta semana..."
                  className="w-full p-3 rounded-xl bg-background text-text text-xs shadow-inner focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA AGREGAR BLOQUE */}
      <ModalAgregarBloque
        isOpen={modalBloqueAbierto}
        onClose={() => setModalBloqueAbierto(false)}
        onAgregar={agregarBloque}
      />

      {/* MODAL PARA VER SESIÓN PASADA DEL HISTORIAL */}
      <ModalVerSesion
        sesion={sesionVerModal}
        onClose={() => setSesionVerModal(null)}
      />
    </div>
  );
}