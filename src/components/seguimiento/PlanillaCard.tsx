import React, { useState, useEffect } from "react";
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
} from "firebase/firestore";

interface BroncoTest {
  id: string;
  fecha?: string;
  tiempo?: string;
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
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState<Registro | null>(null);

  // Escuchar registros en tiempo real
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "planillas", planillaId, "registros"),
      (snapshot) => {
        setRegistros(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Registro[]
        );
      }
    );
    return () => unsub();
  }, [planillaId]);

  // Guardar nuevo registro
  const agregarRegistro = async (data: any) => {
    await addDoc(collection(db, "planillas", planillaId, "registros"), {
      ...data,
      fechaRegistro: new Date(),
    });
    setShowForm(false);
  };

  // Actualizar registro existente
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

  // Eliminar registro
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

  // Abrir formulario en modo edición
  const handleEdit = (registro: Registro) => {
    setEditingRegistro(registro);
    setShowForm(true);
  };

  // Callback que recibe RegistroForm: decide crear o actualizar
  const handleSaveFromForm = (data: any, registroId?: string) => {
    if (registroId) {
      return actualizarRegistro(data, registroId);
    } else {
      return agregarRegistro(data);
    }
  };

  // Cancelar edición/creación
  const handleCancelForm = () => {
    setEditingRegistro(null);
    setShowForm(false);
  };

  return (
    <div className="card space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{nombre}</h2>
        <button
          onClick={() => onDeletePlanilla(planillaId)}
          className="btn btn-danger"
        >
          Eliminar planilla
        </button>
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
      />
    </div>
  );
};

export default PlanillaCard;
