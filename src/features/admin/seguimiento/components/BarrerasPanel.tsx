type Props = {
  clienteId: string;
};

export default function BarrerasPanel({ clienteId }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold">
        Barreras
      </h3>
    </div>
  );
}