import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";


export default function CuotaCard() {

  return (
    <Card>

      <div className="flex justify-between items-center">

        <h3 className="font-semibold text-primary">
          Cuota
        </h3>


        <Badge variant="success">
          Pagada
        </Badge>

      </div>


      <p className="mt-4 text-sm text-slate-500">
        Próximo vencimiento
      </p>


      <p className="text-lg font-bold text-primary">
        05/08/2026
      </p>


    </Card>
  );
}