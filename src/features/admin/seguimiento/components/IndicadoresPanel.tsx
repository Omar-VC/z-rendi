import { useBarreras } from "../hooks/useBarreras";

type Props = {
  clienteId: string;
};

export default function IndicadoresPanel({
  clienteId,
}: Props) {
  const { barreras, loading } = useBarreras(clienteId);

  function obtenerIndicador(categoria: string) {
    return barreras.find(
      (b) =>
        b.categoria === categoria &&
        b.estado === "superada"
    );
  }

  const indicadores = [
    {
      titulo: "💪 Fuerza superior",
      categoria: "Fuerza",
    },
    {
      titulo: "🦵 Fuerza inferior",
      categoria: "Fuerza Inferior",
    },
    {
      titulo: "⚡ Velocidad",
      categoria: "Velocidad",
    },
    {
      titulo: "🏃 Resistencia",
      categoria: "Resistencia",
    },
    {
      titulo: "🦘 Potencia",
      categoria: "Potencia",
    },
  ];

  if (loading) {
    return (
      <div className="bg-grisSemiOscuro rounded-lg shadow p-4">
        Cargando indicadores...
      </div>
    );
  }

  return (
    <div className="bg-grisSemiOscuro rounded-lg shadow p-4">
      <h3 className="font-semibold mb-4">
        Indicadores físicos
      </h3>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {indicadores.map((item) => {
          const indicador = obtenerIndicador(item.categoria);

          return (
            <div
              key={item.titulo}
              className="border rounded-lg p-3"
            >
              <div className="font-medium mb-2">
                {item.titulo}
              </div>

              {indicador ? (
                <>
                  <div>{indicador.nombre}</div>

                  <div className="text-lg font-bold">
                    {indicador.resultado} {indicador.unidad}
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">
                  Sin indicador registrado
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}