// src/features/usuario/perfil/components/AvatarUploadButton.tsx
import React, { useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../../../auth/useAuth";
import { db } from "../../../../firebase/firebase";
import { uploadToCloudinary } from "../../../../services/cloudinary.service";

interface AvatarUploadButtonProps {
  fotoUrl?: string | null;
  nombre?: string;
  size?: "sm" | "md" | "lg";
  onSuccess?: (nuevaUrl: string) => void;
}

export default function AvatarUploadButton({
  fotoUrl,
  nombre = "Atleta",
  size = "md",
  onSuccess,
}: AvatarUploadButtonProps) {
  const { user } = useAuth();
  const [subiendo, setSubiendo] = useState(false);

  const iniciales = nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: "w-12 h-12 text-base rounded-xl",
    md: "w-16 h-16 text-xl rounded-2xl",
    lg: "w-24 h-24 text-3xl rounded-2xl",
  };

  const handleSubirFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setSubiendo(true);

    try {
      // 1. Subida directa a Cloudinary
      const imageUrl = await uploadToCloudinary(file);

      // 2. Actualizar en Firebase Auth
      await updateProfile(user, { photoURL: imageUrl });

      // 3. Actualizar documento de Firestore (en 'fichas' o 'clientes')
      const fichaRef = doc(db, "fichas", user.uid);
      await updateDoc(fichaRef, { fotoUrl: imageUrl }).catch(() => null);

      if (onSuccess) onSuccess(imageUrl);
    } catch (error) {
      console.error("Error al actualizar avatar:", error);
      alert("Hubo un problema al subir la foto.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <label className="relative group cursor-pointer inline-block">
      <div
        className={`${sizeClasses[size]} relative overflow-hidden bg-surfaceSoft border border-primary/40 flex items-center justify-center font-black text-primary shadow-[0_0_20px_rgba(255,85,0,0.15)] group-hover:border-primary transition-all duration-300`}
      >
        {subiendo ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : fotoUrl ? (
          <img
            src={fotoUrl}
            alt={nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{iniciales}</span>
        )}

        {/* Overlay hover para cambiar foto */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold uppercase tracking-wider text-center p-1">
          📷 Cambiar
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleSubirFoto}
        disabled={subiendo}
        className="hidden"
      />
    </label>
  );
}