import Card from "../../../../shared/ui/Card";
import { useAuth } from "../../../../auth/useAuth";
import { useAsistencia } from "../../../admin/asistencia/hooks/useAsistencia";


export default function AsistenciaCard() {

  const { user, usuario } = useAuth();


  const {
    porcentaje,
    presentes,
    cargando,
  } = useAsistencia(
    user?.uid,
    usuario?.frecuenciaSemanal
  );


  if (cargando) {
    return null;
  }


  return (
    <Card>

      <div className="flex justify-between items-center">

        <h3 className="font-semibold text-primary">
          Asistencia
        </h3>

        <span className="text-sm text-slate-500">
          Este mes
        </span>

      </div>



      <div className="mt-5">

        <p className="text-4xl font-bold text-accent">
          {porcentaje}%
        </p>


        <p className="mt-2 text-sm text-slate-500">
          {presentes} entrenamientos realizados
        </p>

      </div>


    </Card>
  );
}