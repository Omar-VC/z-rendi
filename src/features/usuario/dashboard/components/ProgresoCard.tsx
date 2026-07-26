import Card from "../../../../shared/ui/Card";


export default function ProgresoCard() {

  return (
    <Card>

      <p className="text-sm text-slate-500">
        Última mejora
      </p>


      <h3 className="text-xl font-bold text-primary mt-2">
        Sentadilla
      </h3>


      <div className="mt-5 flex items-center gap-4">

        <div>
          <p className="text-sm text-slate-500">
            Anterior
          </p>

          <p className="text-lg font-bold text-primary">
            120 kg
          </p>
        </div>


        <span className="text-2xl text-accent">
          →
        </span>


        <div>
          <p className="text-sm text-slate-500">
            Actual
          </p>

          <p className="text-lg font-bold text-primary">
            130 kg
          </p>
        </div>

      </div>


      <p className="mt-5 text-sm font-semibold text-green-600">
        +10 kg de progreso
      </p>


    </Card>
  );
}