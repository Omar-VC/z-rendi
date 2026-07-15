import { useState } from "react";

import type { Cuota } from "../types";
import { crearCuota } from "../services/cuotas.service";


interface CuotaFormProps {
  clienteId: string;
  onGuardado: () => void;
  onCancelar: () => void;
}


function CuotaForm({
  clienteId,
  onGuardado,
  onCancelar,
}: CuotaFormProps) {


  const [form, setForm] = useState({
    mes: "",
    anio: new Date().getFullYear().toString(),
    monto: "",
    fechaVencimiento: "",
  });


  const [guardando, setGuardando] = useState(false);



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };



  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setGuardando(true);


    try {

      const nuevaCuota: Omit<Cuota, "id"> = {

        clienteId,

        mes: form.mes,

        anio: Number(form.anio),

        monto: Number(form.monto),

        estado: "pendiente",

        fechaVencimiento:
          form.fechaVencimiento,

      };


      await crearCuota(nuevaCuota);


      onGuardado();


    } catch (error) {

      console.error(
        "Error creando cuota",
        error
      );

    } finally {

      setGuardando(false);

    }

  };



  return (

    <section className="p-6 rounded-xl border border-white/10">

      <h2 className="text-xl font-bold mb-6">
        Crear cuota
      </h2>



      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >


        <input
          name="mes"
          value={form.mes}
          onChange={handleChange}
          placeholder="Mes"
          className="p-3 rounded-lg bg-white/10 border border-white/20 text-white"
        />



        <input
          name="anio"
          type="number"
          value={form.anio}
          onChange={handleChange}
          placeholder="Año"
          className="p-3 rounded-lg bg-white/10 border border-white/20 text-white"
        />



        <input
          name="monto"
          type="number"
          value={form.monto}
          onChange={handleChange}
          placeholder="Monto"
          className="p-3 rounded-lg bg-white/10 border border-white/20 text-white"
        />



        <input
          name="fechaVencimiento"
          type="date"
          value={form.fechaVencimiento}
          onChange={handleChange}
          className="p-3 rounded-lg bg-white/10 border border-white/20 text-white"
        />



        <div className="flex gap-3">


          <button
            type="submit"
            disabled={guardando}
            className="px-4 py-2 rounded-lg"
          >

            {guardando
              ? "Guardando..."
              : "Crear cuota"}

          </button>



          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 rounded-lg"
          >

            Cancelar

          </button>


        </div>


      </form>


    </section>

  );

}


export default CuotaForm;