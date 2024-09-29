import React from "react";
import { Link } from "react-router-dom";
import logo from "../../logo.png";

const Navbar = ({ currentUser, logOut }) => {
  return (
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
  );
};

export default Navbar;