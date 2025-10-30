import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db, storage } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Perfil() {
  const { email: emailParam } = useParams();
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [nuevasImgs, setNuevasImgs] = useState([]);
  const [nuevosBlinkies, setNuevosBlinkies] = useState([]);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // ✅ Usa el email del usuario logueado si no hay en la URL
  const email = emailParam || user?.email;

  // 🧩 Detectar usuario logueado
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // 🧠 Cargar perfil desde Firestore
  useEffect(() => {
    const cargarPerfil = async () => {
      if (!email) return;
      try {
        const refDoc = doc(db, "perfiles", email);
        const snap = await getDoc(refDoc);

        if (snap.exists()) {
          setPerfil(snap.data());
        } else {
          const nuevo = {
            nombre: "",
            bio: "",
            fotoURL: "",
            imagenes: [],
            blinkies: [],
            email,
          };
          await setDoc(refDoc, nuevo);
          setPerfil(nuevo);
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    };
    cargarPerfil();
  }, [email]);

  // 📸 Subir foto de perfil
  const handleFotoPerfil = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo || !email) return;

    try {
      setFotoPreview(URL.createObjectURL(archivo));
      const imageRef = ref(storage, `perfiles/${email}/fotoPerfil.jpg`);
      await uploadBytes(imageRef, archivo);
      const url = await getDownloadURL(imageRef);

      const refDoc = doc(db, "perfiles", email);
      await setDoc(refDoc, { fotoURL: url }, { merge: true });
      setPerfil((prev) => ({ ...prev, fotoURL: url }));
      setFotoPreview(null);
    } catch (error) {
      console.error("Error al subir la foto:", error);
      alert("Hubo un error al subir la foto de perfil.");
    }
  };

  // ♻️ Subir imágenes o blinkies
  const subirArchivos = async (files, carpeta, limite) => {
    if (!files.length) return alert(`Selecciona archivos para ${carpeta}.`);
    try {
      const refDoc = doc(db, "perfiles", email);
      const urls = [];

      for (let i = 0; i < files.length && i < limite; i++) {
        const archivo = files[i];
        const archivoRef = ref(storage, `perfiles/${email}/${carpeta}/${archivo.name}`);
        await uploadBytes(archivoRef, archivo);
        const url = await getDownloadURL(archivoRef);
        urls.push(url);
      }

      const nuevas = [...(perfil[carpeta] || []), ...urls].slice(0, limite);
      await setDoc(refDoc, { [carpeta]: nuevas }, { merge: true });
      setPerfil((prev) => ({ ...prev, [carpeta]: nuevas }));

      if (carpeta === "imagenes") setNuevasImgs([]);
      if (carpeta === "blinkies") setNuevosBlinkies([]);
      alert(`Archivos de ${carpeta} subidos correctamente 🌸`);
    } catch (error) {
      console.error(`Error al subir ${carpeta}:`, error);
      alert(`Error al subir ${carpeta}.`);
    }
  };

  // 💾 Guardar cambios generales
  const guardarCambios = async () => {
    try {
      setGuardando(true);
      const refDoc = doc(db, "perfiles", email);
      await setDoc(refDoc, perfil, { merge: true });
      setEditando(false);
      alert("Perfil actualizado ✨");
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      alert("Hubo un error al guardar el perfil.");
    } finally {
      setGuardando(false);
    }
  };

  // ⚠️ Mostrar mensaje si no hay sesión
  if (!user) {
    return (
      <div className="p-10 text-center text-gray-500">
        Inicia sesión para ver tu perfil 🌸
      </div>
    );
  }

  // ⏳ Cargando perfil
  if (!perfil) {
    return (
      <div className="p-10 text-center text-gray-500">
        Cargando perfil...
      </div>
    );
  }

  const esPropio = user?.email === email;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-gradient-to-b from-pink-100 via-white to-blue-100 rounded-3xl shadow-lg p-8 border-4 border-pink-300 text-gray-800">
      <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
        🌸 Perfil de {perfil.nombre || email} 🌸
      </h2>

      {/* FOTO PERFIL */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={fotoPreview || perfil.fotoURL || "https://via.placeholder.com/150"}
          alt="Foto de perfil"
          className="w-32 h-32 rounded-full border-4 border-pink-400 object-cover"
        />
        {esPropio && editando && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFotoPerfil}
            className="mt-3 text-sm"
          />
        )}
      </div>

      {/* INFO GENERAL */}
      <div className="space-y-4">
        <div>
          <label className="font-semibold text-pink-700">Nombre:</label>
          {esPropio && editando ? (
            <input
              value={perfil.nombre}
              onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
              className="border border-pink-300 p-2 rounded w-full bg-white focus:ring focus:ring-pink-200"
            />
          ) : (
            <p className="p-2 border border-pink-200 rounded bg-white">
              {perfil.nombre || "Sin nombre"}
            </p>
          )}
        </div>

        <div>
          <label className="font-semibold text-pink-700">Biografía:</label>
          {esPropio && editando ? (
            <textarea
              value={perfil.bio}
              onChange={(e) => setPerfil({ ...perfil, bio: e.target.value })}
              className="border border-pink-300 p-2 rounded w-full h-24 bg-white resize-none focus:ring focus:ring-pink-200"
            />
          ) : (
            <p className="p-2 border border-pink-200 rounded bg-white min-h-[6rem]">
              {perfil.bio || "Sin biografía"}
            </p>
          )}
        </div>
      </div>

      {/* BOTONES */}
      {esPropio && (
        <div className="mt-6 flex justify-center gap-4">
          {editando ? (
            <>
              <button
                onClick={guardarCambios}
                className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-4 py-2 shadow transition"
              >
                {guardando ? "Guardando..." : "Guardar"}
              </button>
              <button
                onClick={() => setEditando(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full px-4 py-2 shadow transition"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditando(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 shadow transition"
            >
              Editar perfil
            </button>
          )}
        </div>
      )}

      {/* GALERÍA */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-pink-700 mb-3">📸 Galería</h3>
        {esPropio && editando && (
          <>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setNuevasImgs([...e.target.files])}
              className="mb-3 text-gray-700"
            />
            <button
              onClick={() => subirArchivos(nuevasImgs, "imagenes", 3)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 shadow transition"
            >
              Subir imágenes
            </button>
          </>
        )}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {(perfil.imagenes || []).length > 0 ? (
            perfil.imagenes.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`img-${i}`}
                className="rounded-xl border-2 border-pink-300 object-cover w-full h-32 shadow-sm"
              />
            ))
          ) : (
            <p className="text-gray-500 italic col-span-3 text-center">
              Sin imágenes
            </p>
          )}
        </div>
      </div>

      {/* BLINKIES */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-pink-700 mb-3">🌈 Blinkies</h3>
        {esPropio && editando && (
          <>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setNuevosBlinkies([...e.target.files])}
              className="mb-3 text-gray-700"
            />
            <button
              onClick={() => subirArchivos(nuevosBlinkies, "blinkies", 6)}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-4 py-2 shadow transition"
            >
              Subir blinkies
            </button>
          </>
        )}
        <div className="flex flex-wrap gap-3 mt-5 justify-center">
          {(perfil.blinkies || []).length > 0 ? (
            perfil.blinkies.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`blink-${i}`}
                className="h-10 object-contain rounded"
              />
            ))
          ) : (
            <p className="text-gray-500 italic text-center w-full">
              Sin blinkies
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
