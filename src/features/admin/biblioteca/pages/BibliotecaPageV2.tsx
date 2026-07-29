import { useState } from "react";

import { useAuth } from "../../../../auth/useAuth";

import BibliotecaLibros from "../components/BibliotecaLibros";
import BibliotecaPruebas from "../components/BibliotecaPruebas";

import {
  Button,
  SectionTitle,
} from "../../../../shared/ui";

export default function BibliotecaPageV2() {
  const { user, usuario } = useAuth();

  const [tab, setTab] = useState<"libros" | "pruebas">("libros");

  if (!user || !usuario) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fadeIn">

      <SectionTitle
        title="Biblioteca"
        description="Gestioná libros de entrenamiento y pruebas físicas."
      />

      <div className="flex flex-wrap gap-3">

        <Button
          variant={tab === "libros" ? "accent" : "secondary"}
          onClick={() => setTab("libros")}
        >
          📚 Libros
        </Button>

        <Button
          variant={tab === "pruebas" ? "accent" : "secondary"}
          onClick={() => setTab("pruebas")}
        >
          🧪 Pruebas
        </Button>

      </div>

      {tab === "libros" ? (
        <BibliotecaLibros preparadorId={user.uid} />
      ) : (
        <BibliotecaPruebas />
      )}

    </div>
  );
}