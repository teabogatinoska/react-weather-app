import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import logo from "./logo.png";

import AuthService from "./services/auth-service";

import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import Profile from "./components/authentication/Profile";
import BoardUser from "./components/authentication/BoardUser";

import eventBus from "./common/EventBus";
import Map from "./components/map/Map";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }

    return () => {
      eventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          {currentUser ? (
            <Link to={"/map"} className="navbar-brand">
              <img src={logo} alt="App Logo" />
            </Link>
          ) : (
            <Link to={"/login"} className="navbar-brand">
              <img src={logo} alt="App Logo" />
            </Link>
          )}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link to={"/map"} className="nav-link">
                  Map
                </Link>
              </li>
            </ul>

            {currentUser ? (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <span className="nav-link">
                    <Link to={"/profile"} className="nav-link">
                      Welcome, {currentUser.username}!
                    </Link>
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-secondary ms-2"
                    onClick={logOut}
                  >
                    LogOut
                  </button>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav ms-auto headerList">
                <li className="nav-item">
                  <Link to={"/login"} className="btn btn-outline-primary me-2">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/register"} className="btn btn-primary">
                    Sign Up
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route
            path="/login"
            element={<Login setCurrentUser={setCurrentUser} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user" element={<BoardUser />} />
          <Route
            path="/map"
            element={currentUser ? <Map /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
