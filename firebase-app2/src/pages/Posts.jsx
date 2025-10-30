import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  serverTimestamp,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function Posts() {
  const [post, setPost] = useState([]);
  const [texto, setTexto] = useState("");
  const [editandoId, setEditandoId] = useState(null);

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

  const agregarPost = async () => {
    if (texto.trim() === "") {
      alert("No puedes enviar un mensaje vacío 🥺");
      return;
    }

    try {
      if (editandoId) {
        const ref = doc(db, "post", editandoId);
        await updateDoc(ref, {
          mensaje: texto,
          editado: true,
        });
        setEditandoId(null);
      } else {
        await addDoc(collection(db, "post"), {
          mensaje: texto,
          fecha: serverTimestamp(),
          eliminado: false,
          editado: false,
        });
      }
      setTexto("");
    } catch (error) {
      console.error("Error al agregar/editar post:", error);
    }
  };

  const eliminarPost = async (id) => {
    const confirmar = confirm("¿Seguro que deseas eliminar este mensaje?");
    if (!confirmar) return;

    try {
      const ref = doc(db, "post", id);
      await updateDoc(ref, {
        mensaje: "Mensaje eliminado 🗑️",
        eliminado: true,
      });
    } catch (error) {
      console.error("Error al eliminar mensaje:", error);
    }
  };

  const editarPost = (doc) => {
    setTexto(doc.mensaje);
    setEditandoId(doc.id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-b from-pink-50 via-white to-blue-50 rounded-3xl shadow-lg border-4 border-pink-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-pink-700">
        📝 Foro de Posts
      </h2>

      {/* Formulario */}
      <div className="mb-6 flex gap-3 flex-col sm:flex-row">
        <input
          className="flex-1 border-2 border-pink-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm text-gray-900"
          type="text"
          placeholder="Escribe tu mensaje..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-xl shadow-md transition disabled:bg-gray-300"
          onClick={agregarPost}
          disabled={texto.trim() === ""}
        >
          {editandoId ? "Guardar edición" : "Publicar"}
        </button>
      </div>

      {/* Lista de posts */}
      <ul className="space-y-4">
        {post.map((doc) => (
          <li
            key={doc.id}
            className="bg-white border-2 border-pink-200 rounded-2xl p-4 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
          >
            <div>
              <p
                className={`${
                  doc.eliminado ? "text-gray-400 italic" : "text-gray-900"
                } text-lg`}
              >
                {doc.mensaje}{" "}
                {doc.editado && !doc.eliminado && (
                  <span className="text-sm text-gray-500">(editado 📝)</span>
                )}
              </p>
              {doc.fecha && (
                <p className="text-sm text-gray-500 mt-1">
                  📅 {doc.fecha.toDate().toLocaleString()}
                </p>
              )}
            </div>

            {!doc.eliminado && (
              <div className="flex gap-3 mt-2 sm:mt-0">
                <button
                  onClick={() => editarPost(doc)}
                  className="text-blue-500 hover:text-blue-700 text-lg transition"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => eliminarPost(doc.id)}
                  className="text-red-500 hover:text-red-700 text-lg transition"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
