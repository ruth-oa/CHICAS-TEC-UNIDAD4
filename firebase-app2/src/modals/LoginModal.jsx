// src/componentes/modals/LoginModal.jsx
import React, { useState } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-80">
        <h2 className="text-xl mb-4 text-center font-bold text-black" >Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
          <button type="submit" className="bg-pink-600 text-white p-2 rounded">Entrar</button>
        </form>
        <button onClick={onClose} className="mt-3 text-sm text-gray-500 hover:underline w-full text-center">
          Cancelar
        </button>
      </div>
    </div>
  );
}
