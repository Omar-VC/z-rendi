import type { SesionEntrenamiento } from "../types/seguimiento";

type Props = {
  sesion?: SesionEntrenamiento;
};

export default function UltimaSesionCard({ sesion }: Props) {

  if (!sesion) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg mb-2">
          Última sesión
        </h3>

        <p className="text-gray-500">
          Aún no hay sesiones registradas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-grisSemiOscuro rounded-lg shadow p-4 space-y-2">

      <h3 className="font-semibold text-lg">
        Última sesión
      </h3>

      <p className="font-semibold">
        {sesion.libroNombre}
      </p>

      <p>
        {sesion.fecha.toLocaleDateString()}
      </p>

      <p>
        {sesion.duracion} minutos • RPE {sesion.rpe}
      </p>

      <p>
        Carga: {sesion.carga}
      </p>

      {sesion.observaciones && (
        <p className="text-sm text-gray-600">
          {sesion.observaciones}
        </p>
      )}

    </div>
  );
}