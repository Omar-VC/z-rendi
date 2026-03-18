import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  estado?: string;
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

  const handleApproveCliente = async (id: string) => {
    try {
      await updateDoc(doc(db, "usuarios", id), { estado: "aprobado" });
      setClientes(
        clientes.map((c) => (c.id === id ? { ...c, estado: "aprobado" } : c)),
      );
    } catch (error) {
      console.error("Error aprobando cliente:", error);
    }
  };

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
            <p className="text-sm mb-2">
              Estado: {cliente.estado || "pendiente"}
            </p>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCliente(cliente.id);
                }}
                className="btn bg-accent/80 hover:bg-highlight/70 w-full"
              >
                Eliminar
              </button>

              {cliente.estado !== "aprobado" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproveCliente(cliente.id);
                  }}
                  className="btn bg-green-600 hover:bg-green-500 w-full"
                >
                  Aceptar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientesPage;
