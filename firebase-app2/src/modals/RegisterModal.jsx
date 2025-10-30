// src/componentes/modals/RegisterModal.jsx
import React, { useState } from "react";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default function RegisterModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "perfiles", cred.user.uid), {
        nombre: "",
        bio: "",
        fotoURL: "",
        blinkies: [],
        imagenes: [],
      });
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-80">
        <h2 className="text-xl mb-4 text-center font-bold text-black">Registrarse</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded text-blue-950"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded text-blue-950"
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Crear cuenta
          </button>
        </form>
        <button onClick={onClose} className="mt-3 text-sm text-gray-500 hover:underline w-full text-center">
          Cancelar
        </button>
      </div>
    </div>
  );
}
