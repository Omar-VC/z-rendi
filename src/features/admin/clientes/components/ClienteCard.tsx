import { useNavigate } from "react-router-dom";
import { useState } from "react";

import type { Cliente } from "../types";

import RegistrarAsistenciaButton from "../../asistencia/components/RegistrarAsistenciaButton";
import RegistrarAsistenciaModal from "../../asistencia/components/RegistrarAsistenciaModal";

import { useCuotasCliente } from "../../cuotas/hooks/useCuotasCliente";
import { useAsistencia } from "../../asistencia/hooks/useAsistencia";

import { Card, Button } from "../../../../shared/ui";


interface ClienteCardProps {
  cliente: Cliente;
}


function ClienteCard({ cliente }: ClienteCardProps) {

  const navigate = useNavigate();

  const { cuotas } =
    useCuotasCliente(cliente.id);


  const {
    porcentaje,
    cargando: cargandoAsistencia,
  } =
    useAsistencia(
      cliente.id,
      cliente.frecuenciaSemanal,
    );


  const ultimaCuota = cuotas[0];


  const [
    mostrandoAsistencia,
    setMostrandoAsistencia,
  ] = useState(false);



  return (

    <Card>

      <div className="space-y-5">


        {/* Header */}
        <div className="
          flex
          justify-between
          items-start
          gap-4
        ">


          <div>

            <h3 className="
              text-xl
              font-bold
              text-primary
            ">
              {cliente.nombre} {cliente.apellido}
            </h3>


            <span className="
              inline-flex
              mt-2
              px-3
              py-1
              rounded-full
              text-xs
              font-semibold
              bg-green-100
              text-green-700
            ">
              Activo
            </span>


          </div>




          <div className="
            flex
            gap-2
          ">


            <RegistrarAsistenciaButton
              onClick={() =>
                setMostrandoAsistencia(true)
              }
            />


            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/clientes/${cliente.id}`)
              }
            >
              Ver
            </Button>


          </div>


        </div>





        {/* Información */}
        <div className="
          border-t
          border-gray-100
          pt-4
          space-y-3
          text-sm
        ">


          <div className="flex justify-between">

            <span className="text-slate-500">
              Cuota
            </span>

            <span className="font-medium text-primary">

              {ultimaCuota
                ? `${ultimaCuota.mes} ${ultimaCuota.estado}`
                : "Sin cuota"
              }

            </span>

          </div>





          <div className="flex justify-between">

            <span className="text-slate-500">
              Asistencia
            </span>

            <span className="font-medium text-primary">

              {cargandoAsistencia
                ? "Cargando..."
                : `${porcentaje}%`
              }

            </span>

          </div>





          <div className="flex justify-between">

            <span className="text-slate-500">
              Seguimiento
            </span>

            <span className="font-medium text-slate-400">
              Sin información
            </span>

          </div>


        </div>



      </div>





      {mostrandoAsistencia && (

        <RegistrarAsistenciaModal
          cliente={cliente}
          onCerrar={() =>
            setMostrandoAsistencia(false)
          }
        />

      )}


    </Card>

  );
}


export default ClienteCard;