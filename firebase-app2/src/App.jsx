import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./componentes/Layout";
import Clases from "./pages/Clases";
import Foro from "./pages/Foro";
import Perfil from "./pages/Perfil";
import PerfilesGlobal from "./pages/PerfilesGlobal"; // 🔹 NUEVO

function App() {
  return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Clases />} />
          <Route path="/foro" element={<Foro />} />
          <Route path="/perfil/:email" element={<Perfil />} />
          <Route path="/perfiles" element={<PerfilesGlobal />} /> {/* 🔹 NUEVO */}
        </Route>
      </Routes>
  );
}

export default App;
