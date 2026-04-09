// src/pages/PlanillaDetailPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import RegistroForm from "../components/seguimiento/RegistroForm";
import RendimientoTable from "../components/seguimiento/RendimientoTable";
import { exportElementToPdf } from "../utils/exportPdf";

interface BroncoTest {
  id: string;
  fecha?: string;
  tiempo?: string;
  tiempoSegundos?: number;
}

interface Registro {
  id?: string;
  nombre: string;
  apellido: string;
  edad?: number | null;
  altura?: number | null;
  peso?: number | null;
  fuerzaPress?: number | null;
  fuerzaSentadillas?: number | null;
  velocidadDistancia?: number | null;
  velocidadTiempo?: number | null;
  resistenciaAerobica?: string | null;
  resistenciaAnaerobica?: string | null;
  broncoTests?: BroncoTest[];
  fechaRegistro?: any;
}

const PlanillaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [planilla, setPlanilla] = useState<any>(null);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState<Registro | null>(null);
  const [exporting, setExporting] = useState(false);

  const printRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    const planillaRef = doc(db, "planillas", id);
    getDoc(planillaRef)
      .then((snap) => {
        if (snap.exists()) setPlanilla({ id: snap.id, ...(snap.data() as any) });
        else setPlanilla(null);
      })
      .catch((err) => {
        console.error("Error fetching planilla:", err);
      });

    const unsub = onSnapshot(
      collection(db, "planillas", id, "registros"),
      (snapshot) => {
        setRegistros(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          })) as Registro[]
        );
        setLoading(false);
      },
      (err) => {
        console.error("Error listening registros:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [id]);

  const agregarRegistro = async (data: any) => {
    if (!id) return;
    try {
      await addDoc(collection(db, "planillas", id, "registros"), {
        ...data,
        fechaRegistro: new Date(),
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error creando registro:", err);
      alert("Error al crear registro.");
    }
  };

  const actualizarRegistro = async (data: any, registroId: string) => {
    if (!id) return;
    try {
      const registroRef = doc(db, "planillas", id, "registros", registroId);
      await updateDoc(registroRef, { ...data, fechaActualizacion: new Date() });
      setEditingRegistro(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error actualizando registro:", err);
      alert("Error al actualizar registro.");
    }
  };

  const eliminarRegistro = async (registroId: string) => {
    if (!id) return;
    const confirm = window.confirm("¿Eliminar este registro?");
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, "planillas", id, "registros", registroId));
    } catch (err) {
      console.error("Error eliminando registro:", err);
      alert("Error al eliminar registro.");
    }
  };

  const eliminarPlanilla = async () => {
    if (!id) return;
    const confirm = window.confirm("¿Eliminar planilla y todos sus registros? Esta acción no se puede deshacer.");
    if (!confirm) return;
    try {
      const registrosSnap = await getDocs(collection(db, "planillas", id, "registros"));
      const promises: Promise<void>[] = [];
      registrosSnap.forEach((r) => {
        promises.push(deleteDoc(doc(db, "planillas", id, "registros", r.id)));
      });
      await Promise.all(promises);
      await deleteDoc(doc(db, "planillas", id));
      navigate("/seguimiento");
    } catch (err) {
      console.error("Error eliminando planilla:", err);
      alert("Error al eliminar planilla.");
    }
  };

  const handleEditRegistro = (registro: Registro) => {
    setEditingRegistro(registro);
    setShowForm(true);
  };

  const handleSaveFromForm = (data: any, registroId?: string) => {
    if (registroId) return actualizarRegistro(data, registroId);
    return agregarRegistro(data);
  };

  // Exportar PDF: captura el contenedor printRef
  const handleExportPdf = async () => {
    if (!printRef.current) {
      alert("No hay contenido para exportar.");
      return;
    }
    setExporting(true);
    try {
      // Opciones: scale mayor = mejor resolución, margin en mm
      await exportElementToPdf(printRef.current, planilla?.nombre ?? "planilla", {
        scale: 2,
        margin: 10,
        pageFormat: { widthMm: 210, heightMm: 297 }, // A4
      });
    } catch (err) {
      console.error("Error exportando PDF:", err);
      alert("Ocurrió un error al exportar el PDF. Revisa la consola.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Cargando planilla...</div>;
  }

  if (!planilla) {
    return <div className="p-6">Planilla no encontrada.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{planilla.nombre}</h1>
          {planilla.fechaCreacion && (
            <p className="text-sm text-slate-300">
              Creada:{" "}
              {new Date(
                planilla.fechaCreacion?.seconds ? planilla.fechaCreacion.seconds * 1000 : planilla.fechaCreacion
              ).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={() => { setEditingRegistro(null); setShowForm(true); }} className="btn btn-secondary">
            Nuevo registro
          </button>
          <button onClick={handleExportPdf} className="btn btn-primary" disabled={exporting}>
            {exporting ? "Exportando..." : "Exportar PDF"}
          </button>
          <button onClick={eliminarPlanilla} className="btn btn-danger">Eliminar planilla</button>
        </div>
      </div>

      {/* Contenedor que se captura para el PDF */}
      <div ref={printRef} className="bg-white text-black p-4 rounded shadow-sm">
        {/* Información de la planilla */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{planilla.nombre}</h2>
          <p className="text-sm text-slate-600">
            {planilla.descripcion ?? ""} {/* si tenés campo descripción */}
          </p>
        </div>

        {/* Formulario para crear/editar */}
        {showForm && (
          <div className="mb-6">
            <RegistroForm
              onSave={handleSaveFromForm}
              onCancel={() => { setShowForm(false); setEditingRegistro(null); }}
              initialData={editingRegistro ?? undefined}
            />
          </div>
        )}

        {/* Tabla de registros (RendimientoTable) */}
        <RendimientoTable
          registros={registros}
          onDelete={eliminarRegistro}
          onEdit={handleEditRegistro}
          onUpdateBronco={async (registroId, broncoId, nuevo) => {
            try {
              const registroRef = doc(db, "planillas", id, "registros", registroId);
              const snap = await getDoc(registroRef);
              if (!snap.exists()) {
                alert("Registro no encontrado.");
                return;
              }
              const data = snap.data() as any;
              const broncoTests: BroncoTest[] = Array.isArray(data.broncoTests) ? data.broncoTests : [];
              const nuevoArray = broncoTests.map((b) => (b.id === broncoId ? { ...b, ...nuevo } : b));
              await updateDoc(registroRef, { broncoTests: nuevoArray, fechaActualizacion: new Date() });
            } catch (err) {
              console.error("Error actualizando Bronco Test:", err);
              alert("Error al actualizar Bronco Test.");
            }
          }}
        />
      </div>
    </div>
  );
};

export default PlanillaDetailPage;

