import { useState, useEffect } from "react";
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

  // Escuchar planillas en tiempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "planillas"), (snapshot) => {
      setPlanillas(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Planilla[]
      );
    });
    return () => unsub();
  }, []);

  // Crear nueva planilla en Firestore
  const crearPlanilla = async () => {
    if (!nombreNueva.trim()) return;
    await addDoc(collection(db, "planillas"), {
      nombre: nombreNueva,
      fechaCreacion: new Date(),
    });
    setNombreNueva("");
  };

  // Eliminar planilla y sus registros (limpieza manual de subcolección)
  const eliminarPlanilla = async (planillaId: string) => {
    const confirm = window.confirm(
      "¿Eliminar planilla y todos sus registros? Esta acción no se puede deshacer."
    );
    if (!confirm) return;

    try {
      // 1) Borrar todos los documentos en la subcolección "registros"
      const registrosSnap = await getDocs(
        collection(db, "planillas", planillaId, "registros")
      );
      const deletePromises: Promise<void>[] = [];
      registrosSnap.forEach((r) => {
        deletePromises.push(deleteDoc(doc(db, "planillas", planillaId, "registros", r.id)));
      });
      await Promise.all(deletePromises);

      // 2) Borrar el documento de la planilla
      await deleteDoc(doc(db, "planillas", planillaId));
    } catch (err) {
      console.error("Error eliminando planilla:", err);
      alert("Ocurrió un error al eliminar la planilla. Revisa la consola.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Seguimiento</h1>

      {/* Crear nueva planilla */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nombre de la planilla"
          value={nombreNueva}
          onChange={(e) => setNombreNueva(e.target.value)}
          className="input"
        />
        <button onClick={crearPlanilla} className="btn btn-primary">
          Crear planilla
        </button>
      </div>

      {/* Listado de planillas */}
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
