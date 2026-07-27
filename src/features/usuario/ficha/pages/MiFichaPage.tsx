import Card from "../../../../shared/ui/Card";
import SectionTitle from "../../../../shared/ui/SectionTitle";
import { useAuth } from "../../../../auth/useAuth";
import { useFichaCliente } from "../../../admin/fichas/hooks/useFichaCliente";

export default function MiFichaPage() {
  const { user } = useAuth();

  const { ficha, loading, error } = useFichaCliente(user?.uid);

  if (loading) {
    return <p>Cargando ficha...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!ficha) {
    return <p>No existe una ficha para este atleta.</p>;
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Mi ficha"
        description="Información personal y deportiva"
      />

      <Card>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">Nombre</p>

            <p className="font-bold text-primary">{ficha.nombre} {ficha.apellido}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Deporte</p>

            <p className="font-bold text-primary">{ficha.deporte || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Posición</p>

            <p className="font-bold text-primary">{ficha.puesto || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Peso actual</p>

            <p className="font-bold text-primary">{ficha.peso} kg</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Altura</p>

            <p className="font-bold text-primary">{ficha.altura} cm</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
