// src/features/usuario/ficha/pages/MiFichaPage.tsx
import { useState } from "react";
import { useAuth } from "../../../../auth/useAuth";
import { useFichaCliente } from "../../../admin/fichas/hooks/useFichaCliente";
import FichaForm from "../../../admin/fichas/components/FichaForm";
import AvatarUploadButton from "../../perfil/components/AvatarUploadButton";
import { Card, Button, Badge, Loading } from "../../../../shared/ui";

export default function MiFichaPage() {
  const { user } = useAuth();
  const { ficha, loading, error, recargar } = useFichaCliente(user?.uid);
  const [editando, setEditando] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <p className="text-xs text-red-400 p-4">{error}</p>;
  }

  if (editando || !ficha) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {!ficha && (
          <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg text-xs text-accent">
            Aún no has completado tu ficha técnica. Por favor llena tus datos a continuación.
          </div>
        )}
        <FichaForm
          clienteId={user?.uid ?? ""}
          ficha={ficha}
          onGuardado={() => {
            setEditando(false);
            recargar();
          }}
          onCancelar={ficha ? () => setEditando(false) : undefined}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encabezado Principal */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-accent rounded-full inline-block"></span>
            Mi Ficha Técnica
          </h1>
          <p className="text-xs text-muted font-medium mt-0.5">
            Información física y deportiva sincronizada con tu preparador físico.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setEditando(true)}
          className="!min-h-0 h-8 !px-3 text-xs"
        >
          Editar Ficha
        </Button>
      </div>

      {/* Tarjeta de Avatar y Nombre (Nueva integración) */}
      <Card className="bg-surfaceSoft/40 border border-border/50 p-4 flex items-center gap-4">
        <AvatarUploadButton
          fotoUrl={user?.photoURL || ficha.fotoUrl}
          nombre={ficha.nombre}
          size="lg"
          onSuccess={() => recargar()}
        />
        <div>
          <h2 className="text-lg font-black text-white">
            {ficha.nombre} {ficha.apellido || ""}
          </h2>
          <p className="text-xs text-muted font-medium">
            Haz clic o toca la imagen para actualizar tu foto de perfil.
          </p>
        </div>
      </Card>

      {/* Grid de Contenedores Pro Dark */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Datos Personales */}
        <Card className="bg-surfaceSoft/40 border border-border/50 p-4 space-y-3">
          <span className="text-[11px] font-bold tracking-wider text-muted uppercase">Perfil Atleta</span>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/20">
              <span className="text-muted">Nombre:</span>
              <span className="font-bold text-white">{ficha.nombre || "-"} {ficha.apellido || ""}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/20">
              <span className="text-muted">Edad:</span>
              <span className="font-mono text-white">{ficha.edad ? `${ficha.edad} años` : "-"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted">Teléfono:</span>
              <span className="font-mono text-white">{ficha.telefono || "-"}</span>
            </div>
          </div>
        </Card>

        {/* Antropometría */}
        <Card className="bg-surfaceSoft/40 border border-border/50 p-4 space-y-3">
          <span className="text-[11px] font-bold tracking-wider text-muted uppercase">Antropometría</span>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-surface/60 p-3 rounded-lg border border-border/30 text-center">
              <span className="text-[10px] text-muted block uppercase">Peso</span>
              <span className="text-lg font-mono font-bold text-accent">{ficha.peso ?? "-"}</span>
              <span className="text-[10px] text-muted ml-0.5">kg</span>
            </div>
            <div className="bg-surface/60 p-3 rounded-lg border border-border/30 text-center">
              <span className="text-[10px] text-muted block uppercase">Altura</span>
              <span className="text-lg font-mono font-bold text-white">{ficha.altura ?? "-"}</span>
              <span className="text-[10px] text-muted ml-0.5">cm</span>
            </div>
          </div>
        </Card>

        {/* Perfil Deportivo */}
        <Card className="bg-surfaceSoft/40 border border-border/50 p-4 space-y-3">
          <span className="text-[11px] font-bold tracking-wider text-muted uppercase">Información Deportiva</span>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/20">
              <span className="text-muted">Deporte:</span>
              <Badge variant="neutral">{ficha.deporte || "No especificado"}</Badge>
            </div>
            <div className="flex justify-between py-1 border-b border-border/20">
              <span className="text-muted">Puesto / Posición:</span>
              <span className="font-medium text-white">{ficha.puesto || "-"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/20">
              <span className="text-muted">Nivel:</span>
              <span className="font-medium text-white">{ficha.nivel || "-"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted">Experiencia:</span>
              <span className="font-medium text-white">{ficha.experiencia || "-"}</span>
            </div>
          </div>
        </Card>

        {/* Salud y Objetivos */}
        <Card className="bg-surfaceSoft/40 border border-border/50 p-4 space-y-3">
          <span className="text-[11px] font-bold tracking-wider text-muted uppercase">Salud & Objetivos</span>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-muted block mb-1">Objetivo Principal:</span>
              <p className="p-2 rounded bg-surface/50 border border-border/30 text-white font-medium">
                {ficha.objetivoPrincipal || "Sin objetivo registrado."}
              </p>
            </div>
            <div>
              <span className="text-muted block mb-1">Lesiones / Historial:</span>
              <p className="p-2 rounded bg-surface/50 border border-border/30 text-white/80">
                {ficha.lesiones || "Sin antecedentes declarados."}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}