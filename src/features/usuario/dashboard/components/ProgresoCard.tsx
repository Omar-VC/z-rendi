import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";

import { useAuth } from "../../../../auth/useAuth";
import { useBarreras } from "../../../admin/seguimiento/hooks/useBarreras";


export default function ProgresoCard() {

  const { user } = useAuth();


  const {
    barreras,
    loading,
  } = useBarreras(user?.uid ?? "");



  if (loading) {
    return null;
  }



  const conHistorial = barreras.filter(
    (barrera) =>
      barrera.historial &&
      barrera.historial.length > 0
  );



  return (
    <Card>


      <div
        className="
          flex
          justify-between
          items-center
          mb-5
        "
      >

        <h3
          className="
            text-xl
            font-bold
            text-text
          "
        >
          📈 Mi progreso
        </h3>


        <Badge variant="info">
          {conHistorial.length} pruebas
        </Badge>


      </div>





      {conHistorial.length === 0 ? (

        <p
          className="
            text-sm
            text-muted
          "
        >
          Todavía no hay registros de progreso.
        </p>


      ) : (


        <div className="space-y-5">


          {conHistorial
            .slice(0,3)
            .map((barrera)=>{


            const historial = barrera.historial!;


            const primero = historial[0];

            const ultimo =
              historial[historial.length - 1];



            return (

              <div
                key={barrera.id}
                className="
                  border-b
                  border-border/50
                  pb-4
                  last:border-none
                  last:pb-0
                "
              >


                <p
                  className="
                    font-semibold
                    text-text
                  "
                >
                  {barrera.nombre}
                </p>




                {historial.length > 1 ? (

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      mt-3
                    "
                  >

                    <span
                      className="
                        font-bold
                        text-text
                      "
                    >
                      {primero.resultado}
                    </span>



                    <span
                      className="
                        text-accent
                        text-xl
                        font-bold
                      "
                    >
                      →
                    </span>




                    <span
                      className="
                        font-bold
                        text-accent
                      "
                    >
                      {ultimo.resultado}
                    </span>


                  </div>


                ) : (


                  <p
                    className="
                      mt-3
                      font-bold
                      text-accent
                    "
                  >
                    {ultimo.resultado}
                  </p>


                )}



              </div>

            );


          })}



        </div>

      )}


    </Card>
  );
}