type Props = {
  clienteId: string;
};

export default function ControlCargaCard({ clienteId }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-2">Control de carga</h3>

      <p className="text-gray-500 text-sm">
        Sin datos disponibles.
      </p>
    </div>
  );
}