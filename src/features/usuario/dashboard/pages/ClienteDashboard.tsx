import SectionTitle from "../../../../shared/ui/SectionTitle";
import ClienteHeader from "../components/ClienteHeader";
import ObjetivosCard from "../components/ObjetivosCard";
import UltimaSesionCard from "../components/UltimaSesionCard";
import CuotaCard from "../components/CuotaCard";
import AsistenciaCard from "../components/AsistenciaCard";
import ProgresoCard from "../components/ProgresoCard";
import MiFichaCard from "../components/MiFichaCard";

export default function ClienteDashboard() {
  return (
    <div className="space-y-8">
      {/* Cabecera atleta */}
      <ClienteHeader />

      {/* Resumen rápido */}
      <div className="grid md:grid-cols-2 gap-5">
        <CuotaCard />

        <AsistenciaCard />
      </div>

      {/* Progreso */}
      <div>
        <SectionTitle title="Mi progreso" />

        <ProgresoCard />
      </div>

      {/* Objetivos */}
      <div>
        <SectionTitle title="Objetivos actuales" />

        <ObjetivosCard />
      </div>

      {/* Sesión */}
      <div>
        <SectionTitle title="Último entrenamiento" />

        <UltimaSesionCard />
      </div>
      {/* Ficha */}
      <div>
        <SectionTitle title="Mi información" />

        <MiFichaCard />
      </div>
    </div>
  );
}
