import type { FichaCliente } from "../types";

interface FichaResumenProps {
  ficha: FichaCliente | null;
  onEditar: () => void;
}


function FichaResumen({
  ficha,
  onEditar,
}: FichaResumenProps) {


  if (!ficha) {
    return (
      <section className="p-6 rounded-xl border border-white/10">

        <h2 className="text-xl font-bold">
          Ficha
        </h2>

        <p className="mt-2 opacity-70">
          El cliente todavía no tiene ficha cargada.
        </p>


        <button
          onClick={onEditar}
          className="mt-4 px-4 py-2 rounded-lg"
        >
          Crear ficha
        </button>

      </section>
    );
  }


  return (
    <section className="p-6 rounded-xl border border-white/10">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold">
          Ficha
        </h2>


        <button
          onClick={onEditar}
          className="px-4 py-2 rounded-lg"
        >
          Editar
        </button>

      </div>


      <div className="space-y-6">


        <div>
          <h3 className="font-semibold mb-2">
            Datos personales
          </h3>

          <p>
            Nombre: {ficha.nombre ?? "-"} {ficha.apellido ?? ""}
          </p>

          <p>
            Edad: {ficha.edad ?? "-"} años
          </p>

          <p>
            Teléfono: {ficha.telefono || "-"}
          </p>
        </div>



        <div>
          <h3 className="font-semibold mb-2">
            Datos físicos
          </h3>

          <p>
            Peso: {ficha.peso ?? "-"} kg
          </p>

          <p>
            Altura: {ficha.altura ?? "-"} cm
          </p>
        </div>



        <div>
          <h3 className="font-semibold mb-2">
            Datos deportivos
          </h3>

          <p>
            Deporte: {ficha.deporte ?? "-"}
          </p>

          <p>
            Puesto: {ficha.puesto ?? "-"}
          </p>

          <p>
            Nivel: {ficha.nivel ?? "-"}
          </p>
        </div>



        <div>
          <h3 className="font-semibold mb-2">
            Salud
          </h3>

          <p>
            Lesiones: {ficha.lesiones ?? "-"}
          </p>
        </div>



        <div>
          <h3 className="font-semibold mb-2">
            Objetivos
          </h3>

          <p>
            {ficha.objetivoPrincipal ?? "-"}
          </p>
        </div>



        <div>
          <h3 className="font-semibold mb-2">
            Observaciones
          </h3>

          <p>
            {ficha.observaciones ?? "-"}
          </p>
        </div>


      </div>

    </section>
  );
}


export default FichaResumen;