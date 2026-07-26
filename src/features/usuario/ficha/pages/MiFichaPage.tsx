import Card from "../../../../shared/ui/Card";
import SectionTitle from "../../../../shared/ui/SectionTitle";


export default function MiFichaPage() {

  return (
    <div className="space-y-8">


      <SectionTitle
        title="Mi ficha"
        description="Información personal y deportiva"
      />



      <Card>

        <div className="space-y-4">


          <div>
            <p className="text-sm text-slate-500">
              Nombre
            </p>

            <p className="font-bold text-primary">
              Alex Romero
            </p>
          </div>



          <div>
            <p className="text-sm text-slate-500">
              Deporte
            </p>

            <p className="font-bold text-primary">
              Rugby
            </p>
          </div>



          <div>
            <p className="text-sm text-slate-500">
              Posición
            </p>

            <p className="font-bold text-primary">
              Forward
            </p>
          </div>



          <div>
            <p className="text-sm text-slate-500">
              Peso actual
            </p>

            <p className="font-bold text-primary">
              75 kg
            </p>
          </div>



          <div>
            <p className="text-sm text-slate-500">
              Altura
            </p>

            <p className="font-bold text-primary">
              1.75 m
            </p>
          </div>


        </div>


      </Card>


    </div>
  );
}