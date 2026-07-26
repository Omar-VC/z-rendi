import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";


export default function ObjetivosCard() {

  return (
    <Card>

      <div className="flex justify-between items-center mb-5">

        <h3 className="text-xl font-bold text-primary">
          Mis objetivos
        </h3>

        <Badge variant="info">
          En progreso
        </Badge>

      </div>


      <div className="space-y-5">


        <div>

          <p className="font-semibold text-primary">
            Press banca
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Meta: 100 kg
          </p>

        </div>



        <div>

          <p className="font-semibold text-primary">
            Velocidad 20 metros
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Meta: 3.10 segundos
          </p>

        </div>


      </div>


    </Card>
  );
}