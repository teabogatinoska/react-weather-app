import React, { useState } from "react";
import "./Weather.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FavoriteCities = ({ favoriteCities, currentUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 

  const handleCityClick = async (city) => {
    if (loading) return;

    try {
      setLoading(true); 

      const requestData = {
        userId: currentUser.id,
        username: currentUser.username,
        latitude: city.latitude,
        longitude: city.longitude,
      };

      const response = await axios.post(
        "http://localhost:8080/api/weather/request",
        requestData
      );

      console.log("Weather response: ", response.data);
      navigate("/weather", { state: { location: response.data } });
    } catch (error) {
      console.error("Error fetching weather for selected city:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="favorites">
      <h3>Favorites</h3>
      <ul>
        {favoriteCities.length > 0 ? (
          favoriteCities.map((city, index) => (
            <li
              key={index}
              onClick={() => handleCityClick(city)}
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
            >
              {city.name}, {city.country}
            </li>
          ))
        ) : (
          <li>No favorite cities found</li>
        )}
      </ul>
      {loading}
    </div>
  );
};

export default FavoriteCities;
