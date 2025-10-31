// src/pages/Productos.jsx
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Sidebar } from "../componentes/Sidebar";

export function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Escuchar cambios en Firestore
    const q = query(collection(db, "productos"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(lista);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex gap-6 p-6 bg-gray-50 min-h-screen text-gray-900">
      <Sidebar
        onAddProduct={(nuevoProducto) =>
          setProductos((prev) => [nuevoProducto, ...prev])
        }
      />

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow rounded-xl p-4 flex flex-col items-center text-center"
          >
            <img
              src={p.imagenUrl}
              alt={p.titulo}
              className="w-full h-48 object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-lg">{p.titulo}</h3>
            <p className="text-sm text-gray-700">{p.descripcion}</p>
            <p className="text-xs text-blue-600 mt-1">#{p.categoria}</p>
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {p.tags?.map((t, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-200 rounded-full px-2 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
