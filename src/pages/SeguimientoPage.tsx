// src/pages/SeguimientoPage.tsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import PlanillaCard from "../components/seguimiento/PlanillaCard";

interface Planilla {
  id: string;
  nombre: string;
  fechaCreacion?: any;
}

const SeguimientoPage = () => {
  const [planillas, setPlanillas] = useState<Planilla[]>([]);
  const [nombreNueva, setNombreNueva] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const colRef = collection(db, "planillas");
    const unsub = onSnapshot(colRef, (snapshot) => {
      setPlanillas(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as Planilla[]
      );
    }, (err) => {
      console.error("onSnapshot error planillas:", err);
    });
    return () => unsub();
  }, []);

  const crearPlanilla = async () => {
    if (!nombreNueva.trim()) {
      alert("Ingresá un nombre para la planilla");
      return;
    }

    setLoading(true);
    try {
      console.log("Intentando crear planilla:", nombreNueva);
      const ref = await addDoc(collection(db, "planillas"), {
        nombre: nombreNueva.trim(),
        fechaCreacion: new Date(),
      });
      console.log("Planilla creada con id:", ref.id);
      setNombreNueva("");
    } catch (err) {
      console.error("Error creando planilla:", err);
      alert("Error al crear planilla. Revisa la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarPlanilla = async (planillaId: string) => {
    const confirmDelete = window.confirm(
      "¿Eliminar planilla y todos sus registros y atletas? Esta acción no se puede deshacer."
    );
    if (!confirmDelete) return;

    try {
      const registrosSnap = await getDocs(collection(db, "planillas", planillaId, "registros"));
      const deletePromises: Promise<void>[] = [];
      registrosSnap.forEach((r) => {
        deletePromises.push(deleteDoc(doc(db, "planillas", planillaId, "registros", r.id)));
      });

      const atletasSnap = await getDocs(collection(db, "planillas", planillaId, "atletas"));
      atletasSnap.forEach((a) => {
        deletePromises.push(deleteDoc(doc(db, "planillas", planillaId, "atletas", a.id)));
      });

      await Promise.all(deletePromises);
      await deleteDoc(doc(db, "planillas", planillaId));
    } catch (err) {
      console.error("Error eliminando planilla:", err);
      alert("Ocurrió un error al eliminar la planilla. Revisa la consola.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Seguimiento</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nombre de la planilla"
          value={nombreNueva}
          onChange={(e) => setNombreNueva(e.target.value)}
          className="input"
        />
        <button
          type="button"
          onClick={crearPlanilla}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear planilla"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {planillas.map((p) => (
          <PlanillaCard
            key={p.id}
            planillaId={p.id}
            nombre={p.nombre}
            onDeletePlanilla={eliminarPlanilla}
          />
        ))}
      </div>
    </div>
  );
};

export default SeguimientoPage;
