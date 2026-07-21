import { useState } from "react";

import { useAuth } from "../../../../auth/useAuth";

import BibliotecaLibros from "../components/BibliotecaLibros";
import BibliotecaPruebas from "../components/BibliotecaPruebas";

export default function BibliotecaPageV2() {

  const { user, usuario } = useAuth();

  const [tab, setTab] = useState<"libros" | "pruebas">("libros");

  if (!user || !usuario) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">

      <div className="flex gap-2">

        <button
          onClick={() => setTab("libros")}
          className={`px-4 py-2 rounded ${
            tab === "libros"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          📚 Libros
        </button>

        <button
          onClick={() => setTab("pruebas")}
          className={`px-4 py-2 rounded ${
            tab === "pruebas"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          🧪 Pruebas
        </button>

      </div>

      {tab === "libros" ? (
        <BibliotecaLibros preparadorId={user.uid} />
      ) : (
        <BibliotecaPruebas />
      )}

    </div>
  );
}