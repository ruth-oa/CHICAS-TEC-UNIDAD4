import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { onSnapshot, query, collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

export function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [formUsuario, setFormUsuario] = useState({ nombre: "", correo: "" });
  const [editandoId, setEditandoId] = useState(null);

  // Leer usuarios en tiempo real
  useEffect(() => {
    const consulta = query(collection(db, "usuario"));
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsuarios(docs);
    });
    return () => unsubscribe();
  }, []);

  // Validaciones
  const validarNombre = (nombre) => /^[a-zA-Z\s]+$/.test(nombre);
  const validarCorreo = (correo) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  // Guardar o editar usuario
  const guardarUsuario = async (e) => {
    e.preventDefault();

    if (!formUsuario.nombre || !formUsuario.correo) {
      alert("Completa ambos campos");
      return;
    }

    if (!validarNombre(formUsuario.nombre)) {
      alert("El nombre solo puede contener letras y espacios");
      return;
    }

    if (!validarCorreo(formUsuario.correo)) {
      alert("Ingresa un correo válido");
      return;
    }

    try {
      if (editandoId) {
        // Editar
        const ref = doc(db, "usuario", editandoId);
        await updateDoc(ref, { nombre: formUsuario.nombre, correo: formUsuario.correo });
        setEditandoId(null);
      } else {
        // Nuevo
        await addDoc(collection(db, "usuario"), { nombre: formUsuario.nombre, correo: formUsuario.correo });
      }

      setFormUsuario({ nombre: "", correo: "" });
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  // Borrar usuario
  const eliminarUsuario = async (id) => {
    const confirmar = confirm("¿Deseas eliminar este usuario?");
    if (!confirmar) return;
    try {
      await deleteDoc(doc(db, "usuario", id));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  // Editar usuario
  const editar = (u) => {
    setFormUsuario({ nombre: u.nombre, correo: u.correo });
    setEditandoId(u.id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-b from-yellow-50 via-white to-pink-50 rounded-3xl shadow-lg border-4 border-yellow-200">
      <h2 className="text-3xl font-bold text-center text-yellow-600 mb-6">👥 Usuarios</h2>

      {/* Formulario */}
      <form className="flex flex-col sm:flex-row gap-3 mb-6" onSubmit={guardarUsuario}>
        <input
          type="text"
          placeholder="Ingresa Nombre"
          value={formUsuario.nombre}
          onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })}
          className="flex-1 border-2 border-yellow-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm text-gray-600 "
        />
        <input
          type="email"
          placeholder="Ingresa Correo"
          value={formUsuario.correo}
          onChange={(e) => setFormUsuario({ ...formUsuario, correo: e.target.value })}
          className="flex-1 border-2 border-yellow-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm text-gray-600"
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-xl shadow-md transition"
        >
          {editandoId ? "Guardar edición" : "Agregar"}
        </button>
      </form>

      {/* Lista de usuarios */}
      <div>
        <h3 className="text-2xl font-semibold text-yellow-600 mb-3">Lista de Usuarios</h3>
        {usuarios.length === 0 ? (
          <p className="text-gray-500 italic">No hay usuarios registrados...</p>
        ) : (
          <ul className="space-y-3">
            {usuarios.map((u) => (
              <li
                key={u.id}
                className="bg-white border-2 border-yellow-200 rounded-2xl p-4 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
              >
                <div>
                  <p className="text-gray-900 font-medium">{u.nombre}</p>
                  <p className="text-gray-700 text-sm">{u.correo}</p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => editar(u)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => eliminarUsuario(u.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
