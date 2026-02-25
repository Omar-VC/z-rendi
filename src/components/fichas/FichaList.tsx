
//Me gustaria que las fichas, se muestren en forma de tarjetas, con un diseño mas atractivo, y que al hacer click en una ficha, se muestre un modal con la informacion detallada de esa ficha.Para lograr esto, podemos utilizar un diseño de tarjetas para cada ficha y agregar un modal que se muestre al hacer clic en una ficha. Aquí te dejo una versión actualizada del componente `FichaList` con estas mejoras:

import { useState } from "react";
import Modal from "./modal";

type Ficha = {
  id: number;
  nombre: string;
  apellido: string;
  posicion: string;
  edad: number;
  peso: number;
  altura: number;
};

type Props = {
  fichas: Ficha[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};  


const FichaList = ({ fichas, selectedId, onSelect }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFicha, setSelectedFicha] = useState<Ficha | null>(null);

  const handleSelect = (ficha: Ficha) => {
    setSelectedFicha(ficha);
    setIsModalOpen(true);
    onSelect(ficha.id);
  };

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {fichas.map((ficha) => {
          const isSelected = ficha.id === selectedId;
          return (
            <li
              key={ficha.id}
              className={`rounded-lg border p-4 transition shadow-md ${
                isSelected ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"
              }`}
            >
              <button className="w-full text-left" type="button" onClick={() => handleSelect(ficha)}>
                <p className="font-semibold text-slate-900">{ficha.nombre} {ficha.apellido}</p>
                <p className="text-sm text-slate-600">{ficha.posicion}</p>
                <p className="text-sm text-slate-600">{ficha.edad} años · {ficha.peso} kg · {ficha.altura} cm</p>
              </button>
            </li>
          );
        })}
      </ul>

      {isModalOpen && selectedFicha && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">{selectedFicha.nombre} {selectedFicha.apellido}</h2>
          <p><strong>Posición:</strong> {selectedFicha.posicion}</p>
          <p  ><strong>Edad:</strong> {selectedFicha.edad} años</p>
          <p><strong>Peso:</strong> {selectedFicha.peso} kg</p>
          <p><strong>Altura:</strong> {selectedFicha.altura} cm</p>
          {/* Agrega más detalles según sea necesario */}
        </Modal>
      )}
    </>
  );
};

export default FichaList;
