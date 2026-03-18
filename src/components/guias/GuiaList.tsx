import { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface Ejercicio {
  id: string;
  nombre: string;
  imagen: string;
}

const GuiaList = () => {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [selected, setSelected] = useState<Ejercicio | null>(null);
  const [user] = useAuthState(auth);
  const [role, setRole] = useState<string | null>(null);

  // Listener en tiempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "guias"), snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Ejercicio, "id">),
      }));
      setEjercicios(data);
    });

    return () => unsubscribe();
  }, []);

  // Obtener rol del usuario
  useEffect(() => {
    const getRole = async () => {
      if (user) {
        const token = await user.getIdTokenResult();
        const userRole = token.claims.role as string | undefined;
        setRole(userRole ?? "cliente");
      }
    };
    getRole();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "guias", id));
      // onSnapshot actualiza automáticamente
    } catch (error) {
      console.error("Error eliminando ejercicio:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {ejercicios.map(ej => (
        <div
          key={ej.id}
          className="border p-4 rounded shadow bg-white/10 flex flex-col items-center justify-between"
        >
          <h2
            onClick={() => setSelected(ej)}
            className="font-semibold text-white text-center cursor-pointer hover:text-highlight"
          >
            {ej.nombre}
          </h2>

          {/* Botón eliminar solo visible para admin */}
          {role === "admin" && (
            <button
              onClick={() => handleDelete(ej.id)}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Eliminar
            </button>
          )}
        </div>
      ))}

      {/* Modal con tamaño uniforme */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-secondary p-6 rounded-lg shadow-lg relative w-[90%] max-w-md h-[80%] flex flex-col">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-white mb-4 text-center">
              {selected.nombre}
            </h2>
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <img
                src={`/guias/${selected.imagen}`}
                alt={selected.nombre}
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuiaList;
