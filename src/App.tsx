import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./auth/useAuth";

import LoginPage from "./auth/pages/LoginPage";

import AdminLayout from "./layouts/AdminLayout";
import ClienteLayoutV2 from "./layouts/ClienteLayoutV2";

import ClientesPageV2 from "./features/admin/clientes/pages/ClientesPageV2";
import ClienteDetailV2 from "./features/admin/clientes/pages/ClienteDetailV2";
import BibliotecaPageV2 from "./features/admin/biblioteca/pages/BibliotecaPageV2";


function App() {
  const { user, usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {user && usuario?.rol === "admin" && (
        <Route element={<AdminLayout />}>
          <Route path="/clientes" element={<ClientesPageV2 />} />

          <Route path="/clientes/:id" element={<ClienteDetailV2 />} />

          <Route path="/biblioteca" element={<BibliotecaPageV2 />} />
        </Route>
      )}

      {user && usuario?.rol === "cliente" && (
        <Route
          path="/cliente"
          element={
            <ClienteLayoutV2
              clienteNombre={`${usuario.nombre} ${usuario.apellido}`}
            />
          }
        />
      )}

      <Route
        path="*"
        element={
          <Navigate
            to={
              user
                ? usuario?.rol === "admin"
                  ? "/clientes"
                  : "/cliente"
                : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;
