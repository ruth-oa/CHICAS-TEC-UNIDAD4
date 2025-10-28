import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-pink-300 via-yellow-200 to-blue-300 border-4 border-pink-500 rounded-full px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold text-pink-700">🌸 MIKU FORUM 🌸</h1>
      <div className="flex gap-4 text-lg">
        <Link to="/" className="hover:text-blue-600">Inicio</Link>
        <Link to="/foro" className="hover:text-blue-600">Foro</Link>
        <Link to="/perfil" className="hover:text-blue-600">Perfil</Link>
      </div>
    </nav>
  );
}
