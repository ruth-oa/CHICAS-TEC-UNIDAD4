import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen grid grid-cols-12 bg-gradient-to-b from-pink-100 via-white to-blue-100">
      {/* Columna izquierda */}
      <aside className="hidden md:block col-span-2 bg-pink-200 border-r-4 border-pink-500 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-pink-700 font-bold text-xl">♡ Links ♡</h2>
          <ul className="mt-4 space-y-2 text-pink-800 font-medium">
            <li><a href="#" className="hover:underline">Mi Blog</a></li>
            <li><a href="#" className="hover:underline">Fanart</a></li>
            <li><a href="#" className="hover:underline">Galería</a></li>
          </ul>
        </div>
        <footer className="text-xs mt-8 text-pink-600">
          © 2025 MikuWorld
        </footer>
      </aside>

      {/* Contenido principal */}
      <main className="col-span-12 md:col-span-8 flex flex-col">
        <Navbar />
        <div className="flex-grow p-6 flex justify-center items-start">
          <div className="w-full max-w-3xl bg-white border-4 border-pink-400 rounded-2xl shadow-lg p-6">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Columna derecha */}
      <aside className="hidden md:block col-span-2 bg-blue-200 border-l-4 border-blue-400 p-4 flex flex-col items-center">
        <h2 className="text-blue-700 font-bold text-xl mb-4">☆ Extras ☆</h2>
        <img
          src="https://media.tenor.com/B7yB9kHh_0IAAAAj/hatsune-miku-miku.gif"
          alt="Miku dancing"
          className="w-32 h-32 rounded-lg border-2 border-blue-300 shadow-md"
        />
        <p className="mt-4 text-blue-800 text-sm font-medium">
          ¡Bienvenida a mi rincón kawaii!
        </p>
      </aside>
    </div>
  );
}
