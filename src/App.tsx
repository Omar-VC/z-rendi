


//ten el cuenta el codigo de arriba, y abajo de este comentario quiero que me generes un codigo limpio y actualizado para que el navbar no se muestre en la pagina de login y registro, solo una vez el usuario haya iniciado sesión, y que el navbar tenga un diseño moderno y responsivo utilizando Tailwind CSS. Además, asegúrate de que el navbar tenga enlaces a las páginas principales según el rol del usuario (admin o cliente).

import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ClienteDashboard from "./pages/ClienteDashboard";
import { useEffect, useState } from "react";
import RegistroCliente from "./pages/RegistroCliente";
import ClientesPage from "./pages/ClientesPage";
import ClienteDetail from "./pages/ClienteDetail";
import Navbar from "./components/Navbar"; // 👈 Importamos la navbar

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
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

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

        {/* Mostrar Navbar solo si el usuario ha iniciado sesión */}
        {user && <Navbar role={role} />} {/* Pasamos el rol al Navbar */} 
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
              <Route path="/cliente-dashboard" element={<ClienteDashboard />} />
            )}
            {/* Redirecciones */}
            <Route
              path="*"
              element={
                <Navigate
                  to={user ? (role === "admin" ? "/home" : "/cliente-dashboard") : "/login"}
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

