// src/pages/Productos.jsx
import React, { useState } from "react";
import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Sidebar } from "../componentes/Sidebar";
import { ProductoCard } from "../componentes/ProductoCard";

export function Productos() {
  const [imagen, setImagen] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [productos, setProductos] = useState([]);

  const subirImagen = async (productoInfo) => {
    if (!imagen) return alert("Selecciona una imagen primero");
    setSubiendo(true);

    const imagenRef = ref(storage, `imagenes/${imagen.name}`);
    await uploadBytes(imagenRef, imagen);
    const url = await getDownloadURL(imagenRef);

    const nuevoProducto = {
      ...productoInfo,
      url,
    };

    setProductos((prev) => [...prev, nuevoProducto]);
    setSubiendo(false);
    setImagen(null);
  };

  return (
    <div className="flex gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar onAddProduct={subirImagen} />

      {/* Contenido principal */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Productos</h1>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          className="mb-4"
        />
        <p className="mb-4 text-gray-500 text-sm">
          {subiendo ? "Subiendo imagen..." : "Selecciona una imagen para tu producto"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((p, i) => (
            <ProductoCard key={i} producto={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
