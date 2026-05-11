import { useState } from "react";
import { auth } from "../firebase";
import NavbarCliente from "../components/NavbarCliente";
import SesionesClienteView from "../features/sesiones/components/SesionesClienteView";

const ClienteLayout = ({ clienteNombre }: { clienteNombre: string }) => {
  const [activeSection, setActiveSection] = useState("inicio");

  return (
    <div className="flex flex-col min-h-screen bg-primary text-white">
      {/* Header superior */}
      <header className="flex justify-between items-center bg-secondary p-4">
        <button
          onClick={() => auth.signOut()}
          className="btn btn-accent"
        >
          Salir
        </button>
        <span className="font-semibold">{clienteNombre}</span>
      </header>

      {/* Contenido central */}
      <main className="flex-1 flex items-center justify-center p-6">
        {activeSection === "inicio" && (
          <div className="text-center">
            <img
              src="/logo-zrendi.png"
              alt="Z-Rendi"
              className="mx-auto mb-6 w-40"
            />
            <h1 className="text-2xl font-bold">Bienvenido a Z-Rendi</h1>
          </div>
        )}

        {activeSection === "ficha" && (
          <div className="card w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Mi ficha</h2>
            {/* Aquí renderizamos FichaCliente */}
          </div>
        )}

        {activeSection === "cuotas" && (
          <div className="card w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Mis cuotas</h2>
            {/* Aquí renderizamos CuotasCliente */}
          </div>
        )}

        {activeSection === "sesiones" && (
          <div className="card w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Mis sesiones</h2>
            <SesionesClienteView clienteId={auth.currentUser?.uid || ""} />
          </div>
        )}
      </main>

      {/* Navbar fijo abajo */}
      <NavbarCliente onChangeSection={setActiveSection} />
    </div>
  );
};

export default ClienteLayout;
