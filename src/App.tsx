import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Dashboard from "./pages/Dashboard";
import FichasPage from "./pages/FichasPage";
import SesionesPage from "./pages/SesionesPage";
import CuotasPage from "./pages/CuotasPage";
import LoginPage from "./pages/LoginPage";
import { useEffect, useState } from "react";

function App() {
  const [user] = useAuthState(auth);
  const [role, setRole] = useState<string | null>(null);

 useEffect(() => {
  const fetchUserRole = async () => {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      const userRole = idTokenResult.claims.role as string | undefined; 
      setRole(userRole ?? "cliente"); // 👈 siempre string o null
      console.log("Claims:", idTokenResult.claims);
    } else {
      setRole(null);
    }
  };
  fetchUserRole();
}, [user]);


  return (
    <Router>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Z-Rendi 🏋️‍♂️</h1>
              <p className="text-sm text-slate-600">Gestión de fichas, sesiones y cuotas</p>
            </div>
            {user && (
              <button
                onClick={() => auth.signOut()}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Salir
              </button>
            )}
          </div>
        </header>

        {/* Menú condicional según rol */}
        {user && role === "admin" && (
          <nav className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap gap-2">
            <Link to="/dashboard" className="rounded-full px-4 py-2 bg-white border">Dashboard</Link>
            <Link to="/fichas" className="rounded-full px-4 py-2 bg-white border">Fichas</Link>
            <Link to="/sesiones" className="rounded-full px-4 py-2 bg-white border">Sesiones</Link>
            <Link to="/cuotas" className="rounded-full px-4 py-2 bg-white border">Cuotas</Link>
          </nav>
        )}

        {user && role === "cliente" && (
          <nav className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap gap-2">
            <Link to="/sesiones" className="rounded-full px-4 py-2 bg-white border">Mis Sesiones</Link>
            <Link to="/cuotas" className="rounded-full px-4 py-2 bg-white border">Mis Cuotas</Link>
          </nav>
        )}

        <main className="mx-auto max-w-6xl px-4 pb-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            {user && role === "admin" && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/fichas" element={<FichasPage />} />
                <Route path="/sesiones" element={<SesionesPage />} />
                <Route path="/cuotas" element={<CuotasPage />} />
              </>
            )}
            {user && role === "cliente" && (
              <>
                <Route path="/sesiones" element={<SesionesPage />} />
                <Route path="/cuotas" element={<CuotasPage />} />
              </>
            )}
            <Route path="*" element={<Navigate to={user ? (role === "admin" ? "/dashboard" : "/sesiones") : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
