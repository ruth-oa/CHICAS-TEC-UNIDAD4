// src/components/Sidebar.jsx
import React, { useState } from "react";
import { db, storage } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function Sidebar({ onAddProduct }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tags, setTags] = useState("");
  const [imagen, setImagen] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagen) return alert("Selecciona una imagen antes de guardar");

    setSubiendo(true);

    try {
      // 1️⃣ Subir la imagen al Storage
      const imagenRef = ref(storage, `productos/${imagen.name}`);
      await uploadBytes(imagenRef, imagen);

      // 2️⃣ Obtener URL pública
      const url = await getDownloadURL(imagenRef);

      // 3️⃣ Guardar en Firestore
      const docRef = await addDoc(collection(db, "productos"), {
        titulo,
        descripcion,
        categoria,
        tags: tags.split(",").map((t) => t.trim()),
        imagenUrl: url,
        fecha: serverTimestamp(),
      });

      // 4️⃣ Mostrar en pantalla (sin recargar)
      onAddProduct({
        id: docRef.id,
        titulo,
        descripcion,
        categoria,
        tags: tags.split(",").map((t) => t.trim()),
        imagenUrl: url,
      });

      // 5️⃣ Limpiar formulario
      setTitulo("");
      setDescripcion("");
      setCategoria("");
      setTags("");
      setImagen(null);
      alert("Producto agregado con éxito 🚀");
    } catch (error) {
      console.error("Error al subir producto:", error);
      alert("Error al subir producto");
    }

    setSubiendo(false);
  };

  return (
    <aside className="w-72 bg-gray-100 p-4 rounded-2xl shadow-md h-fit sticky top-4 text-gray-900">
      <h2 className="text-lg font-semibold mb-3 text-gray-900">Nuevo Producto</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="border p-2 rounded text-gray-900 placeholder-gray-500"
          required
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 rounded resize-none text-gray-900 placeholder-gray-500"
          required
        />
        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border p-2 rounded text-gray-900 placeholder-gray-500"
          required
        />
        <input
          type="text"
          placeholder="Tags (separados por comas)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-2 rounded text-gray-900 placeholder-gray-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          className="border p-2 rounded text-gray-900"
        />
        <button
          type="submit"
          disabled={subiendo}
          className={`rounded py-2 transition ${
            subiendo
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {subiendo ? "Subiendo..." : "Agregar Producto"}
        </button>
      </form>
    </aside>
  );
}
