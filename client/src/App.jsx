import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";

const Home = () => (
  <div className="container mt-5 text-center">
    <h2>Bienvenido a la Aplicación de Autenticación</h2>
    <p>Esta es una demostración de JWT con Refresh Tokens.</p>
  </div>
);

const UserBoard = () => (
  <div className="container mt-5">
    <h3>Panel de Usuario</h3>
    <div className="alert alert-info">Solo los usuarios registrados pueden ver esto.</div>
  </div>
);

const ModBoard = () => (
  <div className="container mt-5">
    <h3>Panel de Moderador</h3>
    <div className="alert alert-warning">Solo los Moderadores pueden ver esto.</div>
  </div>
);

const AdminBoard = () => (
  <div className="container mt-5">
    <h3>Panel de Administrador</h3>
    <div className="alert alert-danger">Solo los Administradores pueden ver esto.</div>
  </div>
);

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<UserBoard />} />
          <Route path="/mod" element={<ModBoard />} />
          <Route path="/admin" element={<AdminBoard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
