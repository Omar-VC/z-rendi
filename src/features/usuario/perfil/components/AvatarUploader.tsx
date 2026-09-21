// src/features/usuario/perfil/components/AvatarUploader.tsx
import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../../auth/useAuth';
import { db } from '../../../../firebase/firebase';
import { uploadToCloudinary } from '../../../../services/cloudinary.service';

export const AvatarUploader = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(user?.photoURL || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);

    try {
      // 1. Subir a Cloudinary
      const imageUrl = await uploadToCloudinary(file);

      // 2. Actualizar Firebase Auth
      await updateProfile(user, { photoURL: imageUrl });

      // 3. Actualizar Firestore (colección 'clientes' o 'usuarios')
      const userRef = doc(db, 'clientes', user.uid);
      await updateDoc(userRef, { photoURL: imageUrl });

      setPhotoURL(imageUrl);
      alert('¡Foto de perfil actualizada correctamente!');
    } catch (error) {
      console.error('Error al actualizar la foto:', error);
      alert('Hubo un error al guardar la foto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300 shadow">
        {photoURL ? (
          <img src={photoURL} alt="Foto de perfil" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-bold">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
          </div>
        )}
      </div>

      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg shadow transition-colors">
        {loading ? 'Subiendo...' : 'Cambiar foto de perfil'}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
        />
      </label>
    </div>
  );
};