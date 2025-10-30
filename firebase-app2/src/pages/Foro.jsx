import React, { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

export default function Foro() {
  const [user, setUser] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [nombres, setNombres] = useState({});
  const [cargando, setCargando] = useState(true);

  // Detectar sesión
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setCargando(false);
    });
    return () => unsub();
  }, []);

  // Escuchar mensajes solo si hay usuario logueado
  useEffect(() => {
    if (!user) return; // 👈 evita cargar mensajes si no hay sesión
    const q = query(collection(db, "foro"), orderBy("fecha", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMensajes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  // Cargar nombres de autores
  useEffect(() => {
    if (!user) return;
    mensajes.forEach(async (m) => {
      if (!nombres[m.autor]) {
        const ref = doc(db, "perfiles", m.autor);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setNombres((prev) => ({
            ...prev,
            [m.autor]: snap.data().nombre || "Usuario",
          }));
        } else {
          setNombres((prev) => ({ ...prev, [m.autor]: "Usuario" }));
        }
      }
    });
  }, [mensajes, user]);

  // Enviar mensaje
  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión para publicar");

    await addDoc(collection(db, "foro"), {
      texto: mensaje,
      autor: user.uid,
      fecha: serverTimestamp(),
    });
    setMensaje("");
  };

  // Si aún está cargando sesión
  if (cargando) {
    return (
      <div className="p-6 text-center text-gray-600">
        Cargando foro...
      </div>
    );
  }

  // Si no hay usuario logueado
  if (!user) {
    return (
      <div className="p-10 text-center text-gray-700">
        <h2 className="text-2xl font-bold text-pink-600 mb-2">
          🔒 Foro privado
        </h2>
        <p>Debes iniciar sesión para acceder al foro.</p>
      </div>
    );
  }

  // Si hay sesión, mostrar foro completo
  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4 text-blue-900 font-bold">Foro</h2>

      <form onSubmit={enviarMensaje} className="flex gap-2 mb-6">
        <input
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 border border-pink-400 p-2 text-blue-950 rounded focus:ring-2 focus:ring-pink-300 outline-none"
        />
        <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
          Enviar
        </button>
      </form>

      <ul>
        {mensajes.map((m) => (
          <li
            key={m.id}
            className="border-b border-pink-200 py-2 text-blue-950"
          >
            <strong>
              <Link
                to={`/perfil/${m.autor}`}
                className="text-pink-600 hover:underline"
              >
                {nombres[m.autor] || "Cargando..."}
              </Link>
              :
            </strong>{" "}
            {m.texto}
          </li>
        ))}
      </ul>
    </div>
  );
}
