import React, { useState, useEffect } from 'react';
import LocationHeader from './LocationHeader';
import CurrentConditions from './CurrentConditions';
import DailyForecastTable from './DailyForecastTable';
import FavoriteCities from './FavoriteCities';
import axios from 'axios';
import './Weather.css';

const WeatherDashboard = ({ userId }) => {
  const location = { city: "London", country: "UK", latitude: 51.50853, longitude: 0.12574 };
  const currentConditions = {
    temperature: 25,
    wind: 3,
    precipitation: 0,
    humidity: 60,
    airQuality: { pm2_5: 10, pm10: 10 },
  };

  const forecast = [
    { day: "Monday", temperature: "25 / 13", wind: 7, precipitation: 10, humidity: 60 },
    { day: "Tuesday", temperature: "25 / 13", wind: 7, precipitation: 10, humidity: 60 },
    { day: "Wednesday", temperature: "25 / 13", wind: 7, precipitation: 10, humidity: 60 },
    { day: "Thursday", temperature: "25 / 13", wind: 7, precipitation: 10, humidity: 60 }
  ];

  const [favoriteCities, setFavoriteCities] = useState([]);

  const fetchFavoriteCities = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/location/favorite-locations/${userId}`);
      setFavoriteCities(response.data);
    } catch (error) {
      console.error('Error fetching favorite cities:', error);
    }
  };

  useEffect(() => {
    fetchFavoriteCities();
  }, [userId]);

  return (
    <div className="weather-dashboard">
      <div className="left-section">
        <LocationHeader location={location} userId={userId} refreshFavorites={fetchFavoriteCities} />
        <CurrentConditions {...currentConditions} />
      </div>
      <div className="right-section">
        <FavoriteCities favoriteCities={favoriteCities} />
      </div>
      <div className="forecast-section">
        <DailyForecastTable forecast={forecast} />
      </div>
    </div>
  );
};

export default WeatherDashboard;
