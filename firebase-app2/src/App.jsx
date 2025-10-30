import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./componentes/Layout";
import Clases from "./pages/Clases"; // NUEVO
import Foro from "./pages/Foro";
import Perfil from "./pages/Perfil";

function App() {
  return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Clases />} /> {/* Antes Posts */}
          <Route path="/foro" element={<Foro />} />
          <Route path="/perfil/:email" element={<Perfil />} />
        </Route>
      </Routes>
  );
}

export default App;
