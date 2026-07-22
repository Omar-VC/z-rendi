import { useState } from "react";

import type { TrainingBook } from "../types/trainingBook";

import {
  Modal,
  Input,
  Select,
  Textarea,
  Button,
} from "../../../../shared/ui";


interface Props {
  abierto: boolean;
  cerrar: () => void;
  agregarLibro: (
    libro: Omit<TrainingBook, "id">
  ) => Promise<void>;
  preparadorId: string;
}


export default function NuevoLibroModal({
  abierto,
  cerrar,
  agregarLibro,
  preparadorId,
}: Props) {

  const [nombre, setNombre] = useState("");

  const [categoria, setCategoria] =
    useState<TrainingBook["categoria"]>("Fuerza");

  const [ejercicio, setEjercicio] = useState("");

  const [ejercicios, setEjercicios] =
    useState<string[]>([]);

  const [observaciones, setObservaciones] =
    useState("");



  if (!abierto) return null;



  async function guardar() {

    if (!nombre.trim()) return;

    await agregarLibro({
      preparadorId,
      nombre,
      categoria,
      ejercicios,
      observaciones,
    });

    cerrar();

    setNombre("");
    setEjercicios([]);
    setObservaciones("");
  }



  function agregarEjercicio() {

    if (!ejercicio.trim()) return;

    setEjercicios([
      ...ejercicios,
      ejercicio,
    ]);

    setEjercicio("");
  }



  return (

    <Modal
      title="Nuevo libro"
      onClose={cerrar}
    >


      <div className="space-y-4">


        <Input
          placeholder="Nombre del libro"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
        />



        <Select
          value={categoria}
          onChange={(e) =>
            setCategoria(
              e.target.value as TrainingBook["categoria"]
            )
          }
        >

          <option>Fuerza</option>
          <option>Potencia</option>
          <option>Velocidad</option>
          <option>Resistencia</option>
          <option>Prevención</option>

        </Select>




        <div className="flex gap-2">

          <Input
            placeholder="Ejercicio"
            value={ejercicio}
            onChange={(e) =>
              setEjercicio(e.target.value)
            }
          />


          <Button
            variant="accent"
            onClick={agregarEjercicio}
          >
            +
          </Button>

        </div>




        <div className="
          rounded-xl
          bg-slate-50
          p-3
        ">

          <ul className="
            text-sm
            text-slate-600
            space-y-1
          ">

            {ejercicios.map((e, index) => (
              <li key={index}>
                • {e}
              </li>
            ))}

          </ul>

        </div>





        <Textarea
          placeholder="Observaciones"
          value={observaciones}
          onChange={(e) =>
            setObservaciones(e.target.value)
          }
        />




        <div className="
          flex
          justify-end
          gap-3
          pt-3
        ">

          <Button
            variant="secondary"
            onClick={cerrar}
          >
            Cancelar
          </Button>


          <Button
            variant="accent"
            onClick={guardar}
          >
            Guardar
          </Button>


        </div>


      </div>


    </Modal>

  );
}