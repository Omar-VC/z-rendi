import Card from "../../../../shared/ui/Card";
import { useAuth } from "../../../../auth/useAuth";
import { useSeguimiento } from "../../../admin/seguimiento/hooks/useSeguimiento";


export default function UltimaSesionCard() {

  const { user } = useAuth();


  const {
    sesiones,
    loading,
  } = useSeguimiento(user?.uid);



  if (loading) {
    return null;
  }


  const ultimaSesion = sesiones[0];



  return (
    <Card>

      <h3 className="text-xl font-bold text-primary">
        Último entrenamiento
      </h3>



      <p className="mt-3 text-primary font-semibold">
        {ultimaSesion?.libroNombre ?? "Sin registros"}
      </p>



      {ultimaSesion?.ejercicios && (

        <div className="mt-4">

          <p className="text-sm text-slate-500">
            Ejercicios
          </p>


          <ul className="mt-2 space-y-1 text-sm text-primary">

            {ultimaSesion.ejercicios
              .slice(0, 4)
              .map((ejercicio) => (

                <li key={ejercicio}>
                  • {ejercicio}
                </li>

            ))}

          </ul>

        </div>

      )}



      <div className="mt-5 grid grid-cols-2 gap-4">


        <div>

          <p className="text-sm text-slate-500">
            Duración
          </p>


          <p className="font-bold text-primary">
            {ultimaSesion?.duracion ?? 0} min
          </p>

        </div>



        <div>

          <p className="text-sm text-slate-500">
            Carga
          </p>


          <p className="font-bold text-primary">
            {ultimaSesion?.carga ?? 0}
          </p>

        </div>


      </div>


    </Card>
  );
}