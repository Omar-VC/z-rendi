import ClienteHeader from "../components/ClienteHeader";
import CuotaCard from "../components/CuotaCard";
import AsistenciaCard from "../components/AsistenciaCard";
import UltimaSesionCard from "../components/UltimaSesionCard";
import ObjetivosCard from "../components/ObjetivosCard";
import ProgresoCard from "../components/ProgresoCard";
import MiFichaCard from "../components/MiFichaCard";

export default function ClienteDashboard() {
  return (
    <div className="space-y-6">

      <ClienteHeader />

      <CuotaCard />

      <AsistenciaCard />

      <UltimaSesionCard />

      <ObjetivosCard />

      <ProgresoCard />

      <MiFichaCard />

    </div>
  );
}