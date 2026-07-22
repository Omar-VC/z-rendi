import { useState } from "react";

import { useAuth } from "../../../../auth/useAuth";

import { crearPrueba } from "../services/physicalTestsService";

import type {
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


export default function NuevaPruebaModal({
  onClose,
  onGuardado,
}: Props) {

  const { user } = useAuth();


  const [nombre, setNombre] =
    useState("");


  const [categoria, setCategoria] =
    useState<CategoriaPrueba>("Fuerza");


  const [subcategoria, setSubcategoria] =
    useState<SubcategoriaPrueba>("General");


  const [unidad, setUnidad] =
    useState("");



  async function guardar() {

    if (!user) return;

    if (!nombre.trim()) return;


    await crearPrueba({

      preparadorId: user.uid,

      nombre: nombre.trim(),

      categoria,

      subcategoria,

      unidad: unidad.trim(),

    });


    onGuardado();

  }



  return (

    <Modal
      title="Nueva prueba física"
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
            placeholder="Ej: Sprint 20 m"
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
            Unidad
          </label>


          <Input
            value={unidad}
            onChange={(e) =>
              setUnidad(e.target.value)
            }
            placeholder="Ej: kg, cm, seg"
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

            <option value="General">
              General
            </option>

            <option value="Superior">
              Superior
            </option>

            <option value="Inferior">
              Inferior
            </option>

          </Select>

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