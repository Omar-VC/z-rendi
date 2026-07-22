import { useState } from "react";

import type { Cliente } from "../../clientes/types";
import type { EstadoAsistencia } from "../types/asistencia.types";

import { guardarAsistencia } from "../services/asistenciaService";

import {
  Modal,
  Input,
  Button,
} from "../../../../shared/ui";


interface RegistrarAsistenciaModalProps {
  cliente: Cliente;
  onCerrar: () => void;
  onGuardado?: () => void;
}


function RegistrarAsistenciaModal({
  cliente,
  onCerrar,
  onGuardado,
}: RegistrarAsistenciaModalProps) {


  const [fecha, setFecha] = useState(
    new Date().toISOString().split("T")[0]
  );


  const [estado, setEstado] =
    useState<EstadoAsistencia | null>(null);


  const [guardando, setGuardando] =
    useState(false);



  const handleGuardar = async () => {

    if (!estado) return;


    try {

      setGuardando(true);


      await guardarAsistencia(
        cliente.id,
        fecha,
        estado,
        cliente.frecuenciaSemanal ?? 0
      );


      onGuardado?.();

      onCerrar();


    } catch (error) {

      console.error(
        "Error al guardar asistencia:",
        error
      );

    } finally {

      setGuardando(false);

    }

  };



  return (

    <Modal
      title="Registrar asistencia"
      onClose={onCerrar}
    >


      <div className="space-y-5">


        <div>

          <p className="
            text-sm
            text-slate-500
          ">
            Atleta
          </p>


          <p className="
            font-semibold
            text-primary
          ">
            {cliente.nombre} {cliente.apellido}
          </p>

        </div>





        <div>

          <label className="
            block
            text-sm
            font-medium
            text-slate-600
            mb-1
          ">
            Fecha
          </label>


          <Input
            type="date"
            value={fecha}
            onChange={(e) =>
              setFecha(e.target.value)
            }
          />

        </div>





        <div>

          <label className="
            block
            text-sm
            font-medium
            text-slate-600
            mb-2
          ">
            Estado
          </label>


          <div className="
            flex
            gap-3
          ">


            <Button
              variant={
                estado === "presente"
                  ? "success"
                  : "secondary"
              }
              onClick={() =>
                setEstado("presente")
              }
            >
              Presente
            </Button>




            <Button
              variant={
                estado === "falta"
                  ? "danger"
                  : "secondary"
              }
              onClick={() =>
                setEstado("falta")
              }
            >
              Falta
            </Button>


          </div>

        </div>





        <div className="
          flex
          justify-end
          gap-3
          pt-3
        ">


          <Button
            variant="secondary"
            onClick={onCerrar}
            disabled={guardando}
          >
            Cancelar
          </Button>


          <Button
            variant="accent"
            onClick={handleGuardar}
            disabled={!estado || guardando}
          >
            {
              guardando
                ? "Guardando..."
                : "Guardar"
            }
          </Button>


        </div>


      </div>


    </Modal>

  );
}


export default RegistrarAsistenciaModal;