import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../logo.png";
import { FaSearch } from "react-icons/fa";

const Navbar = ({ currentUser, logOut }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      const source = axios.CancelToken.source();
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/location/search?query=${encodeURIComponent(
            query
          )}`,
          { cancelToken: source.token }
        );
        setSearchResults(response.data);
        setIsDropdownVisible(true);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
          setIsDropdownVisible(false);
        }
      }
      return () => {
        source.cancel("Operation canceled by the user.");
      };
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  };

  const handleClickOutside = (e) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(e.target)
    ) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectResult = (result) => {
    console.log("Result: ", result);
    setSearchQuery(result.name + ", " + result.country);
    setSelectedLocation(result);
    setIsDropdownVisible(false);
    confirmLocation(result);
  };

  const confirmLocation = async (result) => {
    if (!currentUser) {
      alert("User not found. Please log in.");
      return;
    }

    try {
      const requestData = {
        userId: currentUser.id,
        username: currentUser.username,
        latitude: result.latitude,
        longitude: result.longitude,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/weather/request`,
        requestData
      );
      navigate("/weather", { state: { location: response.data } });
    } catch (error) {
      console.error("Error confirming location:", error);
      alert("An error occurred while confirming the location.");
    }
  };

  const handleLogout = () => {
    logOut(); 
    navigate("/login"); 
  };

  useEffect(() => {
    if (searchQuery === "") {
      setIsDropdownVisible(false);
    }
  }, [searchQuery]);

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
            <li className="nav-item">
              <Link to={"/weather"} className="nav-link">
                Forecast
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/weather-alerts"} className="nav-link">
                Weather Alerts
              </Link>
            </li>
          </ul>
          <div className="search-bar-container" ref={searchContainerRef}>
      <input
        type="text"
        className="form-control search-input"
        placeholder="Search for a city..."
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={() => setIsDropdownVisible(true)}
      />
    
      <FaSearch className="search-icon" />

      {isDropdownVisible && searchResults.length > 0 && (
        <ul className="dropdown-menu show">
          {searchResults.map((result, index) => (
            <li
              key={index}
              className="dropdown-item"
              onClick={() => handleSelectResult(result)}
            >
              {result.name}, {result.country}, {result.area}
            </li>
          ))}
        </ul>
      )}
    </div>

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
                  onClick={handleLogout}
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
