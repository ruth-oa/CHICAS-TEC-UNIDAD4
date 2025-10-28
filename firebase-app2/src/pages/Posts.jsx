import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

export default function Posts() {
  const [post, setPost] = useState([]);
  const [texto, setTexto] = useState(""); // para el input

  // 🩷 Leer publicaciones en tiempo real
  useEffect(() => {
    const consulta = query(collection(db, "post"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPost(docs);
    });

    return () => unsubscribe();
  }, []);

  // 🩵 Agregar un nuevo post a Firestore
  const agregarPost = async () => {
    if (texto.trim() === "") return; // evita guardar vacío
    try {
      await addDoc(collection(db, "post"), {
        mensaje: texto,
        fecha: serverTimestamp(), // 🔥 fecha del servidor
      });
      setTexto(""); // limpiar input
    } catch (error) {
      console.error("Error al agregar post:", error);
    }
  };

  // 🩷 Mostrar publicaciones
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-pink-700">
        🩷 Publicaciones 🩷
      </h2>

      {/* Formulario para agregar post */}
      <div className="mb-6 flex gap-2">
        <input
          className="border-2 border-pink-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
          type="text"
          placeholder="Escribe tu mensaje..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow"
          onClick={agregarPost}
        >
          Publicar
        </button>
      </div>

      {/* Lista de publicaciones */}
      <ul className="space-y-3">
        {post.map((doc) => (
          <li
            key={doc.id}
            className="bg-white border-2 border-pink-200 rounded-xl p-3 shadow-sm"
          >
            <p className="text-gray-900">{doc.mensaje}</p>
            {doc.fecha && (
              <p className="text-sm text-gray-500 mt-1">
                📅 {doc.fecha.toDate().toLocaleString()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
