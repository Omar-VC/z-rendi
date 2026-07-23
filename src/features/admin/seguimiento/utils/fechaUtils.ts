export function obtenerInicioSemana(
  fecha: Date,
): Date {

  const inicio = new Date(fecha);

  const dia = inicio.getDay();

  const diferencia =
    dia === 0
      ? -6
      : 1 - dia;

  inicio.setDate(
    inicio.getDate() + diferencia
  );

  inicio.setHours(0, 0, 0, 0);

  return inicio;

}



export function obtenerFinSemana(
  fecha: Date,
): Date {

  const fin = obtenerInicioSemana(fecha);

  fin.setDate(
    fin.getDate() + 6
  );

  fin.setHours(
    23,
    59,
    59,
    999
  );

  return fin;

}



export function estaEnSemanaActual(
  fecha: Date,
): boolean {

  const hoy = new Date();

  const inicio =
    obtenerInicioSemana(hoy);

  const fin =
    obtenerFinSemana(hoy);

  return (
    fecha >= inicio &&
    fecha <= fin
  );

}



export function obtenerTextoSemanaActual(): string {

  const hoy = new Date();

  const inicio =
    obtenerInicioSemana(hoy);

  const fin =
    obtenerFinSemana(hoy);

  const formato = new Intl.DateTimeFormat(
    "es-AR",
    {
      day: "numeric",
      month: "short",
    }
  );

  return `${formato.format(inicio)} - ${formato.format(fin)}`;

}