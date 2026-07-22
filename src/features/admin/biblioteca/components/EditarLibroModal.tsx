import { useState } from "react";

import type { TrainingBook } from "../types/trainingBook";

import { actualizarLibro } from "../services/trainingBooksService";

import {
  Modal,
  Input,
  Select,
  Textarea,
  Button,
} from "../../../../shared/ui";


type Props = {
  libro: TrainingBook;
  onClose: () => void;
  onGuardado: () => void;
};


export default function EditarLibroModal({
  libro,
  onClose,
  onGuardado,
}: Props) {


  const [nombre, setNombre] =
    useState(libro.nombre);


  const [categoria, setCategoria] =
    useState<TrainingBook["categoria"]>(
      libro.categoria
    );


  const [ejercicios, setEjercicios] =
    useState(
      libro.ejercicios.join("\n")
    );


  const [observaciones, setObservaciones] =
    useState(
      libro.observaciones || ""
    );



  async function guardar() {

    await actualizarLibro(libro.id, {

      nombre,

      categoria,

      ejercicios: ejercicios
        .split("\n")
        .map((e) => e.trim())
        .filter(Boolean),

      observaciones,

    });


    onGuardado();

  }



  return (

    <Modal
      title="Editar libro"
      onClose={onClose}
    >


      <div className="space-y-4">



        <div>

          <label className="
            text-sm
            font-medium
            text-slate-600
            mb-1
            block
          ">
            Nombre
          </label>


          <Input
            value={nombre}
            onChange={(e) =>
              setNombre(e.target.value)
            }
          />

        </div>





        <div>

          <label className="
            text-sm
            font-medium
            text-slate-600
            mb-1
            block
          ">
            Categoría
          </label>


          <Select
            value={categoria}
            onChange={(e) =>
              setCategoria(
                e.target.value as TrainingBook["categoria"]
              )
            }
          >

            <option value="Fuerza">
              Fuerza
            </option>

            <option value="Potencia">
              Potencia
            </option>

            <option value="Velocidad">
              Velocidad
            </option>

            <option value="Resistencia">
              Resistencia
            </option>

            <option value="Prevención">
              Prevención
            </option>

          </Select>

        </div>





        <div>

          <label className="
            text-sm
            font-medium
            text-slate-600
            mb-1
            block
          ">
            Ejercicios (uno por línea)
          </label>


          <Textarea
            value={ejercicios}
            rows={5}
            onChange={(e) =>
              setEjercicios(e.target.value)
            }
          />

        </div>





        <div>

          <label className="
            text-sm
            font-medium
            text-slate-600
            mb-1
            block
          ">
            Observaciones
          </label>


          <Textarea
            value={observaciones}
            onChange={(e) =>
              setObservaciones(e.target.value)
            }
          />

        </div>





        <div className="
          flex
          justify-end
          gap-3
          pt-3
        ">


          <Button
            variant="secondary"
            onClick={onClose}
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