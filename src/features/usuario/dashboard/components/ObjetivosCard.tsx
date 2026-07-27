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
    (barrera) => barrera.estado === "pendiente"
  );



  return (
    <Card>


      <div className="flex justify-between items-center mb-5">

        <h3 className="text-xl font-bold text-primary">
          Mis objetivos
        </h3>


        <Badge variant="info">

          {objetivosActivos.length > 0
            ? `${objetivosActivos.length} activos`
            : "Sin objetivos"}

        </Badge>

      </div>



      {objetivosActivos.length === 0 ? (

        <p className="text-sm text-slate-500">
          Todavía no tienes objetivos asignados.
        </p>

      ) : (


        <div className="space-y-5">


          {objetivosActivos
            .slice(0, 3)
            .map((objetivo) => (

              <div key={objetivo.id}>

                <p className="font-semibold text-primary">
                  {objetivo.nombre}
                </p>


                <p className="text-sm text-slate-500 mt-1">
                  Meta: {objetivo.objetivo}
                </p>


              </div>

          ))}


        </div>

      )}


    </Card>
  );
}