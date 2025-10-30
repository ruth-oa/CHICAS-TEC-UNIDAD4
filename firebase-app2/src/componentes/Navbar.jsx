// src/componentes/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const ref = doc(db, "perfiles", u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setPerfil(snap.data());
      } else {
        setPerfil(null);
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    alert("Sesión cerrada");
  };

  return (
    <nav className="bg-gradient-to-r from-pink-300 via-yellow-200 to-blue-300 border-4 border-pink-500 rounded-full px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold text-pink-700">🌸 xd´nt🌸</h1>

      <div className="flex items-center gap-4 text-lg">
        <Link to="/" className="hover:text-blue-600">Clases</Link>
        <Link to="/foro" className="hover:text-blue-600">Foro</Link>
        <Link to={`/perfil/${user?.email}`}>Perfil</Link>


        {!user ? (
          <>
            <button onClick={() => setShowLogin(true)} className="bg-pink-500 text-white px-3 py-1 rounded">Iniciar</button>
            <button onClick={() => setShowRegister(true)} className="bg-blue-500 text-white px-3 py-1 rounded">Registrar</button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            {perfil?.fotoURL ? (
              <img
                src={perfil.fotoURL}
                alt="Perfil"
                className="w-10 h-10 rounded-full border-2 border-pink-500 object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            )}
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* Modales */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </nav>
  );
}
