import { useState } from "react";

import {
  actualizarPrueba,
} from "../services/physicalTestsService";

import type {
  PhysicalTest,
  CategoriaPrueba,
  SubcategoriaPrueba,
} from "../types/physicalTest";

import {
  Modal,
  Input,
  Select,
  Button,
} from "../../../../shared/ui";


type Props = {
  prueba: PhysicalTest;
  onClose: () => void;
  onGuardado: () => void;
};


const categorias: CategoriaPrueba[] = [
  "Fuerza",
  "Potencia",
  "Velocidad",
  "Resistencia",
  "Movilidad",
];


const subcategorias: SubcategoriaPrueba[] = [
  "General",
  "Superior",
  "Inferior",
];


export default function EditarPruebaModal({
  prueba,
  onClose,
  onGuardado,
}: Props) {


  const [nombre, setNombre] =
    useState(prueba.nombre);


  const [categoria, setCategoria] =
    useState<CategoriaPrueba>(
      prueba.categoria
    );


  const [subcategoria, setSubcategoria] =
    useState<SubcategoriaPrueba>(
      prueba.subcategoria
    );


  const [unidad, setUnidad] =
    useState(prueba.unidad);



  async function guardar() {

    await actualizarPrueba(
      prueba.id,
      {
        nombre,
        categoria,
        subcategoria,
        unidad,
      }
    );


    onGuardado();

  }



  return (

    <Modal
      title="Editar prueba"
      onClose={onClose}
    >


      <div className="space-y-4">



        <div>

          <label className="
            block
            text-sm
            font-medium
            text-slate-600
            mb-1
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
            block
            text-sm
            font-medium
            text-slate-600
            mb-1
          ">
            Categoría
          </label>


          <Select
            value={categoria}
            onChange={(e) =>
              setCategoria(
                e.target.value as CategoriaPrueba
              )
            }
          >

            {categorias.map((cat) => (

              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>

            ))}

          </Select>

        </div>





        <div>

          <label className="
            block
            text-sm
            font-medium
            text-slate-600
            mb-1
          ">
            Subcategoría
          </label>


          <Select
            value={subcategoria}
            onChange={(e) =>
              setSubcategoria(
                e.target.value as SubcategoriaPrueba
              )
            }
          >

            {subcategorias.map((sub) => (

              <option
                key={sub}
                value={sub}
              >
                {sub}
              </option>

            ))}

          </Select>

        </div>





        <div>

          <label className="
            block
            text-sm
            font-medium
            text-slate-600
            mb-1
          ">
            Unidad
          </label>


          <Input
            value={unidad}
            onChange={(e) =>
              setUnidad(e.target.value)
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