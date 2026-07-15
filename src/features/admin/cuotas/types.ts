export interface Cuota {
  id: string;
  clienteId: string;

  mes: string;
  anio: number;

  monto: number;

  estado: "pendiente" | "pagada";

  fechaVencimiento: string;
  fechaPago?: string;

  metodoPago?: "efectivo" | "transferencia";

  reciboId?: string;
}