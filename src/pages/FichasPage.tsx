import React from "react";
import FichaList from "../components/Fichas/FichaList";

const FichasPage: React.FC = () => {
  const fichas = [
    { id: "1", nombre: "Juan", apellido: "Pérez", edad: 20, peso: 75, altura: 180, posicion: "Delantero" },
    { id: "2", nombre: "María", apellido: "Gómez", edad: 22, peso: 65, altura: 170, posicion: "Mediocampo" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Fichas</h2>
      <FichaList fichas={fichas} />
    </div>
  );
};

export default FichasPage;
