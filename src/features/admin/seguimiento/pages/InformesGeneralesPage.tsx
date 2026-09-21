import { useEffect, useState } from "react";
import { useAuth } from "../../../../auth/useAuth";
import {
  obtenerResumenAtletas,
  generarTextoWhatsApp,
  type ResumenAtleta,
} from "../services/informes.service";
import { getClientes } from "../../clientes/services/clientes.service";
import { Card, Button, Badge } from "../../../../shared/ui";

export default function InformesGeneralesPage() {
  const { user } = useAuth();
  const [resumenes, setResumenes] = useState<ResumenAtleta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
  async function cargarDatosAutomáticos() {
    if (!user) return;
    setCargando(true);
    try {
      // 1. Traemos la lista completa de la colección "usuarios"
      const listaClientes = await getClientes();

      // 2. Filtramos ÚNICAMENTE los clientes con estadoCuenta activo
      const clientesActivos = listaClientes.filter(
        (cliente: any) => cliente.estadoCuenta === "activo"
      );

      // 3. Mapeamos solo los clientes activos
      const atletas = clientesActivos.map((cliente: any) => ({
        id: cliente.id,
        nombre: `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim() || "Atleta",
      }));

      // 4. Traemos los informes solo de los atletas activos
      if (atletas.length > 0) {
        const datos = await obtenerResumenAtletas(atletas);
        setResumenes(datos);
      } else {
        setResumenes([]);
      }
    } catch (error) {
      console.error("Error al cargar atletas activos de Firestore:", error);
    } finally {
      setCargando(false);
    }
  }

  cargarDatosAutomáticos();
}, [user]);


  function copiarParaWhatsApp() {
    const texto = generarTextoWhatsApp(resumenes);
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  function imprimirOExportarPDF() {
    window.print();
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 text-left max-w-5xl mx-auto">
      {/* CABECERA Y ACCIONES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-wider text-text">
            📊 Registro General de Atletas
          </h1>
          <p className="text-xs text-muted font-medium mt-1">
            Asistencias, porcentaje de cumplimiento y evolución
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="!min-h-0 h-9 !px-3 text-xs font-bold"
            onClick={imprimirOExportarPDF}
          >
            📄 PDF / Imprimir
          </Button>

          <Button
            variant="accent"
            className="!min-h-0 h-9 !px-4 text-xs font-bold shadow-[0_0_12px_rgba(255,85,0,0.25)]"
            onClick={copiarParaWhatsApp}
          >
            {copiado ? "¡Copiado! 🚀" : "📲 Copiar p/ WhatsApp"}
          </Button>
        </div>
      </div>

      {/* ESTADO DE CARGA */}
      {cargando ? (
        <p className="text-xs text-muted animate-pulse">
          Cargando lista de atletas, asistencias y rendimiento...
        </p>
      ) : resumenes.length === 0 ? (
        <p className="text-xs text-muted italic">
          No se encontraron atletas registrados en la plataforma.
        </p>
      ) : (
        /* GRID DE ATLETAS */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumenes.map((atleta) => (
            <Card
              key={atleta.clienteId}
              className="!p-5 bg-surfaceSoft/60 border-border/50 rounded-xl space-y-4 shadow-sm"
            >
              {/* ATLETA HEADER */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-text uppercase">
                  👤 {atleta.nombre}
                </span>
                <Badge
                  variant="neutral"
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 ${
                    atleta.asistencias.porcentajeMes >= 80
                      ? "bg-accent/10 text-accent border-accent/30"
                      : "bg-danger/10 text-danger border-danger/30"
                  }`}
                >
                  {atleta.asistencias.porcentajeMes}% Cumplimiento
                </Badge>
              </div>

              {/* BARRA DE ASISTENCIA */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-muted">
                  <span>Asistencias registradas</span>
                  <span className="font-mono text-text">
                    {atleta.asistencias.completadasMes} / {atleta.asistencias.diasHabilesMes} días hábiles
                  </span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border/30">
                  <div
                    className="h-full bg-accent transition-all duration-500 rounded-full"
                    style={{ width: `${atleta.asistencias.porcentajeMes}%` }}
                  />
                </div>
              </div>

              {/* BARRERAS Y SEGUIMIENTO DE RENDIMIENTO */}
              <div className="pt-2 border-t border-border/30 space-y-2">
                <span className="text-[10px] font-bold uppercase text-muted tracking-wider block">
                  Seguimiento de Barreras:
                </span>
                {atleta.barreras.length > 0 ? (
                  <div className="space-y-1.5">
                    {atleta.barreras.map((b, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs bg-surface/50 p-2 rounded-lg border border-border/30"
                      >
                        <div className="flex items-center gap-2">
                          <span>{b.estado === "superada" ? "✅" : "🎯"}</span>
                          <span className="font-semibold text-text">{b.nombre}</span>
                        </div>
                        <div className="font-mono text-muted text-[11px]">
                          <span>Obj: {b.objetivo} {b.unidad}</span>
                          {b.resultado !== "En progreso" && (
                            <span className="text-accent font-bold ml-2">
                              ({b.resultado} {b.unidad})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted italic">
                    Sin barreras registradas.
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}