import React from "react";
import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Foro() {
  const [user, setUser] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  // Detectar usuario activo
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usuarioActual) => {
      setUser(usuarioActual);
    });
    return () => unsub();
  }, []);

  // Escuchar mensajes en tiempo real
  useEffect(() => {
    const q = query(collection(db, "foro"), orderBy("fecha", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMensajes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Enviar mensaje
  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión para publicar");

    await addDoc(collection(db, "foro"), {
      texto: mensaje,
      autor: user.email,
      fecha: serverTimestamp(),
    });
    setMensaje("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Foro</h2>

      {user ? (
        <form onSubmit={enviarMensaje} className="flex gap-2 mb-6">
          <input
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 border p-2"
          />
          <button className="bg-blue-00 text-white p-2 rounded">Enviar</button>
        </form>
      ) : (
        <p className="text-gray-500 mb-6">
          Debes iniciar sesión para participar en el foro.
        </p>
      )}

      <ul>
        {mensajes.map((m) => (
          <li key={m.id} className="border-b py-2">
            <strong>{m.autor || "Anónimo"}:</strong> {m.texto}
          </li>
        ))}
      </ul>
    </div>
  );
}
