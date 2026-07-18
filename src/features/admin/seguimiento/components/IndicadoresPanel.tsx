type Props = {
  clienteId: string;
};

export default function IndicadoresPanel({ clienteId }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold">
        Indicadores físicos
      </h3>
    </div>
  );
}