// src/components/seguimiento/PlanillaCard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegistroForm from "./RegistroForm";
import RendimientoTable from "./RendimientoTable";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

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

interface PlanillaCardProps {
  planillaId: string;
  nombre: string;
  onDeletePlanilla: (id: string) => void;
}

const PlanillaCard: React.FC<PlanillaCardProps> = ({ planillaId, nombre, onDeletePlanilla }) => {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState<Registro | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "planillas", planillaId, "registros"),
      (snapshot) => {
        setRegistros(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          })) as Registro[]
        );
      }
    );
    return () => unsub();
  }, [planillaId]);

  const agregarRegistro = async (data: any) => {
    try {
      await addDoc(collection(db, "planillas", planillaId, "registros"), {
        ...data,
        fechaRegistro: new Date(),
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error creando registro:", err);
      alert("Ocurrió un error al crear el registro.");
    }
  };

  const actualizarRegistro = async (data: any, registroId: string) => {
    try {
      const registroRef = doc(db, "planillas", planillaId, "registros", registroId);
      await updateDoc(registroRef, {
        ...data,
        fechaActualizacion: new Date(),
      });
      setEditingRegistro(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error actualizando registro:", err);
      alert("Ocurrió un error al actualizar el registro.");
    }
  };

  const eliminarRegistro = async (registroId: string) => {
    const confirm = window.confirm("¿Eliminar este registro?");
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, "planillas", planillaId, "registros", registroId));
    } catch (err) {
      console.error("Error eliminando registro:", err);
      alert("Ocurrió un error al eliminar el registro.");
    }
  };

  const actualizarBroncoTest = async (registroId: string, broncoId: string, nuevo: BroncoTest) => {
    try {
      const registroRef = doc(db, "planillas", planillaId, "registros", registroId);
      const snapshot = await getDoc(registroRef);
      if (!snapshot.exists()) {
        alert("Registro no encontrado.");
        return;
      }
      const data = snapshot.data() as any;
      const broncoTests: BroncoTest[] = Array.isArray(data.broncoTests) ? data.broncoTests : [];
      const nuevoArray = broncoTests.map((b) => (b.id === broncoId ? { ...b, ...nuevo } : b));
      await updateDoc(registroRef, { broncoTests: nuevoArray, fechaActualizacion: new Date() });
    } catch (err) {
      console.error("Error actualizando Bronco Test:", err);
      alert("Ocurrió un error al actualizar el Bronco Test.");
    }
  };

  const handleEdit = (registro: Registro) => {
    setEditingRegistro(registro);
    setShowForm(true);
  };

  const handleSaveFromForm = (data: any, registroId?: string) => {
    if (registroId) {
      return actualizarRegistro(data, registroId);
    } else {
      return agregarRegistro(data);
    }
  };

  const handleCancelForm = () => {
    setEditingRegistro(null);
    setShowForm(false);
  };

  return (
    <div className="card space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{nombre}</h2>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/planillas/${planillaId}`)} className="btn btn-primary">
            Ver planilla
          </button>
          <button
            onClick={() => onDeletePlanilla(planillaId)}
            className="btn btn-danger"
          >
            Eliminar planilla
          </button>
        </div>
      </div>

      {!showForm && (
        <button onClick={() => { setEditingRegistro(null); setShowForm(true); }} className="btn btn-secondary">
          Nuevo registro
        </button>
      )}

      {showForm && (
        <RegistroForm
          onSave={handleSaveFromForm}
          onCancel={handleCancelForm}
          initialData={editingRegistro ?? undefined}
        />
      )}

      <RendimientoTable
        registros={registros}
        onDelete={eliminarRegistro}
        onEdit={handleEdit}
        onUpdateBronco={actualizarBroncoTest}
      />
    </div>
  );
};

export default PlanillaCard;

