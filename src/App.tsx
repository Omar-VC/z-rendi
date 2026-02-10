import React from "react";
import FichasPage from "./pages/FichasPage";
import SesionesPage from "./pages/SesionesPage";
import CuotasPage from "./pages/CuotasPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Z-Rendi</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded p-4 shadow bg-white">
          <FichasPage />
        </div>
        <div className="border rounded p-4 shadow bg-white">
          <SesionesPage />
        </div>
        <div className="border rounded p-4 shadow bg-white">
          <CuotasPage />
        </div>
      </div>
    </div>
  );
}

export default App;
