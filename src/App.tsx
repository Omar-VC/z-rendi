import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import FichasPage from "./pages/FichasPage";
import SesionesPage from "./pages/SesionesPage";
import CuotasPage from "./pages/CuotasPage";

type Seccion = "dashboard" | "fichas" | "sesiones" | "cuotas";

function App() {
  const [seccionActiva, setSeccionActiva] = useState<Seccion>("dashboard");

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="text-3xl font-bold text-slate-900">Z-Rendi 🏋️‍♂️</h1>
          <p className="text-sm text-slate-600">Gestión de fichas, sesiones y cuotas</p>
        </div>
      </header>

      <nav className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap gap-2">
        {(["dashboard", "fichas", "sesiones", "cuotas"] as Seccion[]).map((seccion) => (
          <button
            key={seccion}
            onClick={() => setSeccionActiva(seccion)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              seccionActiva === seccion
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 border border-slate-300"
            }`}
          >
            {seccion[0].toUpperCase() + seccion.slice(1)}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-6xl px-4 pb-8">
        {seccionActiva === "dashboard" && <Dashboard />}
        {seccionActiva === "fichas" && <FichasPage />}
        {seccionActiva === "sesiones" && <SesionesPage />}
        {seccionActiva === "cuotas" && <CuotasPage />}
      </main>
    </div>
  );
}

export default App;
