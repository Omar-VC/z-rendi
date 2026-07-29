import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";

import { useAuth } from "../../../../auth/useAuth";
import { useBarreras } from "../../../admin/seguimiento/hooks/useBarreras";


export default function ObjetivosCard() {

  const { user } = useAuth();


  const {
    barreras,
    loading,
  } = useBarreras(user?.uid ?? "");



  if (loading) {
    return null;
  }



  const objetivosActivos = barreras.filter(
    (barrera) => barrera.estado !== "superada"
  );



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
          🎯 Objetivos actuales
        </h3>


        <Badge variant="info">
          {objetivosActivos.length}
        </Badge>


      </div>





      {objetivosActivos.length === 0 ? (

        <p
          className="
            mt-5
            text-sm
            text-muted
          "
        >
          No hay objetivos activos actualmente.
        </p>


      ) : (


        <div
          className="
            mt-6
            space-y-4
          "
        >


          {objetivosActivos
            .slice(0,3)
            .map((barrera)=>(


            <div
              key={barrera.id}
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
                  font-bold
                  text-text
                "
              >
                {barrera.nombre}
              </p>




              <p
                className="
                  mt-2
                  text-sm
                  text-muted
                "
              >
                Meta
              </p>




              <p
                className="
                  font-semibold
                  text-accent
                "
              >
                {barrera.objetivo}
              </p>




              <div className="mt-3">

                <Badge variant="warning">
                  En progreso
                </Badge>

              </div>


            </div>


          ))}


        </div>


      )}


    </Card>
  );
}