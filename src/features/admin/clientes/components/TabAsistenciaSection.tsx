import ResumenAsistencia from "../../asistencia/components/ResumenAsistencia";
import HistorialAsistencia from "../../asistencia/components/HistorialAsistencia";

type Props = {
  cargando: boolean;
  presentes: number;
  faltas: number;
  porcentaje: number;
  frecuenciaSemanal?: number;
  asistencias: any[];
};

export default function TabAsistenciaSection({
  cargando,
  presentes,
  faltas,
  porcentaje,
  frecuenciaSemanal,
  asistencias,
}: Props) {
  if (cargando) {
    return (
      <p className="text-xs text-muted font-mono animate-pulse">
        [ Cargando métricas de asistencia... ]
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <ResumenAsistencia
        presentes={presentes}
        faltas={faltas}
        porcentaje={porcentaje}
        frecuenciaSemanal={frecuenciaSemanal}
      />
      <HistorialAsistencia asistencias={asistencias} />
    </div>
  );
}