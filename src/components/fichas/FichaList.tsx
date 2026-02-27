

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
  className={`rounded-xl border p-4 transition shadow-lg cursor-pointer ${
    isSelected
      ? "border-highlight bg-highlight/30 backdrop-blur-md"
      : "border-white/20 bg-secondary/40 backdrop-blur-md"
  }`}
>
  <button
    className="w-full text-left text-white"
    type="button"
    onClick={() => handleSelect(ficha)}
  >
    <p className="font-semibold truncate">{ficha.nombre} {ficha.apellido}</p>
    <p className="text-sm text-gray-300">{ficha.posicion}</p>
    <p className="text-sm text-gray-400">
      {ficha.edad} años · {ficha.peso} kg · {ficha.altura} cm
    </p>
  </button>
</li>

          );
        })}
      </ul>

      {isModalOpen && selectedFicha && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">{selectedFicha.nombre} {selectedFicha.apellido}</h2>
          <p><strong>Posición:</strong> {selectedFicha.puesto}</p>
          <p  ><strong>Edad:</strong> {selectedFicha.edad} años</p>
          <p><strong>Peso:</strong> {selectedFicha.peso} kg</p>
          <p><strong>Altura:</strong> {selectedFicha.altura} cm</p>
          {/* Agrega más detalles según sea necesario */}

          {/* 👇 Botón para cerrar */}
    <button onClick={() => setIsModalOpen(false)}
      className="mt-4 bg-gray-500 text-white px-3 py-1 rounded"
    >
      Cerrar
    </button>
        </Modal>
      )}
    </>
  );
};

export default FichaList;
