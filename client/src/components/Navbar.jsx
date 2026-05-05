import React from "react";
import { Link } from "react-router-dom";
import authService from "../services/auth.service";

const Navbar = ({ user, setUser }) => {
  const logOut = () => {
    const refreshToken = authService.getCurrentRefreshToken();
    authService.logout(refreshToken).then(() => {
      setUser(null);
    });
  };

  const showModeratorBoard = user?.roles.includes("ROLE_MODERATOR");
  const showAdminBoard = user?.roles.includes("ROLE_ADMIN");

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark px-4 mb-4">
      <Link to={"/"} className="navbar-brand">
        AuthApp
      </Link>
      <div className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link to={"/home"} className="nav-link">
            Inicio
          </Link>
        </li>

        {showModeratorBoard && (
          <li className="nav-item">
            <Link to={"/mod"} className="nav-link">
              Panel Moderador
            </Link>
          </li>
        )}

        {showAdminBoard && (
          <li className="nav-item">
            <Link to={"/admin"} className="nav-link">
              Panel Admin
            </Link>
          </li>
        )}

        {user && (
          <li className="nav-item">
            <Link to={"/user"} className="nav-link">
              Usuario
            </Link>
          </li>
        )}
      </div>

      {user ? (
        <div className="navbar-nav ms-auto">
          <li className="nav-item">
            <span className="nav-link text-light me-3">
              Hola, {user.username}
            </span>
          </li>
          <li className="nav-item">
            <a href="/login" className="nav-link" onClick={logOut}>
              Cerrar Sesión
            </a>
          </li>
        </div>
      ) : (
        <div className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link to={"/login"} className="nav-link">
              Login
            </Link>
          </li>

          <li className="nav-item">
            <Link to={"/register"} className="nav-link">
              Registro
            </Link>
          </li>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
