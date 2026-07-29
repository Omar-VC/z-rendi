import Card from "../../../../shared/ui/Card";
import Button from "../../../../shared/ui/Button";

import { useNavigate } from "react-router-dom";


export default function MiFichaCard() {

  const navigate = useNavigate();


  return (
    <Card>

      <div
        className="
          flex
          flex-col
          items-center
          text-center
          py-4
        "
      >


        <div
          className="
            w-20
            h-20
            rounded-full
            bg-brandBlue
            flex
            items-center
            justify-center
            text-4xl
            shadow-card
          "
        >
          👤
        </div>




        <h3
          className="
            mt-4
            text-xl
            font-bold
            text-text
          "
        >
          Mi ficha
        </h3>




        <p
          className="
            mt-2
            text-sm
            text-muted
          "
        >
          Consulta y actualiza tu información personal
        </p>




        <Button
          variant="accent"
          className="mt-5 px-5"
          onClick={() => navigate("/cliente/ficha")}
        >
          Ver mi ficha
        </Button>


      </div>


    </Card>
  );
}