import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ClienteDashboard from "./pages/ClienteDashboard";
import ClienteSesiones from "./pages/ClienteSesiones"; // 👈 nueva página
import { useEffect, useState } from "react";
import RegistroCliente from "./pages/RegistroCliente";
import ClientesPage from "./pages/ClientesPage";
import ClienteDetail from "./pages/ClienteDetail";
import Navbar from "./components/Navbar";
import NavbarCliente from "./components/NavbarCliente"; // 👈 import nuevo

function App() {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult(true);
        const userRole = idTokenResult.claims.role as string | undefined;
        setRole(userRole ?? "cliente");
        console.log("Claims:", idTokenResult.claims);
      } else {
        setRole(null);
      }
    };
    fetchUserRole();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-100">
        {/* Header común */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Z-Rendi 🏋️‍♂️</h1>
              <p className="text-sm text-slate-600">
                Gestión de fichas, sesiones y cuotas
              </p>
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

        {/* Navbar según rol */}
        {user && role === "admin" && <Navbar role={role} />}
        {user && role === "cliente" && <NavbarCliente />}

        <main className="mx-auto max-w-6xl px-4 pb-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro-cliente" element={<RegistroCliente />} />

            {/* Admin */}
            {user && role === "admin" && (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/clientes" element={<ClientesPage />} />
                <Route path="/clientes/:id" element={<ClienteDetail />} />
              </>
            )}

            {/* Cliente */}
            {user && role === "cliente" && (
              <>
                <Route
                  path="/cliente-dashboard"
                  element={<ClienteDashboard clienteId={user.uid} />}
                />
                <Route path="/mis-sesiones" element={<ClienteSesiones />} />
              </>
            )}

            {/* Redirecciones */}
            <Route
              path="*"
              element={
                <Navigate
                  to={
                    user
                      ? role === "admin"
                        ? "/home"
                        : "/cliente-dashboard"
                      : "/login"
                  }
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
