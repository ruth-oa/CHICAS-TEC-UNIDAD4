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
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

export default function Foro() {
  const [user, setUser] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [perfiles, setPerfiles] = useState({});
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [editTexto, setEditTexto] = useState("");

  // Detectar sesión
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setCargando(false);
    });
    return () => unsub();
  }, []);

  // Escuchar mensajes
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "foro"), orderBy("fecha", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMensajes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  // Cargar perfiles
  useEffect(() => {
    if (!user) return;
    mensajes.forEach(async (m) => {
      if (!perfiles[m.autor]) {
        const ref = doc(db, "perfiles", m.autor);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setPerfiles((prev) => ({
            ...prev,
            [m.autor]: {
              nombre: snap.data().nombre || "Usuario",
              fotoURL: snap.data().fotoURL || "https://via.placeholder.com/40",
            },
          }));
        } else {
          setPerfiles((prev) => ({
            ...prev,
            [m.autor]: { nombre: "Usuario", fotoURL: "https://via.placeholder.com/40" },
          }));
        }
      }
    });
  }, [mensajes, user]);

  // Enviar mensaje
  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!user || !mensaje.trim()) return;

    await addDoc(collection(db, "foro"), {
      texto: mensaje,
      autor: user.email,
      fecha: serverTimestamp(),
      editado: false,
      eliminado: false,
    });
    setMensaje("");
  };

  // Editar mensaje
  const guardarEdicion = async (id) => {
    if (!editTexto.trim()) return;
    const ref = doc(db, "foro", id);
    await updateDoc(ref, {
      texto: editTexto,
      editado: true,
    });
    setEditandoId(null);
    setEditTexto("");
  };

  // Borrar mensaje
  const borrarMensaje = async (id) => {
    const ref = doc(db, "foro", id);
    await updateDoc(ref, {
      texto: "Este mensaje fue eliminado",
      eliminado: true,
    });
  };

  if (cargando) return <div className="p-6 text-center text-gray-600">Cargando foro...</div>;
  if (!user)
    return (
      <div className="p-10 text-center text-gray-700">
        <h2 className="text-2xl font-bold text-pink-600 mb-2">🔒 Foro privado</h2>
        <p>Debes iniciar sesión para acceder al foro.</p>
      </div>
    );

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
            className="border-b border-pink-200 py-2 flex items-start gap-2 text-blue-950"
          >
            {perfiles[m.autor] && (
              <>
                <img
                  src={perfiles[m.autor].fotoURL}
                  alt={perfiles[m.autor].nombre}
                  className="w-8 h-8 rounded-full border border-pink-300 object-cover"
                />
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/perfil/${m.autor}`}
                      className="text-pink-600 font-semibold hover:underline"
                    >
                      {perfiles[m.autor].nombre}
                    </Link>
                    <span className="text-gray-400 text-xs">
                      {m.fecha?.toDate ? m.fecha.toDate().toLocaleString() : ""}
                    </span>
                  </div>

                  {editandoId === m.id ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        value={editTexto}
                        onChange={(e) => setEditTexto(e.target.value)}
                        className="flex-1 border border-pink-300 p-1 rounded"
                      />
                      <button
                        onClick={() => guardarEdicion(m.id)}
                        className="bg-green-500 text-white px-2 rounded hover:bg-green-600"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditandoId(null)}
                        className="bg-gray-300 px-2 rounded hover:bg-gray- text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center gap-2">
                      <span className={m.eliminado ? "italic text-gray-500" : ""}>{m.texto}</span>
                      {m.editado && !m.eliminado && (
                        <span className="text-xs text-gray-400 ml-2">(editado)</span>
                      )}
                      {!m.eliminado && m.autor === user.email && (
                        <>
                          <button
                            onClick={() => {
                              setEditandoId(m.id);
                              setEditTexto(m.texto);
                            }}
                            className="text-sm text-blue-500 hover:underline ml-2"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => borrarMensaje(m.id)}
                            className="text-sm text-red-500 hover:underline ml-1"
                          >
                            Borrar
                          </button>
                          
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
