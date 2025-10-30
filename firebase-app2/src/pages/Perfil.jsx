import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Perfil() {
  const { email: emailParam } = useParams();
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [fotoInput, setFotoInput] = useState("");
  const [imgInputs, setImgInputs] = useState([""]);
  const [blinkieInputs, setBlinkieInputs] = useState([""]);
  const [guardando, setGuardando] = useState(false);

  const email = emailParam || user?.email;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const cargarPerfil = async () => {
      if (!email) return;
      try {
        const refDoc = doc(db, "perfiles", email);
        const snap = await getDoc(refDoc);

        if (snap.exists()) {
          setPerfil(snap.data());
          setFotoInput(snap.data().fotoURL || "");
          setImgInputs(snap.data().imagenes.length ? snap.data().imagenes : [""]);
          setBlinkieInputs(snap.data().blinkies.length ? snap.data().blinkies : [""]);
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

  const guardarCambios = async () => {
    if (!perfil) return;
    try {
      setGuardando(true);
      const refDoc = doc(db, "perfiles", email);

      const nuevasImagenes = imgInputs.filter((u) => u.trim() !== "");
      const nuevosBlinkies = blinkieInputs.filter((u) => u.trim() !== "");

      await setDoc(
        refDoc,
        {
          ...perfil,
          fotoURL: fotoInput,
          imagenes: nuevasImagenes,
          blinkies: nuevosBlinkies,
        },
        { merge: true }
      );

      setPerfil({
        ...perfil,
        fotoURL: fotoInput,
        imagenes: nuevasImagenes,
        blinkies: nuevosBlinkies,
      });
      setEditando(false);
      alert("Perfil actualizado ✨");
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      alert("Hubo un error al guardar el perfil.");
    } finally {
      setGuardando(false);
    }
  };

  if (!user) return <div className="p-10 text-center text-gray-500">Inicia sesión para ver tu perfil 🌸</div>;
  if (!perfil) return <div className="p-10 text-center text-gray-500">Cargando perfil...</div>;

  const esPropio = user?.email === email;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-gradient-to-b from-pink-100 via-white to-blue-100 rounded-3xl shadow-lg p-8 border-4 border-pink-300 text-gray-800">
      <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
        🌸 Perfil de {perfil.nombre || email} 🌸
      </h2>

      {/* FOTO PERFIL */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={fotoInput || "https://via.placeholder.com/150"}
          alt="Foto de perfil"
          className="w-32 h-32 rounded-full border-4 border-pink-400 object-cover"
        />
        {esPropio && editando && (
          <input
            type="text"
            placeholder="URL de la foto de perfil"
            value={fotoInput}
            onChange={(e) => setFotoInput(e.target.value)}
            className="mt-3 border border-pink-300 p-2 rounded w-full"
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
            <p className="p-2 border border-pink-200 rounded bg-white">{perfil.nombre || "Sin nombre"}</p>
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
            <p className="p-2 border border-pink-200 rounded bg-white min-h-[6rem]">{perfil.bio || "Sin biografía"}</p>
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
    <input
      type="text"
      placeholder="Ingresa URLs separadas por coma"
      value={imgInputs.join(", ")}
      onChange={(e) => setImgInputs(e.target.value.split(",").map(u => u.trim()))}
      className="mb-2 border border-pink-300 p-2 rounded w-full"
    />
  )}
  <div className="grid grid-cols-3 gap-3 mt-3">
    {perfil.imagenes.length > 0 ? (
      perfil.imagenes.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`img-${i}`}
          className="rounded-xl border-2 border-pink-300 object-cover w-full h-32 shadow-sm"
        />
      ))
    ) : (
      <p className="text-gray-500 italic col-span-3 text-center">Sin imágenes</p>
    )}
  </div>
</div>

{/* BLINKIES */}
<div className="mt-10">
  <h3 className="text-xl font-semibold text-pink-700 mb-3">🌈 Blinkies</h3>
  {esPropio && editando && (
    <input
      type="text"
      placeholder="Ingresa URLs de blinkies separadas por coma"
      value={blinkieInputs.join(", ")}
      onChange={(e) => setBlinkieInputs(e.target.value.split(",").map(u => u.trim()))}
      className="mb-2 border border-purple-300 p-2 rounded w-full"
    />
  )}
  <div className="flex flex-wrap gap-3 mt-3 justify-center">
    {perfil.blinkies.length > 0 ? (
      perfil.blinkies.map((url, i) => (
        <img key={i} src={url} alt={`blink-${i}`} className="h-10 object-contain rounded" />
      ))
    ) : (
      <p className="text-gray-500 italic text-center w-full">Sin blinkies</p>
    )}
  </div>
</div>

    </div>
  );
}
