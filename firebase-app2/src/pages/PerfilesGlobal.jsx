// src/pages/PerfilesGlobal.jsx
import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function PerfilesGlobal() {
  const [perfiles, setPerfiles] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const q = collection(db, "perfiles");
    const unsub = onSnapshot(q, (snapshot) => {
      const datos = snapshot.docs.map(doc => doc.data());
      setPerfiles(datos);
      setCargando(false);
    });
    return () => unsub();
  }, []);

  if (cargando) return <div className="p-10 text-center text-gray-500">Cargando perfiles...</div>;
  if (!perfiles.length) return <div className="p-10 text-center text-gray-500">No hay perfiles aún.</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 space-y-8">
      {perfiles.map((perfil) => (
        <div key={perfil.email} className="bg-white rounded-2xl shadow-md p-6 border-2 border-pink-200">
          <h2 className="text-2xl font-bold text-pink-700 mb-3">{perfil.nombre || perfil.email}</h2>
          
          {/* Foto de perfil */}
          <img
            src={perfil.fotoURL || "https://via.placeholder.com/100"}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full border-4 border-pink-300 object-cover mb-3"
          />

          {/* Bio */}
          <p className="mb-3 border border-pink-100 p-2 rounded">{perfil.bio || "Sin biografía"}</p>

          {/* Galería */}
          <div className="mb-3">
            <h3 className="font-semibold text-pink-700 mb-1">📸 Galería</h3>
            <div className="grid grid-cols-3 gap-3">
              {(perfil.imagenes || []).length > 0 ? (
                perfil.imagenes.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`img-${i}`}
                    className="rounded-xl border-2 border-pink-300 object-cover w-full h-24 shadow-sm"
                  />
                ))
              ) : (
                <p className="text-gray-500 italic col-span-3 text-center">Sin imágenes</p>
              )}
            </div>
          </div>

          {/* Blinkies */}
          <div>
            <h3 className="font-semibold text-pink-700 mb-1">🌈 Blinkies</h3>
            <div className="flex flex-wrap gap-3">
              {(perfil.blinkies || []).length > 0 ? (
                perfil.blinkies.map((url, i) => (
                  <img key={i} src={url} alt={`blink-${i}`} className="h-10 object-contain rounded" />
                ))
              ) : (
                <p className="text-gray-500 italic text-center w-full">Sin blinkies</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
