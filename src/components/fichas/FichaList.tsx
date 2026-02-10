import React from "react";

type Ficha = {
  id: string;
  nombre: string;
  apellido: string;
  edad: number;
  peso: number;
  altura: number;
  posicion: string;
  lesiones?: string;
};

const FichaList: React.FC<{ fichas: Ficha[] }> = ({ fichas }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Fichas de atletas</h2>
      <ul className="space-y-2">
        {fichas.map((ficha) => (
          <li key={ficha.id} className="border p-2 rounded shadow">
            <p>{ficha.nombre} {ficha.apellido}</p>
            <p>Edad: {ficha.edad} | Peso: {ficha.peso}kg | Altura: {ficha.altura}cm</p>
            <p>Posición: {ficha.posicion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FichaList;
