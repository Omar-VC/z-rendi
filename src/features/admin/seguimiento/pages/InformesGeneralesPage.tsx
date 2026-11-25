
import { useEffect, useState } from "react";
import { useAuth } from "../../../../auth/useAuth";
import {
  obtenerResumenAtletas,
  generarTextoWhatsApp,
  generarTextoInformeIndividual,
  type ResumenAtleta,
} from "../services/informes.service";

import {
  listarNotasPrivadasPreparador,
  guardarNotaPrivada,
} from "../services/notasPrivadas.service";

import { getClientes } from "../../clientes/services/clientes.service";
import { Card, Button, Badge } from "../../../../shared/ui";

export default function InformesGeneralesPage() {
  const { user } = useAuth();

  const [resumenes, setResumenes] = useState<ResumenAtleta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [copiadoGlobal, setCopiadoGlobal] = useState(false);

  const [notasPrivadas, setNotasPrivadas] = useState<Record<string, string>>(
    {},
  );

  const [estadoNota, setEstadoNota] = useState<
    Record<string, "guardando" | "ok" | "error" | null>
  >({});

  const [copiadoIndividual, setCopiadoIndividual] = useState<
    Record<string, boolean>
  >({});

  const ahora = new Date();
  const mesActual = ahora.getMonth() + 1;
  const anioActual = ahora.getFullYear();

  useEffect(() => {
    async function cargarDatosAutomaticos() {
      if (!user) return;

      setCargando(true);

      try {
        const listaClientes = await getClientes();

        const clientesActivos = listaClientes.filter(
          (cliente) => cliente.estadoCuenta === "activo",
        );

        const atletas = clientesActivos.map((cliente) => ({
          id: cliente.id,
          nombre:
            `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim() ||
            "Atleta",
        }));

        if (atletas.length > 0) {
          const datos = await obtenerResumenAtletas(atletas);
          setResumenes(datos);

          const notasGuardadas = await listarNotasPrivadasPreparador(
            mesActual,
            anioActual,
          );

          const idsAtletas = new Set(atletas.map((atleta) => atleta.id));

          const notas: Record<string, string> = {};

          notasGuardadas.forEach((nota) => {
            if (idsAtletas.has(nota.clienteId)) {
              notas[nota.clienteId] = nota.nota;
            }
          });

          setNotasPrivadas(notas);
        } else {
          setResumenes([]);
          setNotasPrivadas({});
        }
      } catch (error) {
        console.error("Error en la carga de informes:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatosAutomaticos();
  }, [user, mesActual, anioActual]);

  function copiarParaWhatsApp() {
    const texto = generarTextoWhatsApp(resumenes);

    navigator.clipboard.writeText(texto);

    setCopiadoGlobal(true);
    setTimeout(() => setCopiadoGlobal(false), 2500);
  }

  function copiarInformeIndividual(atleta: ResumenAtleta) {
    const texto = generarTextoInformeIndividual(
      atleta,
      mesActual,
      anioActual,
    );

    navigator.clipboard.writeText(texto);

    setCopiadoIndividual((prev) => ({
      ...prev,
      [atleta.clienteId]: true,
    }));

    setTimeout(() => {
      setCopiadoIndividual((prev) => ({
        ...prev,
        [atleta.clienteId]: false,
      }));
    }, 2500);
  }

  async function guardarNotaPrivadaAtleta(
    clienteId: string,
    texto: string,
  ) {
    setEstadoNota((prev) => ({
      ...prev,
      [clienteId]: "guardando",
    }));

    try {
      await guardarNotaPrivada(
        clienteId,
        mesActual,
        anioActual,
        texto,
      );

      setNotasPrivadas((prev) => ({
        ...prev,
        [clienteId]: texto,
      }));

      setEstadoNota((prev) => ({
        ...prev,
        [clienteId]: "ok",
      }));

      setTimeout(() => {
        setEstadoNota((prev) => ({
          ...prev,
          [clienteId]: null,
        }));
      }, 2500);
    } catch (error) {
      console.error("Error al guardar nota privada:", error);

      setEstadoNota((prev) => ({
        ...prev,
        [clienteId]: "error",
      }));

      setTimeout(() => {
        setEstadoNota((prev) => ({
          ...prev,
          [clienteId]: null,
        }));
      }, 2500);
    }
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
            {copiadoGlobal ? "¡Copiado! 🚀" : "📲 Copiar p/ WhatsApp"}
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
                    {atleta.asistencias.completadasMes} /{" "}
                    {atleta.asistencias.diasHabilesMes} días hábiles
                  </span>
                </div>

                <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border/30">
                  <div
                    className="h-full bg-accent transition-all duration-500 rounded-full"
                    style={{
                      width: `${atleta.asistencias.porcentajeMes}%`,
                    }}
                  />
                </div>
              </div>

              {/* BARRERAS Y SEGUIMIENTO */}
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
                          <span>
                            {b.estado === "superada" ? "✅" : "🎯"}
                          </span>

                          <span className="font-semibold text-text">
                            {b.nombre}
                          </span>
                        </div>

                        <div className="font-mono text-muted text-[11px]">
                          <span>
                            Obj: {b.objetivo} {b.unidad}
                          </span>

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

              {/* NOTAS PRIVADAS DEL PREPARADOR */}
              <div className="pt-2 border-t border-border/30 space-y-2">
                <span className="text-[10px] font-bold uppercase text-muted tracking-wider block">
                  Nota privada del preparador
                </span>

                <textarea
                  value={notasPrivadas[atleta.clienteId] ?? ""}
                  onChange={(e) => {
                    setNotasPrivadas((prev) => ({
                      ...prev,
                      [atleta.clienteId]: e.target.value,
                    }));
                  }}
                  className="w-full h-16 text-xs p-2 bg-surface border border-border/30 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-muted placeholder-text-[10px]"
                  placeholder="Escribe una nota interna para este atleta..."
                  rows={3}
                />

                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="accent"
                    className="!min-h-0 h-8 !px-2 text-[10px] font-bold"
                    disabled={
                      estadoNota[atleta.clienteId] === "guardando"
                    }
                    onClick={() =>
                      guardarNotaPrivadaAtleta(
                        atleta.clienteId,
                        notasPrivadas[atleta.clienteId] ?? "",
                      )
                    }
                  >
                    {estadoNota[atleta.clienteId] === "guardando"
                      ? "Guardando..."
                      : "Guardar nota"}
                  </Button>

                  {estadoNota[atleta.clienteId] === "ok" && (
                    <span className="text-[10px] text-success font-medium">
                      ✓ Guardado
                    </span>
                  )}

                  {estadoNota[atleta.clienteId] === "error" && (
                    <span className="text-[10px] text-danger font-medium">
                      ✗ Error
                    </span>
                  )}

                  <Button
                    variant="secondary"
                    className="!min-h-0 h-8 !px-2 text-[10px] font-bold"
                    onClick={() => copiarInformeIndividual(atleta)}
                  >
                    {copiadoIndividual[atleta.clienteId]
                      ? "¡Copiado!"
                      : "Copiar informe"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
