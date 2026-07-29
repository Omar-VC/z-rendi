import { useAuth } from "../../../../auth/useAuth";
import { useFichaCliente } from "../../../admin/fichas/hooks/useFichaCliente";


export default function ClienteHeader() {

  const { user } = useAuth();

  const { ficha, loading } = useFichaCliente(user?.uid);


  if (loading) {
    return null;
  }


  return (
    <div className="space-y-5">


      <div>

        <div
          className="
            w-12
            h-1
            rounded-pill
            bg-accent
            mb-4
          "
        />


        <h1
          className="
            text-3xl
            font-bold
            text-text
          "
        >
          Hola {ficha?.nombre ?? "atleta"} 👋
        </h1>


        <p
          className="
            mt-2
            text-muted
          "
        >
          Tu evolución deportiva
        </p>

      </div>



      <div className="flex flex-wrap gap-2">


        {ficha?.deporte && (

          <span
            className="
              px-3
              py-1.5

              rounded-pill

              bg-brand-blue/40

              border
              border-brand-blue

              text-white

              text-sm
              font-semibold
            "
          >
            🏉 {ficha.deporte}
          </span>

        )}



        {ficha?.puesto && (

          <span
            className="
              px-3
              py-1.5

              rounded-pill

              bg-brand-blue/40

              border
              border-brand-blue

              text-white

              text-sm
              font-semibold
            "
          >
            {ficha.puesto}
          </span>

        )}



        {ficha?.edad && (

          <span
            className="
              px-3
              py-1.5

              rounded-pill

              bg-brand-blue/40

              border
              border-brand-blue

              text-white

              text-sm
              font-semibold
            "
          >
            {ficha.edad} años
          </span>

        )}

      </div>




      <div className="grid grid-cols-2 gap-3">


        <div
          className="
            rounded-card

            bg-surface

            border
            border-border

            p-4

            shadow-card
          "
        >

          <p className="text-xs text-muted">
            Peso
          </p>


          <p
            className="
              mt-1
              text-xl
              font-bold
              text-text
            "
          >
            {ficha?.peso ?? "-"} kg
          </p>

        </div>




        <div
          className="
            rounded-card

            bg-surface

            border
            border-border

            p-4

            shadow-card
          "
        >

          <p className="text-xs text-muted">
            Altura
          </p>


          <p
            className="
              mt-1
              text-xl
              font-bold
              text-text
            "
          >
            {ficha?.altura
              ? `${ficha.altura} cm`
              : "-"
            }
          </p>

        </div>


      </div>


    </div>
  );
}