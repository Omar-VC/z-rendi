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


      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <h3
          className="
            text-xl
            font-bold
            text-text
          "
        >
          📅 Asistencia
        </h3>


        <span
          className="
            text-sm
            text-muted
          "
        >
          Este mes
        </span>


      </div>




      <div className="mt-6">


        <p
          className="
            text-5xl
            font-bold
            text-accent
          "
        >
          {porcentaje}%
        </p>



        <p
          className="
            mt-2
            text-sm
            text-muted
          "
        >
          {presentes} entrenamientos realizados
        </p>




        <div
          className="
            mt-5
            h-3
            rounded-pill
            bg-surfaceSoft
            overflow-hidden
          "
        >

          <div
            className="
              h-full
              rounded-pill
              bg-accent
              transition-all
            "
            style={{
              width: `${Math.min(porcentaje,100)}%`,
            }}
          />

        </div>


      </div>




      <p
        className="
          mt-4
          text-sm
          font-medium
          text-text
        "
      >

        {
          porcentaje >= 90
            ? "Excelente constancia 💪"
            : porcentaje >= 70
            ? "Buen ritmo de entrenamiento"
            : "Seguí trabajando tu constancia"
        }

      </p>


    </Card>
  );
}