import Card from "../../../../shared/ui/Card";


export default function AsistenciaCard() {

  return (
    <Card>

      <h3 className="font-semibold text-primary">
        Asistencia
      </h3>


      <p className="mt-4 text-3xl font-bold text-primary">
        86%
      </p>


      <p className="text-sm text-slate-500">
        12 de 14 entrenamientos
      </p>


    </Card>
  );
}