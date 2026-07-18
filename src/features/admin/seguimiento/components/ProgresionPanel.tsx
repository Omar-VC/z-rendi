import BarrerasPanel from "./BarrerasPanel";
import IndicadoresPanel from "./IndicadoresPanel";

type Props = {
  clienteId: string;
};

export default function ProgresionPanel({ clienteId }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        Progresión
      </h2>

      <BarrerasPanel clienteId={clienteId} />

      <IndicadoresPanel clienteId={clienteId} />
    </div>
  );
}