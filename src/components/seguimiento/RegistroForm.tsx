import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface BroncoTest {
  id: string;
  fecha: string;
  tiempo: string;
}

interface RegistroFormProps {
  onSave: (data: any, id?: string) => void;
  onCancel: () => void;
  initialData?: any; // si viene, estamos editando
}

const RegistroForm: React.FC<RegistroFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    altura: "",
    peso: "",
    fuerzaPress: "",
    fuerzaSentadillas: "",
    velocidadDistancia: "",
    velocidadTiempo: "",
    resistenciaAerobica: "",
    resistenciaAnaerobica: "",
  });

  const [broncoFecha, setBroncoFecha] = useState("");
  const [broncoTiempo, setBroncoTiempo] = useState("");
  const [broncoTests, setBroncoTests] = useState<BroncoTest[]>([]);

  // Si initialData existe, precargar el formulario
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre ?? "",
        apellido: initialData.apellido ?? "",
        edad: initialData.edad ? String(initialData.edad) : "",
        altura: initialData.altura ? String(initialData.altura) : "",
        peso: initialData.peso ? String(initialData.peso) : "",
        fuerzaPress: initialData.fuerzaPress ? String(initialData.fuerzaPress) : "",
        fuerzaSentadillas: initialData.fuerzaSentadillas ? String(initialData.fuerzaSentadillas) : "",
        velocidadDistancia: initialData.velocidadDistancia ? String(initialData.velocidadDistancia) : "",
        velocidadTiempo: initialData.velocidadTiempo ? String(initialData.velocidadTiempo) : "",
        resistenciaAerobica: initialData.resistenciaAerobica ?? "",
        resistenciaAnaerobica: initialData.resistenciaAnaerobica ?? "",
      });

      setBroncoTests(
        Array.isArray(initialData.broncoTests)
          ? initialData.broncoTests.map((b: any) => ({ id: b.id ?? uuidv4(), fecha: b.fecha, tiempo: b.tiempo }))
          : []
      );
    } else {
      // limpiar si es nuevo
      setFormData({
        nombre: "",
        apellido: "",
        edad: "",
        altura: "",
        peso: "",
        fuerzaPress: "",
        fuerzaSentadillas: "",
        velocidadDistancia: "",
        velocidadTiempo: "",
        resistenciaAerobica: "",
        resistenciaAnaerobica: "",
      });
      setBroncoTests([]);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const agregarBronco = () => {
    if (!broncoFecha.trim() || !broncoTiempo.trim()) {
      alert("Completa fecha y tiempo del Bronco Test antes de agregar.");
      return;
    }
    const nuevo: BroncoTest = {
      id: uuidv4(),
      fecha: broncoFecha,
      tiempo: broncoTiempo,
    };
    setBroncoTests([...broncoTests, nuevo]);
    setBroncoFecha("");
    setBroncoTiempo("");
  };

  const eliminarBroncoLocal = (id: string) => {
    setBroncoTests(broncoTests.filter((b) => b.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convertir a tipos numéricos donde corresponda
    const payload = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      edad: formData.edad ? Number(formData.edad) : null,
      altura: formData.altura ? Number(formData.altura) : null,
      peso: formData.peso ? Number(formData.peso) : null,
      fuerzaPress: formData.fuerzaPress ? Number(formData.fuerzaPress) : null,
      fuerzaSentadillas: formData.fuerzaSentadillas ? Number(formData.fuerzaSentadillas) : null,
      velocidadDistancia: formData.velocidadDistancia ? Number(formData.velocidadDistancia) : null,
      velocidadTiempo: formData.velocidadTiempo ? Number(formData.velocidadTiempo) : null,
      resistenciaAerobica: formData.resistenciaAerobica.trim() || null,
      resistenciaAnaerobica: formData.resistenciaAnaerobica.trim() || null,
      broncoTests: broncoTests.length ? broncoTests : [],
    };

    // Si initialData tiene id, lo pasamos para actualizar; si no, crear
    if (initialData && initialData.id) {
      onSave(payload, initialData.id);
    } else {
      onSave(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold">{initialData ? "Editar registro" : "Nuevo registro"}</h2>

      {/* Datos personales */}
      <div className="grid grid-cols-2 gap-4">
        <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="input" />
        <input name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} className="input" />
        <input name="edad" type="number" placeholder="Edad" value={formData.edad} onChange={handleChange} className="input" />
        <input name="altura" type="number" step="0.01" placeholder="Altura (m)" value={formData.altura} onChange={handleChange} className="input" />
        <input name="peso" type="number" placeholder="Peso (kg)" value={formData.peso} onChange={handleChange} className="input" />
      </div>

      {/* Fuerza */}
      <h3 className="font-semibold">Fuerza</h3>
      <div className="grid grid-cols-2 gap-4">
        <input name="fuerzaPress" type="number" placeholder="Press plano pecho (kg)" value={formData.fuerzaPress} onChange={handleChange} className="input" />
        <input name="fuerzaSentadillas" type="number" placeholder="Sentadillas (kg)" value={formData.fuerzaSentadillas} onChange={handleChange} className="input" />
      </div>

      {/* Velocidad */}
      <h3 className="font-semibold">Velocidad</h3>
      <div className="grid grid-cols-2 gap-4">
        <input name="velocidadDistancia" type="number" placeholder="Distancia (m)" value={formData.velocidadDistancia} onChange={handleChange} className="input" />
        <input name="velocidadTiempo" type="number" step="0.01" placeholder="Tiempo (s)" value={formData.velocidadTiempo} onChange={handleChange} className="input" />
      </div>

      {/* Resistencia */}
      <h3 className="font-semibold">Resistencia</h3>
      <div className="grid grid-cols-2 gap-4">
        <input name="resistenciaAerobica" type="text" placeholder="Aeróbica base (km o mts)" value={formData.resistenciaAerobica} onChange={handleChange} className="input" />
        <input name="resistenciaAnaerobica" type="text" placeholder="Anaeróbica (ej: 10x15m en 3min)" value={formData.resistenciaAnaerobica} onChange={handleChange} className="input" />
      </div>

      {/* Bronco Test */}
      <h3 className="font-semibold">Bronco Test</h3>
      <div className="grid grid-cols-3 gap-2 items-end">
        <input
          type="date"
          value={broncoFecha}
          onChange={(e) => setBroncoFecha(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Tiempo (mm:ss o s)"
          value={broncoTiempo}
          onChange={(e) => setBroncoTiempo(e.target.value)}
          className="input"
        />
        <button type="button" onClick={agregarBronco} className="btn btn-secondary">
          Agregar Bronco
        </button>
      </div>

      {broncoTests.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Bronco Tests agregados</h4>
          <ul className="list-disc pl-5">
            {broncoTests.map((b) => (
              <li key={b.id} className="flex items-center justify-between">
                <span>{b.fecha} — {b.tiempo}</span>
                <button type="button" onClick={() => eliminarBroncoLocal(b.id)} className="text-sm text-red-400 hover:underline">
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">{initialData ? "Actualizar" : "Guardar"}</button>
      </div>
    </form>
  );
};

export default RegistroForm;
