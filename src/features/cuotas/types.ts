export type Cuota = {
  id: string;
  clienteId: string;
  mes: string;
  fechaVencimiento: string;
  monto: number;
  estado: "pendiente" | "pagada";
};