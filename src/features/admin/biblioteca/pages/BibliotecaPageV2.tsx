import { useState } from "react";

import { useAuth } from "../../../../auth/useAuth";

import BibliotecaLibros from "../tipo-sesion/components/BibliotecaLibros";
import BibliotecaPruebas from "../pruebas/components/BibliotecaPruebas";
import BibliotecaEjercicios from "../ejercicios/components/BibliotecaEjercicios";

import {
  Button,
  SectionTitle,
} from "../../../../shared/ui";

export default function BibliotecaPageV2() {
  const { user, usuario } = useAuth();

  const [tab, setTab] =
    useState<"libros" | "pruebas" | "ejercicios">("libros");

  if (!user || !usuario) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fadeIn">

      <SectionTitle
        title="Biblioteca"
        description="Gestioná tipos de sesión, pruebas físicas y ejercicios."
      />

      <div className="flex flex-wrap gap-3">

        <Button
          variant={tab === "libros" ? "accent" : "secondary"}
          onClick={() => setTab("libros")}
        >
          📚 Tipos de sesión
        </Button>

        <Button
          variant={tab === "pruebas" ? "accent" : "secondary"}
          onClick={() => setTab("pruebas")}
        >
          🧪 Pruebas
        </Button>

        <Button
          variant={tab === "ejercicios" ? "accent" : "secondary"}
          onClick={() => setTab("ejercicios")}
        >
          🏋️ Ejercicios
        </Button>

      </div>

      {tab === "libros" && (
        <BibliotecaLibros
          preparadorId={user.uid}
        />
      )}

      {tab === "pruebas" && (
        <BibliotecaPruebas />
      )}

      {tab === "ejercicios" && (
        <BibliotecaEjercicios
          preparadorId={user.uid}
        />
      )}

    </div>
  );
}