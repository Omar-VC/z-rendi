import type { FichaCliente } from "../types";
import {
  Card,
  Button,
  SectionTitle,
} from "../../../../shared/ui";

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
  <Card>

    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

      <SectionTitle
        title="Ficha"
        description="Información general del atleta."
      />

      <Button
        variant="secondary"
        onClick={onEditar}
      >
        Editar
      </Button>

    </div>

    <div className="grid gap-5 md:grid-cols-2 mt-6">

      {/* Datos personales */}

      <div className="rounded-xl border border-border bg-surface p-5">

        <h3 className="font-semibold mb-4">
          Datos personales
        </h3>

        <div className="space-y-2 text-sm">

          <p><strong>Nombre:</strong> {ficha.nombre ?? "-"} {ficha.apellido ?? ""}</p>

          <p><strong>Edad:</strong> {ficha.edad ?? "-"} años</p>

          <p><strong>Teléfono:</strong> {ficha.telefono || "-"}</p>

        </div>

      </div>

      {/* Datos físicos */}

      <div className="rounded-xl border border-border bg-surface p-5">

        <h3 className="font-semibold mb-4">
          Datos físicos
        </h3>

        <div className="space-y-2 text-sm">

          <p><strong>Peso:</strong> {ficha.peso ?? "-"} kg</p>

          <p><strong>Altura:</strong> {ficha.altura ?? "-"} cm</p>

        </div>

      </div>

      {/* Datos deportivos */}

      <div className="rounded-xl border border-border bg-surface p-5">

        <h3 className="font-semibold mb-4">
          Datos deportivos
        </h3>

        <div className="space-y-2 text-sm">

          <p><strong>Deporte:</strong> {ficha.deporte ?? "-"}</p>

          <p><strong>Puesto:</strong> {ficha.puesto ?? "-"}</p>

          <p><strong>Nivel:</strong> {ficha.nivel ?? "-"}</p>

        </div>

      </div>

      {/* Salud */}

      <div className="rounded-xl border border-border bg-surface p-5">

        <h3 className="font-semibold mb-4">
          Salud
        </h3>

        <p className="text-sm">
          {ficha.lesiones ?? "-"}
        </p>

      </div>

      {/* Objetivos */}

      <div className="rounded-xl border border-border bg-surface p-5">

        <h3 className="font-semibold mb-4">
          Objetivos
        </h3>

        <p className="text-sm">
          {ficha.objetivoPrincipal ?? "-"}
        </p>

      </div>

      {/* Observaciones */}

      <div className="rounded-xl border border-border bg-surface p-5">

        <h3 className="font-semibold mb-4">
          Observaciones
        </h3>

        <p className="text-sm">
          {ficha.observaciones ?? "-"}
        </p>

      </div>

    </div>

  </Card>
);
}


export default FichaResumen;