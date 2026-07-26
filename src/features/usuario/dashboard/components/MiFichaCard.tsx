import Card from "../../../../shared/ui/Card";
import { useNavigate } from "react-router-dom";

export default function MiFichaCard() {
  const navigate = useNavigate();

  return (
    <Card>
      <div className="flex flex-col items-center text-center py-4">
        <div
          className="
            w-20
            h-20
            rounded-full
            bg-secondary
            flex
            items-center
            justify-center
            text-4xl
          "
        >
          👤
        </div>

        <h3 className="mt-4 text-xl font-bold text-primary">Mi ficha</h3>

        <p className="mt-2 text-sm text-slate-500">
          Consulta y actualiza tu información personal
        </p>

        <button
          onClick={() => navigate("/cliente/ficha")}
          className="
    mt-5
    px-5
    py-2
    rounded-xl
    bg-accent
    text-white
    font-semibold
  "
        >
          Ver mi ficha
        </button>
      </div>
    </Card>
  );
}
