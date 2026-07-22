import { Badge } from "../../../../shared/ui";


interface RegistroAsistencia {
  id: string;
  fecha: string;
  estado: "presente" | "falta";
}


interface HistorialAsistenciaProps {
  asistencias: RegistroAsistencia[];
}


function HistorialAsistencia({
  asistencias,
}: HistorialAsistenciaProps) {


  const asistenciasOrdenadas = [...asistencias].sort(
    (a, b) =>
      new Date(b.fecha).getTime() -
      new Date(a.fecha).getTime()
  );



  return (
    <div className="mt-8">


      <h3 className="font-semibold mb-4">
        Historial
      </h3>



      {asistenciasOrdenadas.length === 0 ? (

        <p className="text-muted">
          Sin registros este mes.
        </p>

      ) : (

        <div className="space-y-3">


          {asistenciasOrdenadas.map((registro) => {


            const fechaFormateada =
              new Date(
                registro.fecha + "T00:00:00"
              ).toLocaleDateString(
                "es-AR"
              );


            return (

              <div
                key={registro.id}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-border
                  bg-surface
                  px-4
                  py-3
                "
              >

                <span className="text-sm">
                  {fechaFormateada}
                </span>


                <Badge
                  variant={
                    registro.estado === "presente"
                      ? "success"
                      : "danger"
                  }
                >
                  {
                    registro.estado === "presente"
                      ? "Presente"
                      : "Falta"
                  }
                </Badge>


              </div>

            );

          })}


        </div>

      )}


    </div>
  );
}


export default HistorialAsistencia;