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
    await updateDoc(doc(db, "usuarios", id), { estado: "aprobado" });
    setClientes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado: "aprobado" } : c)),
    );
  };

  const handleDeleteCliente = async (id: string) => {
    await deleteDoc(doc(db, "usuarios", id));
    setClientes((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <h2
        className="text-3xl font-bold mb-8 border-b pb-2"
        style={{ borderColor: "var(--border)" }}
      >
        Clientes Registrados
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            onClick={() => navigate(`/clientes/${cliente.id}`)}
            className="cursor-pointer rounded-xl p-6 border backdrop-blur-md shadow-lg transition hover:shadow-xl hover:scale-[1.02]"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <h3 className="text-xl font-semibold mb-2">
              {cliente.nombre} {cliente.apellido}
            </h3>

            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Estado: {cliente.estado || "pendiente"}
            </p>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCliente(cliente.id);
                }}
                className="btn btn-danger w-full"
              >
                Eliminar
              </button>

              {cliente.estado !== "aprobado" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproveCliente(cliente.id);
                  }}
                  className="btn btn-primary w-full"
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