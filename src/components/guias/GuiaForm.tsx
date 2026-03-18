import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

interface Props {
  onClose: () => void;
  onSave: () => void;
}

const GuiaForm: React.FC<Props> = ({ onClose, onSave }) => {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");

  const handleSubmit = async () => {
    await addDoc(collection(db, "guias"), { nombre, imagen });
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-secondary text-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4">Registrar ejercicio</h2>
        <input
          type="text"
          placeholder="Nombre del ejercicio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border p-2 mb-3 text-black bg-white rounded"
        />
        <input
          type="text"
          placeholder="Nombre de la imagen (ej: sentadilla.png)"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
          className="w-full border p-2 mb-3 text-black bg-white rounded"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-2 bg-accent text-white rounded"
          >
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuiaForm;
