import Card from "../../../../shared/ui/Card";


export default function UltimaSesionCard() {

  return (
    <Card>

      <h3 className="text-xl font-bold text-primary">
        Último entrenamiento
      </h3>


      <p className="mt-3 text-primary font-semibold">
        Fuerza tren inferior
      </p>


      <div className="mt-4 grid grid-cols-2 gap-4">


        <div>

          <p className="text-sm text-slate-500">
            Duración
          </p>

          <p className="font-bold text-primary">
            70 min
          </p>

        </div>



        <div>

          <p className="text-sm text-slate-500">
            Carga
          </p>

          <p className="font-bold text-primary">
            420
          </p>

        </div>


      </div>


    </Card>
  );
}