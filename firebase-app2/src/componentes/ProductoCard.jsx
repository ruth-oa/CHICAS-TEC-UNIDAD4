// src/components/ProductoCard.jsx
import React from "react";

export function ProductoCard({ producto }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition flex flex-col">
      <img
        src={producto.url}
        alt={producto.titulo}
        className="rounded-lg h-40 w-full object-cover mb-3"
      />
      <h3 className="text-lg font-bold">{producto.titulo}</h3>
      <p className="text-gray-700 text-sm mb-2">{producto.descripcion}</p>
      <span className="text-sm text-blue-600 font-medium mb-2">
        {producto.categoria}
      </span>
      <div className="flex flex-wrap gap-1">
        {producto.tags?.map((tag, i) => (
          <span
            key={i}
            className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
          >
            #{tag.trim()}
          </span>
        ))}
      </div>
    </div>
  );
}
