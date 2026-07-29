import Card from "../../../../shared/ui/Card";

import { useAuth } from "../../../../auth/useAuth";
import { useSeguimiento } from "../../../admin/seguimiento/hooks/useSeguimiento";
import { useLibroSesion } from "../hooks/useLibroSesion";


export default function UltimaSesionCard() {

  const { user, usuario } = useAuth();


  const {
    sesiones,
    loading: loadingSesion,
  } = useSeguimiento(user?.uid);


  const ultimaSesion = sesiones[0];


  const {
    libro,
    loading: loadingLibro,
  } = useLibroSesion(
    ultimaSesion?.libroId,
    usuario?.preparadorId,
  );


  if (loadingSesion || loadingLibro) {
    return null;
  }



  if (!ultimaSesion) {

    return (
      <Card>

        <h3
          className="
            text-xl
            font-bold
            text-text
          "
        >
          🏋 Último entrenamiento
        </h3>


        <p
          className="
            mt-4
            text-sm
            text-muted
          "
        >
          Todavía no hay sesiones registradas.
        </p>


      </Card>
    );

  }



  return (

    <Card>


      <h3
        className="
          text-xl
          font-bold
          text-text
        "
      >
        🏋 Último entrenamiento
      </h3>




      <p
        className="
          mt-5
          text-lg
          font-bold
          text-text
        "
      >
        {ultimaSesion.libroNombre}
      </p>



      <p
        className="
          mt-1
          text-sm
          text-muted
        "
      >
        {ultimaSesion.fecha.toLocaleDateString()}
      </p>





      {libro && (

        <div className="mt-5">


          <p
            className="
              text-xs
              uppercase
              tracking-wide
              text-muted
            "
          >
            Ejercicios
          </p>



          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-2
            "
          >

            {libro.ejercicios
              .slice(0,5)
              .map((ejercicio)=>(

              <span
                key={ejercicio}
                className="
                  px-3
                  py-1.5
                  rounded-pill
                  bg-surfaceSoft
                  border
                  border-border
                  text-sm
                  font-semibold
                  text-text
                "
              >
                {ejercicio}
              </span>

            ))}

          </div>


        </div>

      )}






      <div
        className="
          mt-6
          grid
          grid-cols-2
          gap-3
        "
      >


        <div
          className="
            rounded-card
            bg-surfaceSoft
            border
            border-border
            p-4
          "
        >

          <p
            className="
              text-xs
              text-muted
            "
          >
            Duración
          </p>


          <p
            className="
              mt-1
              text-xl
              font-bold
              text-text
            "
          >
            {ultimaSesion.duracion} min
          </p>


        </div>




        <div
          className="
            rounded-card
            bg-surfaceSoft
            border
            border-border
            p-4
          "
        >

          <p
            className="
              text-xs
              text-muted
            "
          >
            Carga
          </p>


          <p
            className="
              mt-1
              text-xl
              font-bold
              text-accent
            "
          >
            {ultimaSesion.carga}
          </p>


        </div>


      </div>



    </Card>

  );
}