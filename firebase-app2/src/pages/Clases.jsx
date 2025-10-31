// src/pages/Clases.jsx
import React, { useState } from "react";
import Posts from "./Posts";
import { Usuario } from "./Usuario";
import { Productos } from "./Productos";

export default function Clases() {
  const [seccionActiva, setSeccionActiva] = useState("posts"); // "posts" o "usuarios"

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-black ">📚 Clases</h1>

      {/* Selector de secciones */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${seccionActiva === "posts" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setSeccionActiva("posts")}
        >
          Posts
        </button>
        <button
          className={`px-4 py-2 rounded ${seccionActiva === "usuarios" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setSeccionActiva("usuarios")}
        >
          Usuarios
        </button>

        <button
          className={`px-4 py-2 rounded ${seccionActiva === "usuarios" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setSeccionActiva("productos")}
        >
          Productos
        </button>

      </div>

      {/* Contenido de la sección activa */}
      <div className="bg-white p-4 rounded shadow">
        {seccionActiva === "posts" && <Posts />}
        {seccionActiva === "usuarios" && <Usuario />}
        {seccionActiva === "productos" && <Productos />}
      </div>
    </div>
  );
}
