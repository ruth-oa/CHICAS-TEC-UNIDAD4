// src/components/Sidebar.jsx
import React, { useState } from "react";

export function Sidebar({ onAddProduct }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct({ titulo, descripcion, categoria, tags: tags.split(",") });
    setTitulo("");
    setDescripcion("");
    setCategoria("");
    setTags("");
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
        <button
          type="submit"
          className="bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
        >
          Agregar
        </button>
      </form>
    </aside>
  );
}
