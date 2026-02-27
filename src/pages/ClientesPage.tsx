import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
}

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-primary/90 backdrop-blur-sm p-6 text-white">
      <h2 className="text-3xl font-bold mb-8 border-b border-white/20 pb-2">
        Clientes Registrados
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            onClick={() => navigate(`/clientes/${cliente.id}`)}
            className="cursor-pointer bg-secondary/40 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-6 hover:shadow-xl hover:bg-secondary/60 transition"
          >
            <h3 className="text-xl font-semibold mb-2">
              {cliente.nombre} {cliente.apellido}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCliente(cliente.id);
              }}
              className="btn bg-accent/80 hover:bg-highlight/70 mt-4 w-full"
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
