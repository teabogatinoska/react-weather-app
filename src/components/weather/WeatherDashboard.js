import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LocationHeader from './LocationHeader';
import CurrentConditions from './CurrentConditions';
import DailyForecastTable from './DailyForecastTable';
import FavoriteCities from './FavoriteCities';
import axios from 'axios';
import './Weather.css';

const WeatherDashboard = ({ currentUser }) => {
  const { state } = useLocation();

  const location = state?.location
    ? {
        name: state.location.name,
        country: state.location.country,
        latitude: state.location.latitude,
        longitude: state.location.longitude,
      }
    : {
        name: "London",
        country: "UK",
        latitude: 51.50853,
        longitude: 0.12574,
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
      const response = await axios.get(`http://localhost:8080/api/location/favorite-locations/${currentUser.id}`);
      setFavoriteCities(response.data);
    } catch (error) {
      console.error('Error fetching favorite cities:', error);
    }
  };

  useEffect(() => {
    fetchFavoriteCities();
  }, [currentUser.id]);

  return (
    <div className="weather-dashboard">
      <div className="left-section">
        <LocationHeader location={location} userId={currentUser.id} refreshFavorites={fetchFavoriteCities} />
        <CurrentConditions location={location} currentUser={currentUser} />
      </div>
      <div className="right-section">
        <FavoriteCities favoriteCities={favoriteCities} currentUser={currentUser}/>
      </div>
      <div className="forecast-section">
        <DailyForecastTable forecast={forecast} />
      </div>
    </div>
  );
};

export default WeatherDashboard;
