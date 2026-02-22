import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
// Importar deleteDoc y doc para eliminar clientes desde firebase

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
}

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const navigate = useNavigate();

  //ten en cuenta el siguiente useffecth, para crear una funcion handleDeleteCliente que elimine un cliente de la base de datos y luego actualice el estado de clientes para reflejar el cambio en la interfaz de usuario. Para esto, necesitarás importar deleteDoc y doc desde firebase/firestore.

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "usuarios"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Cliente, "id">),
        }));
        setClientes(data);
      } catch (error) {
        console.error("Error cargando clientes:", error);
        setClientes([]);
      }
    };

    void fetchClientes();
  }, []);

  const handleDeleteCliente = async (id: string) => {
    try {
      await deleteDoc(doc(db, "usuarios", id));
      setClientes(clientes.filter((cliente) => cliente.id !== id));
    } catch (error) {
      console.error("Error eliminando cliente:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Clientes Registrados</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            onClick={() => navigate(`/clientes/${cliente.id}`)}
            className="cursor-pointer bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {cliente.nombre} {cliente.apellido}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCliente(cliente.id);
              }}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientesPage;
