import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Navbar from "./components/header/NavBar";

import AuthService from "./services/auth-service";

import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import Profile from "./components/authentication/Profile";
import BoardUser from "./components/authentication/BoardUser";

import eventBus from "./common/EventBus";
import Map from "./components/map/Map";
import WeatherDashboard from "./components/weather/WeatherDashboard";

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
     <Navbar currentUser={currentUser} logOut={logOut} />

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
            element={currentUser ? <Map currentUser={currentUser}/> : <Navigate to="/login" replace />}
          /><Route path="/weather" element={<WeatherDashboard currentUser={currentUser} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
