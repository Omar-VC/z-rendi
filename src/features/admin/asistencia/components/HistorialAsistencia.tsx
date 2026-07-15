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
    <div className="mt-6">

      <h3 className="font-semibold mb-3">
        Historial
      </h3>


      {asistenciasOrdenadas.length === 0 ? (

        <p className="opacity-70">
          Sin registros este mes.
        </p>

      ) : (

        <div className="space-y-2">

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
                className="flex justify-between p-3 rounded-lg border border-white/10"
              >

                <span>
                  {fechaFormateada}
                </span>


                <span>
                  {registro.estado === "presente"
                    ? "Presente"
                    : "Falta"}
                </span>

              </div>
            );

          })}

        </div>

      )}

    </div>
  );
}


export default HistorialAsistencia;