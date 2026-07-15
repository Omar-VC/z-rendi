interface ResumenAsistenciaProps {
  presentes: number;
  faltas: number;
  porcentaje: number;
  frecuenciaSemanal?: number;
}


function ResumenAsistencia({
  presentes,
  faltas,
  porcentaje,
  frecuenciaSemanal,
}: ResumenAsistenciaProps) {

  const fechaActual = new Date();

  const mes = fechaActual.toLocaleDateString(
    "es-AR",
    {
      month: "long",
      year: "numeric",
    }
  );


  return (
    <div className="mt-4 space-y-3">

      <p className="capitalize opacity-70">
        {mes}
      </p>


      <p>
        Frecuencia:
        <span className="ml-2 opacity-70">
          {frecuenciaSemanal ?? "-"} días/semana
        </span>
      </p>


      <p>
        Presentes:
        <span className="ml-2 opacity-70">
          {presentes}
        </span>
      </p>


      <p>
        Faltas:
        <span className="ml-2 opacity-70">
          {faltas}
        </span>
      </p>


      <p>
        Porcentaje:
        <span className="ml-2 opacity-70">
          {porcentaje}%
        </span>
      </p>

    </div>
  );
}


export default ResumenAsistencia;