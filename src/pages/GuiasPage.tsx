import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import GuiaForm from "../components/guias/GuiaForm";
import GuiaList from "../components/guias/GuiaList";

const GuiasPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [user] = useAuthState(auth);

  // 🔹 Extraer el rol desde los claims del token
  const [role, setRole] = useState<string | null>(null);

  user?.getIdTokenResult().then(token => {
    const userRole = token.claims.role as string | undefined;
    setRole(userRole ?? "cliente");
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-white">Guías de Ejercicios</h1>

      {/* Solo admin ve el botón de registrar */}
      {role === "admin" && (
        <>
          <button
            onClick={() => setShowForm(true)}
            className="bg-accent text-white px-4 py-2 rounded hover:bg-highlight transition"
          >
            Registrar ejercicio
          </button>

          {showForm && (
            <GuiaForm
              onClose={() => setShowForm(false)}
              onSave={() => setShowForm(false)}
            />
          )}
        </>
      )}

      {/* Listado visible para todos */}
      <GuiaList />
    </div>
  );
};

export default GuiasPage;
